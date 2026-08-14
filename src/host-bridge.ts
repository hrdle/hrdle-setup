// Talking to the app that framed us.
//
// This guide runs in two places. Opened directly it is a web page: two
// explanation screens and five setup tasks, ending by handing over to the
// phone. Framed by the Hrdle glasses app it is the whole wizard, connect screen
// included — and everything that touches the outside world is done by the host
// on our behalf:
//
//   - **Writing the server address.** It has to go into the *host's* own store,
//     because that is where the G2 reads it from when it starts. Ours is a
//     different origin and does not exist as far as the glasses are concerned.
//   - **Every request to the server.** This was going to be ours — the server
//     answers `Access-Control-Allow-Origin: *`, so CORS is not the problem. The
//     problem is Private Network Access: this page is served from a public
//     origin, a tailnet address is inside CGNAT space, and Chrome refuses the
//     crossing outright. Measured, not assumed — from here, a fetch to
//     api.github.com returns 200 and one to a `.ts.net` host fails to reach the
//     network at all. The host page is not public-origin, so it can.
//
// What stays here is every screen, every sentence and the whole flow, which is
// the point: it can be corrected with a deploy instead of a rebuilt ehpk, an
// upload to EVEN Hub, a version bump and a promotion to Beta.
//
// The host's origin is not knowable (the app is loaded from the Even Hub
// container, which reports its own thing), so messages out go to '*' and
// messages in are checked against `window.parent` instead. What travels is a
// Tailscale URL — worth guarding against confusion, not worth pretending is a
// secret.

/** What the guide asks the host to do. */
export type ToHost =
  | { type: 'hrdle:ready' }
  | { type: 'hrdle:get-url' }
  | { type: 'hrdle:save-url'; url: string }
  | { type: 'hrdle:clear-url' }
  | { type: 'hrdle:resolve-host'; host: string }
  | { type: 'hrdle:connect'; url: string }
  | { type: 'hrdle:settings-get' }
  | { type: 'hrdle:settings-put'; patch: SettingsPatch }
  | { type: 'hrdle:stt-preview' }

/** What the host answers. */
export type FromHost =
  | { type: 'hrdle:host-ready'; app?: AppSummary }
  | { type: 'hrdle:url'; url: string | null }
  | { type: 'hrdle:resolved'; url?: string; error?: string }
  | { type: 'hrdle:connect-result'; ok: boolean; server?: ServerSummary; error?: string }
  | { type: 'hrdle:settings'; view?: GlassesSettingsView; error?: string }
  | { type: 'hrdle:stt-preview-result'; preview?: SttRequestPreview; error?: string }

export interface ServerSummary {
  version: string
  sessions: number
  usage: string
}

/**
 * Which build of the glasses app framed us.
 *
 * The guide redeploys whenever a sentence changes; the app is rebuilt, packed,
 * uploaded and promoted. So the two are never in step, and the version on the
 * device is the half nobody can see. It rides along with the greeting.
 *
 * The commit is there because a version number says which number a build
 * claims, not which code it holds: an unreleased build and the packed ehpk both
 * answer the same `version`. Absent from a host that predates this — an older
 * ehpk greets us exactly as before, and the row is left out.
 */
export interface AppSummary {
  version: string
  /** Short git hash, `+dirty` when the source had uncommitted edits, `nogit`. */
  commit: string
}

export interface SettingsPatch {
  groqApiKey?: string | null
  sttLang?: string | null
  sttBias?: 'on' | 'off' | null
  sttModel?: string | null
  screenOffSeconds?: number | null
  sttEndpointUrl?: string | null
  sttEndpointModel?: string | null
  sttProvider?: 'groq' | 'custom' | null
  sttFallback?: 'on' | 'off' | null
}

/**
 * What the settings screen may see. The Groq key is write-only, so it is absent.
 *
 * So is the prompt that would be sent: this screen has no session, so it never
 * had one to show, and the field that looked as though it did (`effectivePrompt`)
 * was read as the sent value once too often (hrdle#255). `SttRequestPreview` is
 * the answer to that question.
 */
export interface GlassesSettingsView {
  hasApiKey: boolean
  /** Whether the custom endpoint has its own key stored. Optional: a server
   *  older than the two-key split reports nothing here. */
  hasEndpointKey?: boolean
  apiKeySource: 'setting' | 'env' | 'none'
  sttLang: string
  sttLangSource: 'setting' | 'default'
  /** Whether a vocabulary prompt is sent at all. */
  sttBias: boolean
  /** `env` is `HRDLE_STT_PROMPT=off`, which this screen cannot switch back on. */
  sttBiasSource: 'setting' | 'env' | 'default'
  /**
   * Which model transcribes, and every model the server will accept (hrdle#253).
   *
   * Optional because this guide is deployed on its own schedule and meets
   * whichever server someone already has running. Before #253 the model was
   * fixed and none of this was reported; the panel leaves the row out rather
   * than offering a choice that server would reject.
   */
  sttModel?: string
  sttModelSource?: 'setting' | 'default'
  /** Named by the server so this app need not hardcode them. */
  sttModels?: string[]
  /**
   * Seconds of ring silence before the glasses blank their panel; `0` = never.
   *
   * Optional for the same reason the model block is: a server from before the
   * feature reports nothing, and the panel leaves the row out rather than
   * offering a setting that server would drop.
   */
  screenOffSeconds?: number
  screenOffSecondsSource?: 'setting' | 'default'
  /** Where transcription goes when it is not Groq, and where that was decided.
   *  Absent on a server from before the feature; the section hides with it. */
  sttEndpoint?: {
    url: string | null
    model: string | null
    /** Which transcriber speech goes to first. */
    provider: 'groq' | 'custom'
    providerSource: 'setting' | 'default'
    /** Whether the other transcriber is the escape when the chosen one fails. */
    fallback: boolean
    source: 'setting' | 'env' | 'none'
    /** Short name of the target that would be hit right now. */
    destination: string
  }
}

/**
 * What a transcription would actually carry (hrdle#255).
 *
 * The same object the transcription resolves for itself, so this is the sent
 * value rather than a second guess at it. Only the fields this screen reads are
 * declared; the server answers with more.
 */
export interface SttRequestPreview {
  /** `null` sends no vocabulary prompt at all. */
  prompt: string | null
  promptSource: 'composed' | 'env' | 'off'
}

/**
 * How long to wait for a host to announce itself.
 *
 * Being framed is not the same as being framed *by the app* — anyone can put
 * this page in an iframe, and it must not offer to save addresses to a host that
 * is not there. A host that has not answered in this long is treated as absent,
 * and the page is the plain guide again.
 */
const HELLO_TIMEOUT_MS = 1500

type Pending = { resolve: (value: FromHost) => void; want: FromHost['type'] }

let host: Window | null = null
let hostAppSummary: AppSummary | null = null
const waiting: Pending[] = []

function onMessage(event: MessageEvent): void {
  if (event.source !== window.parent) return
  const data = event.data as FromHost | undefined
  if (!data || typeof data.type !== 'string' || !data.type.startsWith('hrdle:')) return

  if (data.type === 'hrdle:host-ready') {
    host = window.parent
    hostAppSummary = data.app ?? null
    return
  }
  const index = waiting.findIndex((p) => p.want === data.type)
  if (index >= 0) waiting.splice(index, 1)[0].resolve(data)
}

/**
 * Say hello and wait to be greeted back.
 *
 * Resolves to whether a host is there. Called once, before the first render, so
 * the wizard knows how many screens it has.
 */
export function connectToHost(): Promise<boolean> {
  if (window.parent === window) return Promise.resolve(false)
  window.addEventListener('message', onMessage)
  window.parent.postMessage({ type: 'hrdle:ready' } satisfies ToHost, '*')
  return new Promise((resolve) => {
    const started = Date.now()
    const tick = setInterval(() => {
      if (host) {
        clearInterval(tick)
        resolve(true)
      } else if (Date.now() - started > HELLO_TIMEOUT_MS) {
        clearInterval(tick)
        resolve(false)
      }
    }, 50)
  })
}

export function hasHost(): boolean {
  return host !== null
}

/** The glasses app build that framed us, if it told us. */
export function hostApp(): AppSummary | null {
  return hostAppSummary
}

function ask<T extends FromHost['type']>(
  message: ToHost,
  want: T,
  timeoutMs: number,
): Promise<Extract<FromHost, { type: T }> | null> {
  if (!host) return Promise.resolve(null)
  return new Promise((resolve) => {
    const pending: Pending = {
      want,
      resolve: (value) => resolve(value as Extract<FromHost, { type: T }>),
    }
    waiting.push(pending)
    host?.postMessage(message, '*')
    setTimeout(() => {
      const index = waiting.indexOf(pending)
      // A host that never answers must not leave the button spinning forever.
      if (index >= 0) {
        waiting.splice(index, 1)
        resolve(null)
      }
    }, timeoutMs)
  })
}

/** The address the host has stored, if any. */
export async function hostUrl(): Promise<string | null> {
  const answer = await ask({ type: 'hrdle:get-url' }, 'hrdle:url', 4000)
  return answer?.url ?? null
}

export function saveHostUrl(url: string): void {
  host?.postMessage({ type: 'hrdle:save-url', url } satisfies ToHost, '*')
}

export function clearHostUrl(): void {
  host?.postMessage({ type: 'hrdle:clear-url' } satisfies ToHost, '*')
}

/**
 * Ask the host to turn what was typed into the server's real address.
 *
 * Short forms (`91.210.90`), bare hostnames and full URLs all arrive here; the
 * host knows how to resolve each because it is the one that can reach a tailnet
 * address at all. This page cannot: it is served from a public origin, and
 * Chrome refuses public-to-private outright.
 */
export async function resolveViaHost(host: string): Promise<{ url?: string; error?: string }> {
  const answer = await ask({ type: 'hrdle:resolve-host', host }, 'hrdle:resolved', 15_000)
  if (!answer) return { error: 'the app did not answer' }
  return { url: answer.url, error: answer.error }
}

/** Ask the host to reach a server and report what it found. */
export async function connectViaHost(
  url: string,
): Promise<{ ok: boolean; server?: ServerSummary; error?: string }> {
  const answer = await ask({ type: 'hrdle:connect', url }, 'hrdle:connect-result', 20_000)
  if (!answer) return { ok: false, error: 'the app did not answer' }
  return { ok: answer.ok, server: answer.server, error: answer.error }
}

async function settings(message: ToHost): Promise<GlassesSettingsView> {
  const answer = await ask(message, 'hrdle:settings', 15_000)
  if (!answer) throw new Error('the app did not answer')
  if (answer.error || !answer.view) throw new Error(answer.error || 'no settings returned')
  return answer.view
}

export function getSettingsViaHost(): Promise<GlassesSettingsView> {
  return settings({ type: 'hrdle:settings-get' })
}

export function putSettingsViaHost(patch: SettingsPatch): Promise<GlassesSettingsView> {
  return settings({ type: 'hrdle:settings-put', patch })
}

/**
 * What a transcription would send right now, asked through the host.
 *
 * Through the host like everything else: this page is a public origin and the
 * server sits on a tailnet address inside CGNAT space, which Private Network
 * Access refuses whatever CORS says.
 */
export async function getSttPreviewViaHost(): Promise<SttRequestPreview> {
  const answer = await ask({ type: 'hrdle:stt-preview' }, 'hrdle:stt-preview-result', 15_000)
  if (!answer) throw new Error('the app did not answer')
  if (answer.error || !answer.preview) throw new Error(answer.error || 'no preview returned')
  return answer.preview
}
