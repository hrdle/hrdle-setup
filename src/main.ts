// Entry point.
//
// One page in two situations. Opened directly it is a guide: five screens of
// preparation and a hand-off to the phone. Framed by the Hrdle glasses app it is
// the whole wizard, and the last two screens do real work — testing a server and
// storing its address.
//
// Which it is gets decided before the first render, by asking whoever framed us
// to say hello. Nothing about the two paths is a build flag; the same bundle
// serves both.

import { normalizeUrl } from './api.ts'
import {
  clearHostUrl,
  connectToHost,
  connectViaHost,
  getSettingsViaHost,
  hasHost,
  hostUrl,
  putSettingsViaHost,
  saveHostUrl,
  scanViaHost,
} from './host-bridge.ts'
import { wireSettingsPanel } from './settings-ui.ts'
import {
  DEFAULT_PORT,
  type StepId,
  getLang,
  parseStep,
  setEmbedded,
  setLang,
  shellHtml,
  stepIndex,
  steps,
  t,
} from './wizard.ts'

const STEP_KEY = 'hrdle-setup-step'
const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app is missing from index.html')

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* private mode: the step still holds for this visit */
  }
}

let step: StepId = 'intro'
let url = ''
let status = ''
let summary: { url: string; version: string; sessions: number; usage: string } | null = null

/**
 * The hash wins over the stored step: a link someone was sent is a deliberate
 * instruction, and the stored one is only where they happened to stop.
 */
function initialStep(): StepId {
  const fromHash = location.hash.replace(/^#\/?/, '')
  if (steps().some((s) => s.id === fromHash)) return fromHash as StepId
  return parseStep(read(STEP_KEY))
}

function goTo(next: StepId): void {
  step = next
  write(STEP_KEY, next)
  // `replaceState` rather than a hash assignment: this should not stack a
  // history entry per screen, or Back becomes a second, worse Back button next
  // to the real one.
  history.replaceState(null, '', `#/${next}`)
  render()
  window.scrollTo({ top: 0 })
}

// ── Connecting ──

/**
 * Ask the host to reach a server and tell us what it found.
 *
 * Not done from this page, though it was written that way first. The server
 * answers `Access-Control-Allow-Origin: *`, so CORS is not the obstacle —
 * Private Network Access is. This page is served from a public origin and a
 * tailnet address sits in CGNAT space, a crossing Chrome refuses outright: from
 * here a fetch to api.github.com returns 200 and one to a `.ts.net` host does
 * not reach the network at all. The host page is not public-origin, so it can.
 */
async function tryConnect(candidate: string): Promise<boolean> {
  const answer = await connectViaHost(candidate)
  if (answer.ok && answer.server) {
    url = candidate
    saveHostUrl(candidate)
    status = `<span class="wiz-ok">${t('connect.connected')}</span>`
    summary = { url: candidate, ...answer.server }
    return true
  }
  status = `<span style="color:#f44">${t('connect.failed', {
    error: answer.error ?? 'unreachable',
  })}</span>`
  return false
}

function paintServer(): void {
  const target = app?.querySelector<HTMLDivElement>('#wiz-server')
  if (!target || !summary) return
  target.innerHTML = `
    <span>${t('done.server')}</span><span style="font-family:ui-monospace,Menlo,monospace; font-size:12px; word-break:break-all">${summary.url}</span>
    <span>${t('done.version')}</span><span>v${summary.version}</span>
    <span>${t('done.sessions')}</span><span>${summary.sessions}</span>
    <span>${t('done.usage')}</span><span>${summary.usage}</span>
  `
}

// ── Rendering ──

function render(): void {
  if (!app) return
  app.innerHTML = shellHtml(step)
  document.title = `${t(`step.${step}`)} — Hrdle`

  const index = stepIndex(step)
  const list = steps()

  app.querySelector('#wiz-next')?.addEventListener('click', () => {
    if (index < list.length - 1) goTo(list[index + 1].id)
  })
  app.querySelector('#wiz-back')?.addEventListener('click', () => {
    if (index > 0) goTo(list[index - 1].id)
  })

  for (const button of app.querySelectorAll<HTMLButtonElement>('[data-lang]')) {
    button.addEventListener('click', () => {
      const lang = button.dataset.lang
      if (lang !== 'en' && lang !== 'ja') return
      if (lang === getLang()) return
      setLang(lang)
      // The status line is stored as markup and would otherwise stay in the
      // language it was written in.
      status = ''
      render()
    })
  }

  for (const button of app.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
    button.addEventListener('click', () => {
      const text = button.parentElement?.querySelector('[data-cmd]')?.textContent?.trim() || ''
      if (!text) return
      navigator.clipboard
        .writeText(text)
        .then(() => {
          button.textContent = t('cmd.copied')
          setTimeout(() => {
            button.textContent = t('cmd.copy')
          }, 1500)
        })
        .catch(() => {
          button.textContent = t('cmd.copyFailed')
        })
    })
  }

  if (step === 'connect') wireConnect()
  if (step === 'done') wireDone()
}

function wireConnect(): void {
  const input = app?.querySelector<HTMLInputElement>('#wiz-url')
  const button = app?.querySelector<HTMLButtonElement>('#wiz-connect')
  const statusEl = app?.querySelector<HTMLDivElement>('#wiz-connect-status')
  const scan = app?.querySelector<HTMLButtonElement>('#wiz-scan')
  const scanStatus = app?.querySelector<HTMLDivElement>('#wiz-scan-status')
  if (!input || !button || !statusEl) return

  input.value = url
  statusEl.innerHTML = status

  input.addEventListener('blur', () => {
    const normalized = normalizeUrl(input.value, DEFAULT_PORT)
    if (normalized) input.value = normalized
  })
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') button.click()
  })

  scan?.addEventListener('click', async () => {
    scan.setAttribute('disabled', '')
    if (scanStatus) {
      scanStatus.innerHTML = `<span style="color:#ff0">${t('connect.opening')}</span>`
    }
    // The camera belongs to the host: this page cannot open it, and asking is
    // the whole reason the frame exists.
    const outcome = await scanViaHost()
    scan.removeAttribute('disabled')
    if (outcome.cancelled) {
      if (scanStatus) scanStatus.innerHTML = ''
      return
    }
    if (outcome.error || !outcome.url) {
      if (scanStatus) {
        scanStatus.innerHTML = `<span style="color:#ff5555">${outcome.error ?? t('scan.noCode')}</span>`
      }
      return
    }
    input.value = normalizeUrl(outcome.url, DEFAULT_PORT)
    if (scanStatus) scanStatus.innerHTML = `<span class="wiz-ok">${t('connect.addressRead')}</span>`
    button.click()
  })

  button.addEventListener('click', async () => {
    const candidate = normalizeUrl(input.value, DEFAULT_PORT)
    if (!candidate) {
      statusEl.innerHTML = `<span style="color:#f44">${t('connect.enterFirst')}</span>`
      return
    }
    input.value = candidate
    button.setAttribute('disabled', '')
    statusEl.innerHTML = `<span style="color:#ff0">${t('connect.connecting')}</span>`
    const ok = await tryConnect(candidate)
    if (ok) {
      goTo('done')
      return
    }
    button.removeAttribute('disabled')
    statusEl.innerHTML = status
  })
}

function wireDone(): void {
  paintServer()
  void wireSettingsPanel({ get: getSettingsViaHost, put: putSettingsViaHost })
  app?.querySelector('#wiz-disconnect')?.addEventListener('click', () => {
    clearHostUrl()
    url = ''
    status = ''
    summary = null
    goTo('connect')
  })
}

// ── Start ──

async function start(): Promise<void> {
  setEmbedded(await connectToHost())
  step = initialStep()

  // A stored address means this phone has connected before. Try it before
  // showing anything: someone returning to a working setup should not be walked
  // through a wizard they already finished.
  if (hasHost()) {
    const saved = await hostUrl()
    if (saved) {
      url = saved
      if (await tryConnect(saved)) {
        goTo('done')
        return
      }
      if (step === 'done') step = 'connect'
    } else if (step === 'done') {
      step = 'connect'
    }
  }

  render()
}

window.addEventListener('hashchange', () => {
  const next = initialStep()
  if (next !== step) {
    step = next
    write(STEP_KEY, next)
    render()
  }
})

void start()
