// The setup guide: two explanation screens, five setup tasks, then a hand-off
// to the phone.
//
// Why this is a site and not part of the glasses app: the commands on these
// screens are typed on a machine that is usually not the phone reading them, and
// a page you can open *on that machine* is one you can copy out of. The rest of
// the setup lives in the app because it needs things a web page cannot have —
// the host's own store, which is where the G2 reads the server address from, and
// the host's reach into a tailnet, which this public origin does not have. Those
// two screens stay there; everything before them is here, where a wording change
// costs a deploy rather than a rebuilt ehpk, a store upload and a version bump.
//
// The app embeds this guide, so the preparation screens have one source of
// truth. The settings panel is also copied into hrdle/hrdle's simulator and its
// shared wording must stay in step there.

import { BRAND_CSS, brandIcon } from './brand.ts'
import { settingsPanelHtml } from './settings-ui.ts'
import { BINARY_NAME, DEFAULT_PORT, INSTALL_CMD, PRODUCT_NAME, REPO } from './identity.ts'
import { type Lang, getLang, setLang, t } from './i18n.ts'

export type StepId =
  | 'intro'
  | 'how'
  | 'machine'
  | 'agent'
  | 'tailscale'
  | 'install'
  | 'groq'
  | 'outro'
  | 'connect'
  | 'done'

interface Step {
  id: StepId
  where: 'machine' | 'phone'
}

const PREPARATION: readonly Step[] = [
  { id: 'intro', where: 'phone' },
  { id: 'how', where: 'phone' },
  { id: 'machine', where: 'machine' },
  { id: 'agent', where: 'machine' },
  { id: 'tailscale', where: 'machine' },
  { id: 'install', where: 'machine' },
  // Getting the key is machine work and needs no server, so it belongs in the
  // preparation. Pasting it needs one, and happens on the last screen.
  { id: 'groq', where: 'machine' },
]

/**
 * Which screens exist depends on who is reading.
 *
 * Opened as a page there is no host, so connecting is impossible — the address
 * would have nowhere to go that the glasses can see. That reader gets the
 * preparation and a hand-off. Framed by the app, the last two screens are real
 * and the hand-off would be telling someone to go where they already are.
 */
let embedded = false

export function setEmbedded(value: boolean): void {
  embedded = value
}

export function steps(): readonly Step[] {
  return embedded
    ? [...PREPARATION, { id: 'connect', where: 'phone' } as const, { id: 'done', where: 'phone' } as const]
    : [...PREPARATION, { id: 'outro', where: 'phone' } as const]
}

export function stepIndex(id: StepId): number {
  return steps().findIndex((s) => s.id === id)
}

export function parseStep(value: string | null): StepId {
  return steps().some((s) => s.id === value) ? (value as StepId) : 'intro'
}

// ── Markup helpers ──

function cmd(text: string): string {
  return `<div class="wiz-cmd"><span data-cmd>${text}</span><button type="button" data-copy>${t('cmd.copy')}</button></div>`
}

function link(href: string, label: string): string {
  return `<a class="wiz-link" href="${href}" target="_blank" rel="noreferrer">${label}</a>`
}

function linkButton(href: string, label: string): string {
  return `<a class="wiz-linkbtn" href="${href}" target="_blank" rel="noreferrer">${label}</a>`
}

/**
 * A device, drawn small.
 *
 * Line art rather than emoji: the repository bans emoji outside two functional
 * cases, and more usefully these have to sit on a dark panel at 26px and still
 * read as *which* device. A screen, a phone and a pair of glasses is all the
 * detail that survives at that size.
 */
function glyph(kind: 'machine' | 'phone' | 'glasses'): string {
  const common = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"'
  const inner =
    kind === 'machine'
      ? `<rect x="2.5" y="3.5" width="19" height="13" rx="1.8" ${common}/>
         <path d="M8.5 20.5h7M12 16.5v4" ${common} stroke-linecap="round"/>`
      : kind === 'phone'
        ? `<rect x="6.5" y="2.5" width="11" height="19" rx="2.4" ${common}/>
           <path d="M10.5 18.5h3" ${common} stroke-linecap="round"/>`
        : `<rect x="1.5" y="8.5" width="8.5" height="7" rx="2" ${common}/>
           <rect x="14" y="8.5" width="8.5" height="7" rx="2" ${common}/>
           <path d="M10 11.5h4" ${common} stroke-linecap="round"/>`
  return `<svg class="net-glyph" viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`
}

/**
 * What the phone is actually showing.
 *
 * A labelled rectangle called "phone" tells someone nothing about what they get.
 * Three session rows with status dots is the app's real first screen, small
 * enough to be an illustration and specific enough to be an answer.
 */
function phoneScreen(): string {
  const rows: Array<[string, string]> = [
    ['hrdle-work-2', 'busy'],
    ['glasses', 'ask'],
    ['api', 'idle'],
  ]
  return `<div class="mini phone-mini">${rows
    .map(([name, state]) => `<div class="mini-row"><i class="dot ${state}"></i>${name}</div>`)
    .join('')}</div>`
}

/**
 * What the G2 is actually showing.
 *
 * Green on black in seven lines, because that is what the hardware draws — the
 * one place in this whole site where the green is not a mistake. It runs the
 * same twelve-second loop as everything else: the question appears when the
 * question arrives, the choice highlights when it is answered, and it clears.
 */
function glassesScreen(): string {
  return `<div class="mini g2-mini">
    <div class="g2-head">hrdle-work-2</div>
    <div class="g2-body">Apply this refactor?</div>
    <div class="g2-choice"><span class="g2-pick">yes</span> &nbsp;no</div>
    <div class="g2-foot">tap:select</div>
  </div>`
}

/**
 * Sessions being made, split and typed into.
 *
 * The claim on this screen is that a session is yours to open, split and send
 * to. Written down that is four verbs; shown, it is a pane appearing beside
 * another one and a line of text landing in it. The demo runs the verbs in
 * order and starts over.
 */
function paneDemo(): string {
  return `<div class="demo">
    <div class="panes">
      <div class="pane d1"><b>claude</b><i class="caret"></i></div>
      <div class="pane d2"><b>kimi</b><i class="caret"></i></div>
      <div class="pane d3"><b>codex</b><i class="caret"></i></div>
    </div>
    <div class="demo-cap"><span class="c0">${t('demo.one')}</span><span class="c1">${t('demo.split')}</span><span class="c2">${t('demo.more')}</span><span class="c3">${t('demo.send')}</span></div>
  </div>`
}

/**
 * One agent handing work to another, where you can see it.
 *
 * Two panes and a thing crossing between them. The point is not that it is
 * possible — it is that it is *visible*, so the drawing has to show the message
 * arriving somewhere you could have been watching.
 */
function talkDemo(): string {
  return `<div class="demo">
    <div class="panes talk">
      <div class="pane"><b>claude</b><em class="say-out">run the tests</em></div>
      <div class="pane"><b>kimi</b><em class="say-in">ok, running</em></div>
      <span class="msg"></span>
    </div>
    <div class="demo-cap"><span class="t0">${t('demo.watch')}</span></div>
  </div>`
}

/** One box in the diagram. `inside` nests a second frame within it. */
function node(
  kind: 'machine' | 'phone' | 'glasses',
  title: string,
  note: string,
  inside = '',
  badge = '',
): string {
  return `<div class="net-node">
    <div class="net-head">${glyph(kind)}<div class="net-text"><b>${title}</b><span>${note}</span></div>${badge}</div>
    ${inside}
  </div>`
}

/**
 * What sits inside the machine.
 *
 * Drawn rather than described because it is the part people do not expect: the
 * agents are not each in their own box reporting upward, they are side by side
 * inside one thing, and that is what makes one able to drive another. A
 * paragraph saying so reads as a feature list; a frame around four names reads
 * as an arrangement.
 */
function agentsInside(): string {
  const names = ['Claude Code', 'Codex', 'Grok', 'Kimi']
  return `<div class="net-inner">
    <div class="net-inner-top">${t('how.herdr')}</div>
    <div class="net-agents">${names.map((n, i) => `<span class="a${i}">${n}</span>`).join('')}</div>
    <div class="net-handoff"><span class="net-dart"></span><em>${t('how.handoff')}</em></div>
  </div>`
}

/**
 * The gap between two boxes, with the line running through the middle of it.
 *
 * The first version put a thin rule down the left margin beside a paragraph, and
 * it did not read as a diagram at all — it read as three cards with notes
 * between them, which is what it was. A line that leaves the box it came from
 * and enters the next one is the whole difference.
 */
function hop(label: string, sub: string, wan: boolean, order: number): string {
  // `order` staggers the two hops so a question is seen travelling outward and
  // an answer travelling back, rather than both ends blinking at once.
  const wire = `<span class="net-wire${wan ? ' wan' : ''} leg${order}"></span>`
  return `<div class="net-hop">${wire}<span class="net-label"><b>${label}</b>${sub}</span>${wire}</div>`
}

function screenHtml(id: StepId): { title: string; html: string } {
  const product = PRODUCT_NAME
  const binary = BINARY_NAME

  switch (id) {
    case 'intro':
      return {
        title: t('intro.title'),
        html: `
          <div class="wiz-hero">${brandIcon('hero', 118)}</div>
          <p class="wiz-lead">${t('intro.lead')}</p>
          <div class="wiz-card">
            <h3>${t('intro.nameTitle')}</h3>
            <p>${t('intro.name', { product })}</p>
          </div>

          ${paneDemo()}
          <div class="wiz-card">
            <h3>${t('intro.diffTitle')}</h3>
            <p>${t('intro.diff', { product })}</p>
          </div>
          <div class="wiz-card">
            <h3>${t('intro.rivalEvenTitle')}</h3>
            <p>${t('intro.rivalEven', { product })}</p>
          </div>
          <div class="wiz-card">
            <h3>${t('intro.rivalCmuxTitle')}</h3>
            <p>${t('intro.rivalCmux')}</p>
          </div>
          <div class="wiz-card">
            <h3>${t('intro.rivalHerdrTitle')}</h3>
            <p>${t('intro.rivalHerdr', { product })}</p>
          </div>
          <div class="wiz-card wiz-warn">
            <h3>${t('intro.gapTitle')}</h3>
            <p>${t('intro.gap', { product })}</p>
            <p>${t('intro.gap2', { product })}</p>
          </div>

          ${talkDemo()}
          <div class="wiz-card">
            <h3>${t('intro.seeTitle')}</h3>
            <p>${t('intro.see')}</p>
          </div>

          <div class="wiz-card wiz-warn">
            <h3>${t('intro.freeTitle')}</h3>
            <p>${t('intro.free')}</p>
          </div>

          <div class="wiz-card">
            <h3>${t('intro.whatTitle')}</h3>
            <p>${t('intro.what', { product })}</p>
            <ul class="wiz-points" style="margin-top:10px">
              <li>${t('intro.get1')}</li>
              <li>${t('intro.get2')}</li>
              <li>${t('intro.get3')}</li>
              <li>${t('intro.get4')}</li>
            </ul>
          </div>
          <p class="wiz-note">${t('intro.time')}</p>
          <p class="wiz-note">${t('intro.openOnDesktop')}</p>
        `,
      }

    case 'how':
      return {
        title: t('how.title'),
        html: `
          <p class="wiz-lead">${t('how.lead')}</p>
          <div class="wiz-card wiz-warn">
            <h3>${t('shot.speakTitle')}</h3>
            <p>${t('shot.speak')}</p>
          </div>
          <figure class="shot">
            <img src="/shots/g2-asking.png" alt="" width="576" height="288" loading="lazy">
            <figcaption><b>${t('shot.askTitle')}</b>${t('shot.ask')}</figcaption>
          </figure>
          <figure class="shot">
            <img src="/shots/g2-choosing.png" alt="" width="576" height="288" loading="lazy">
            <figcaption><b>${t('shot.chooseTitle')}</b>${t('shot.choose')}</figcaption>
          </figure>
          <p class="wiz-note" style="text-align:center; margin:0 0 20px">${t('shot.rest')}</p>
          <div class="net">
            ${node(
              'machine',
              t('intro.net.machine'),
              t('intro.net.machineDesc', { product }),
              agentsInside(),
              '<span class="net-state"><i class="net-busy"></i><i class="net-wait"></i></span>',
            )}
            ${hop(t('intro.net.tailscale'), t('intro.net.tailscaleWire'), true, 0)}
            ${node('phone', t('intro.net.phone'), t('intro.net.phoneDesc', { product }), phoneScreen())}
            ${hop(t('intro.net.bluetooth'), t('intro.net.bluetoothWire'), false, 1)}
            ${node(
              'glasses',
              t('intro.net.glasses'),
              t('intro.net.glassesDesc'),
              glassesScreen(),
              '<span class="net-ask">?</span>',
            )}
          </div>
          <p class="wiz-note" style="text-align:center; margin:0 0 18px">${t('how.caption')}</p>
          <div class="wiz-card wiz-warn">
            <h3>${t('how.dogfoodTitle')}</h3>
            <p>${t('how.dogfoodShort')}</p>
          </div>
        `,
      }

    case 'machine':
      return {
        title: t('machine.title'),
        html: `
          <p class="wiz-lead">${t('machine.lead')}</p>
          <div class="wiz-card">
            <h3>${t('machine.supported')}</h3>
            <div class="wiz-kv">
              <span>${t('machine.linux')}</span><span>${t('machine.linuxArch')}</span>
              <span>${t('machine.macos')}</span><span>${t('machine.macosArch')}</span>
            </div>
          </div>
          <div class="wiz-card">
            <h3>${t('machine.headlessTitle')}</h3>
            <p>${t('machine.headless')}</p>
          </div>
          <div class="wiz-card">
            <h3>${t('machine.awakeTitle')}</h3>
            <p>${t('machine.awake1')}</p>
            <p>${t('machine.awake2')}</p>
          </div>
          <div class="wiz-card">
            <h3>${t('machine.vpsTitle')}</h3>
            <p>${t('machine.vps1')}</p>
            <p class="wiz-note">${t('machine.vps2')}</p>
          </div>
        `,
      }

    case 'agent':
      return {
        title: t('agent.title'),
        html: `
          <p class="wiz-lead">${t('agent.lead', { product })}</p>
          <div class="wiz-card">
            <h3>${t('agent.claudeTitle')}</h3>
            ${cmd('npm install -g @anthropic-ai/claude-code')}
            <p class="wiz-note">${t('agent.claudeNote')}</p>
          </div>
          <div class="wiz-card wiz-warn">
            <h3>${t('agent.signInTitle')}</h3>
            <p>${t('agent.signIn')}</p>
          </div>
          <p class="wiz-note">${t('agent.others')}</p>
        `,
      }

    case 'tailscale':
      return {
        title: t('tailscale.title'),
        html: `
          <p class="wiz-lead">${t('tailscale.lead')}</p>
          <div class="wiz-card">
            <h3>${t('tailscale.linux')}</h3>
            ${cmd('curl -fsSL https://tailscale.com/install.sh | sh')}
            <h3 style="margin-top:12px">${t('tailscale.macos')}</h3>
            ${cmd('brew install tailscale')}
            <p class="wiz-note">${t('tailscale.brewNote')}</p>
          </div>
          <div class="wiz-card">
            <h3>${t('tailscale.certTitle')}</h3>
            ${cmd('sudo tailscale set --operator=$USER')}
            <p class="wiz-note">${t('tailscale.certNote', { binary })}</p>
          </div>
          <p class="wiz-note">${t('tailscale.downloads', {
            link: link('https://tailscale.com/download', t('tailscale.downloadsLabel')),
          })}</p>
        `,
      }

    case 'groq':
      return {
        title: t('groq.title'),
        html: `
          <p class="wiz-lead">${t('groq.lead')}</p>
          <div class="wiz-card">
            <h3>${t('groq.whyTitle')}</h3>
            <p>${t('groq.why')}</p>
          </div>
          <div class="wiz-card">
            <h3>${t('groq.step1')}</h3>
            <p class="wiz-note">${t('groq.step1Note')}</p>
            ${linkButton('https://console.groq.com/keys', t('groq.openConsole'))}
            ${cmd('https://console.groq.com/keys')}
          </div>
          <div class="wiz-card">
            <h3>${t('groq.step2')}</h3>
            <p class="wiz-note">${t('groq.step2Note')}</p>
          </div>
          ${
            embedded
              ? `<div class="wiz-card">
                   <h3>${t('groq.step3')}</h3>
                   <p class="wiz-note">${t('groq.pasteNote')}</p>
                   <input id="groq-key" class="wiz-input" type="password" autocomplete="off"
                          inputmode="text" autocapitalize="off" spellcheck="false"
                          placeholder="${t('groq.pastePlaceholder')}" />
                   <div style="display:flex; gap:8px; margin-top:10px">
                     <button type="button" class="wiz-scan" id="groq-hold"
                             style="margin:0">${t('groq.pasteSave')}</button>
                     <button type="button" class="wiz-ghost" id="groq-forget">${t('groq.pasteClear')}</button>
                   </div>
                   <div id="groq-status" class="wiz-status"></div>
                 </div>`
              : `<div class="wiz-card">
                   <h3>${t('groq.step3Later')}</h3>
                   <p class="wiz-note">${t('groq.step3Note')}</p>
                 </div>`
          }
          <div class="wiz-card wiz-warn">
            <h3>${t('groq.privacyTitle')}</h3>
            <p>${t('groq.privacy', {
              product,
              dataPolicy: link('https://console.groq.com/docs/your-data', t('groq.dataPolicy')),
            })}</p>
          </div>
        `,
      }

    case 'install':
      return {
        title: t('install.title', { product }),
        html: `
          <p class="wiz-lead">${t('install.lead')}</p>
          ${cmd(INSTALL_CMD)}
          <div class="wiz-card">
            <h3>${t('install.whatTitle')}</h3>
            <p>${t('install.what', { binary, herdr: link('https://herdr.dev/', 'herdr') })}</p>
            <p class="wiz-note">${t('install.sudoNote', { binary })}</p>
          </div>
          <div class="wiz-card">
            <h3>${t('install.passwordTitle')}</h3>
            <p class="wiz-note">${t('install.password')}</p>
            ${cmd(`${binary} setup -P 'REPLACE_WITH_A_STRONG_PASSWORD'`)}
          </div>
        `,
      }

    case 'connect':
      return {
        title: t('connect.title', { product }),
        html: `
          <p class="wiz-lead">${t('connect.lead')}</p>
          <div class="wiz-card">
            <h3>${t('connect.tailscaleTitle')}</h3>
            ${linkButton('https://play.google.com/store/apps/details?id=com.tailscale.ipn', 'Google Play')}
            ${linkButton('https://apps.apple.com/app/tailscale/id1470499037', 'App Store')}
            <p class="wiz-note">${t('connect.tailscaleNote')}</p>
            ${cmd('https://tailscale.com/download')}
          </div>
          <div class="wiz-card">
            <h3>${t('connect.addressTitle')}</h3>
            <p class="wiz-note">${t('connect.addressNote', { binary })}</p>
            ${cmd(`${binary} address`)}
            <input id="wiz-url" class="wiz-input" type="text" inputmode="url" autocapitalize="off"
                   autocorrect="off" spellcheck="false" placeholder="91.210.90" />
            <p class="wiz-note">${t('connect.addressForms')}</p>
          </div>
          <div id="wiz-connect-status" class="wiz-status"></div>
          <div class="wiz-card" style="margin-top:14px">
            <h3>${t('connect.troubleTitle')}</h3>
            <p class="wiz-note">${t('connect.trouble', { binary })}</p>
          </div>
        `,
      }

    case 'done':
      return {
        title: t('done.title'),
        html: `
          <div class="wiz-card" style="border-color:#1a3a1a; background:#0a1a0a">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px">
              <div class="wiz-dot"></div>
              <h3 class="wiz-ok" style="margin:0">${t('done.connected')}</h3>
            </div>
            <div id="wiz-server" class="wiz-kv"></div>
          </div>
          <div class="wiz-card">
            <h3>${t('done.launchTitle')}</h3>
            <p>${t('done.launch', { product })}</p>
          </div>
          ${settingsPanelHtml()}
          <button type="button" class="wiz-ghost wiz-wide" id="wiz-disconnect">${t('done.disconnect')}</button>
        `,
      }

    case 'outro':
      return {
        title: t('outro.title'),
        html: `
          <p class="wiz-lead">${t('outro.lead', { product })}</p>
          <div class="wiz-card">
            <h3>${t('outro.step1Title')}</h3>
            <p>${t('outro.step1', { product })}</p>
          </div>
          <div class="wiz-card">
            <h3>${t('outro.step2Title')}</h3>
            <p>${t('outro.step2')}</p>
          </div>
          <div class="wiz-card">
            <h3>${t('outro.addressGoneTitle')}</h3>
            <p class="wiz-note">${t('outro.addressGone')}</p>
            ${cmd(`${binary} address`)}
          </div>
          ${linkButton(`https://github.com/${REPO}`, `${product} on GitHub`)}
        `,
      }
  }
}

// ── Shell ──

const CSS = `
  :root { color-scheme: dark; }
  body { margin:0; background:#0a0a0a; }
  .wiz { font-family: -apple-system, 'Helvetica Neue', Segoe UI, sans-serif; background:#0a0a0a;
         color:#eee; min-height:100vh; display:flex; flex-direction:column;
         max-width:560px; margin:0 auto;
         --panel-accent:#ff6167; --panel-accent-strong:#c9272e; }
  .wiz * { box-sizing:border-box; }
  .wiz-top { padding:16px 20px 0; }
  .wiz-brand { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
  .wiz-mark { width:28px; height:28px; border-radius:8px; overflow:hidden; flex-shrink:0; }
  .wiz-name { font-size:14px; font-weight:700; letter-spacing:.02em; }
  .wiz-langs { margin-left:auto; display:flex; gap:4px; }
  .wiz-lang { background:transparent; border:1px solid #2e2e2e; color:#777; border-radius:99px;
              font-size:10.5px; padding:3px 9px; cursor:pointer; }
  .wiz-lang.on { border-color:#5a2226; color:#ff8a8f; }
  .wiz-bar { height:3px; background:#1a1a1a; border-radius:2px; overflow:hidden; }
  .wiz-bar i { display:block; height:100%;
               background:linear-gradient(to right, #8c1f24, #ff5a60); transition:width .25s ease; }
  .wiz-meta { display:flex; justify-content:space-between; align-items:center;
              font-size:11px; color:#666; margin-top:8px; }
  .wiz-where { border:1px solid #333; border-radius:99px; padding:2px 9px; font-size:10.5px; }
  .wiz-where.machine { color:#ff9a6b; border-color:#5a3324; }
  .wiz-where.phone { color:#a8b4c4; border-color:#3a4048; }
  .wiz-body { flex:1; padding:18px 20px 8px; }
  .wiz-title { font-size:21px; font-weight:700; margin:0 0 8px; line-height:1.3; }
  .wiz-lead { font-size:14px; color:#aaa; line-height:1.65; margin:0 0 16px; }
  .wiz-card { background:#111; border:1px solid #222; border-radius:12px; padding:14px; margin-bottom:12px; }
  .wiz-card h3 { font-size:13px; color:#ff6167; font-weight:600; margin:0 0 8px; }
  .wiz-card p { font-size:13px; color:#bbb; line-height:1.65; margin:0 0 8px; }
  .wiz-card p:last-child { margin-bottom:0; }
  .wiz-note { font-size:12px; color:#888; line-height:1.6; margin:8px 0 0; }
  .wiz-warn { border-color:#5a2226; background:#180c0d; }
  .wiz-warn h3 { color:#ff8a8f; }
  .wiz-points { list-style:none; padding:0; margin:0; font-size:13px; color:#bbb; line-height:1.6; }
  .wiz-points li { display:flex; gap:9px; margin-bottom:8px; }
  .wiz-points li:last-child { margin-bottom:0; }
  .wiz-points li::before { content:'\\25C6'; color:#e0353c; font-size:11px; line-height:1.5; }
  .wiz-cmd { position:relative; background:#0d0d0d; border:1px solid #232323; border-radius:8px;
             padding:11px 66px 11px 11px; font-family:ui-monospace, SFMono-Regular, Menlo, monospace;
             font-size:12px; color:#ff9d9d; word-break:break-all; line-height:1.6; margin:8px 0; }
  .wiz-cmd button { position:absolute; top:6px; right:6px; background:#282828; border:none; color:#bbb;
                    font-size:11px; padding:4px 9px; border-radius:5px; cursor:pointer; }
  .wiz code { font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:.9em;
              color:#e8a0a0; background:#1a1414; padding:1px 5px; border-radius:4px; }
  .wiz-kv { display:grid; grid-template-columns:auto 1fr; gap:5px 12px; font-size:13px; color:#ccc; }
  .wiz-kv span:nth-child(odd) { color:#888; }
  /* The diagram. Boxes centred, the line running through the middle of the gaps
     rather than down the margin — that alone is what makes it read as a figure
     instead of three cards with notes between them. */
  .net { margin:4px 0 18px; display:flex; flex-direction:column; align-items:stretch; }
  .net-node { background:#121212; border:1px solid #333; border-radius:12px; padding:14px 16px; }
  .net-head { display:flex; align-items:center; gap:13px; }
  /* herdr, drawn inside the machine rather than named beside it — the agents
     sitting side by side in one frame is the thing that explains why one can
     drive another. */
  .net-inner { margin-top:12px; border:1px dashed #4a4a4a; border-radius:9px; padding:10px 11px; }
  .net-inner-top { font-size:10.5px; color:#8d8d8d; margin-bottom:8px; }
  .net-agents { display:flex; flex-wrap:wrap; gap:6px; }
  .net-agents span { font-size:11px; color:#ddd; background:#1e1e1e; border:1px solid #333;
                     border-radius:6px; padding:4px 8px; }
  .net-inner-note { font-size:10.5px; color:#ff8a8f; margin-top:8px; }
  .net-glyph { width:26px; height:26px; flex-shrink:0; color:#ff8a8f; }
  .net-text b { display:block; font-size:14px; color:#f0f0f0; margin-bottom:2px; }
  .net-text span { display:block; font-size:12px; color:#8d8d8d; line-height:1.5; }
  .net-hop { display:flex; flex-direction:column; align-items:center; gap:5px; padding:5px 0; }
  /* One twelve-second loop, shared by everything in the figure: the agents work,
     one hands off to another, a question travels out to the glasses, an answer
     comes back, work resumes. Told rather than captioned — the whole point of
     the product is that work reaches you where you are, and a still picture says
     nothing about the reaching.
     Timeline: 0-30% working, 20-30% hand-off, 33-42% question outward,
     44-64% waiting on the wearer, 66-75% answer back, 78-100% working again. */
  .net-wire { position:relative; width:2px; height:24px; background:#7a2a30; border-radius:2px; }
  .net-wire.wan { background:repeating-linear-gradient(#7a2a30 0 3px, transparent 3px 7px); }
  .net-wire::after, .net-wire::before {
    content:''; position:absolute; left:-2px; width:6px; height:10px; border-radius:3px; opacity:0;
  }
  /* Question, outward. */
  .net-wire::after { background:linear-gradient(#ff5a60,#ffd9d2); box-shadow:0 0 8px #ff5a60;
                     animation:net-out 12s linear infinite; }
  /* Answer, back. Cooler, so the two directions are not the same event twice. */
  .net-wire::before { background:linear-gradient(#d9f7e4,#4ade80); box-shadow:0 0 8px #4ade80;
                      animation:net-back 12s linear infinite; }
  .net-wire.leg1::after { animation-delay:0.55s }
  .net-wire.leg1::before { animation-delay:-0.55s }
  @keyframes net-out {
    0%, 33%   { top:-10px; opacity:0 }
    35%       { top:-4px;  opacity:1 }
    42%       { top:22px;  opacity:1 }
    44%, 100% { top:26px;  opacity:0 }
  }
  @keyframes net-back {
    0%, 66%   { top:26px; opacity:0 }
    68%       { top:22px; opacity:1 }
    75%       { top:-4px; opacity:1 }
    77%, 100% { top:-10px; opacity:0 }
  }
  /* The agents take turns, then one hands to another. */
  .net-agents span { animation:net-agent 12s linear infinite; }
  .net-agents .a1 { animation-delay:1.1s }
  .net-agents .a2 { animation-delay:2.2s }
  .net-agents .a3 { animation-delay:3.3s }
  @keyframes net-agent {
    0%, 9%, 100%  { border-color:#333; color:#ddd; background:#1e1e1e; }
    3%            { border-color:#c9272e; color:#fff; background:#2a1416; }
    66%, 74%      { border-color:#333; }
    70%           { border-color:#c9272e; color:#fff; background:#2a1416; }
  }
  /* The hand-off itself: a dart crossing the row of names. */
  .net-handoff { position:relative; margin-top:9px; height:14px; }
  .net-handoff em { position:absolute; left:0; top:0; font-style:normal; font-size:10.5px;
                    color:#ff8a8f; opacity:0; animation:net-handoff-label 12s linear infinite; }
  .net-dart { position:absolute; top:4px; width:16px; height:2px; border-radius:2px;
              background:linear-gradient(90deg, transparent, #ff5a60); opacity:0;
              animation:net-dart 12s linear infinite; }
  @keyframes net-dart {
    0%, 18%   { left:6%;  opacity:0 }
    21%       { opacity:1 }
    28%       { left:62%; opacity:1 }
    30%, 100% { left:70%; opacity:0 }
  }
  @keyframes net-handoff-label { 0%,19%,32%,100% { opacity:0 } 22%,29% { opacity:1 } }
  /* The machine is busy, except while it is waiting on the wearer. */
  .net-state { margin-left:auto; display:flex; align-items:center; }
  .net-busy { width:7px; height:7px; border-radius:50%; background:#4ade80;
              animation:net-busy 12s linear infinite; }
  .net-wait { display:none }
  @keyframes net-busy {
    0%, 42%   { opacity:1; transform:scale(1) }
    44%, 64%  { opacity:.22; transform:scale(.8) }
    66%, 100% { opacity:1; transform:scale(1) }
  }
  /* The question, sitting on the glasses until it is answered. */
  .net-ask { margin-left:auto; width:20px; height:20px; border-radius:50%; background:#c9272e;
             color:#fff; font-size:12px; font-weight:700; display:flex; align-items:center;
             justify-content:center; opacity:0; animation:net-ask 12s linear infinite; }
  @keyframes net-ask {
    0%, 43%   { opacity:0; transform:scale(.6) }
    46%, 64%  { opacity:1; transform:scale(1) }
    67%, 100% { opacity:0; transform:scale(.6) }
  }
  /* What the glasses actually draw, captured from the simulator that renders
     exactly what the device does — same 576x288, same seven lines, same green.
     A drawing of this would have been easier and would have been worth less:
     the only thing that answers "what will I see?" is the thing itself. */
  .shot { margin:0 0 20px; }
  .shot img { display:block; width:100%; height:auto; background:#050805; border-radius:10px;
              border:1px solid #1e3a24; }
  .shot figcaption { font-size:12.5px; color:#8d8d8d; line-height:1.65; margin-top:10px; }
  .shot figcaption b { display:block; color:#ff6167; font-size:13px; margin-bottom:4px; }
  /* Demos. Both run a ten-second loop of their own — these are claims being
     shown rather than a system being diagrammed, so they do not need to share
     the figure's clock. */
  .demo { margin:2px 0 14px; }
  .panes { display:flex; gap:4px; height:74px; }
  .pane { position:relative; flex:1; min-width:0; border:1px solid #2f2f2f; border-radius:7px;
          background:#0e0e0e; padding:7px 8px; font-family:ui-monospace, Menlo, monospace;
          overflow:hidden; }
  .pane b { display:block; font-size:9.5px; color:#7d7d7d; font-weight:400; }
  .caret { position:absolute; left:8px; top:26px; width:6px; height:11px; background:#ff8a8f;
           animation:caret 1s steps(2) infinite; }
  .d2, .d3 { flex-grow:0; opacity:0; padding-left:0; padding-right:0; border-width:0; }
  .d2 { animation:pane-in 10s linear infinite; animation-delay:0s }
  .d3 { animation:pane-in 10s linear infinite; animation-delay:1.6s }
  @keyframes caret { 0% { opacity:1 } 50% { opacity:0 } }
  @keyframes pane-in {
    0%, 22%   { flex-grow:0; opacity:0; border-width:0; padding-left:0; padding-right:0 }
    30%, 88%  { flex-grow:1; opacity:1; border-width:1px; padding-left:8px; padding-right:8px }
    96%, 100% { flex-grow:0; opacity:0; border-width:0; padding-left:0; padding-right:0 }
  }
  .demo-cap { position:relative; height:15px; margin-top:7px; }
  .demo-cap span { position:absolute; left:0; right:0; text-align:center; font-size:10.5px;
                   color:#ff8a8f; opacity:0; animation:cap 10s linear infinite; }
  /* Scoped on purpose. The rule above sets 'animation' as a shorthand, which
     carries an implicit zero delay, and it beats a bare class selector on
     specificity — so every caption ran at once and printed on top of the others,
     which is exactly what the device showed. */
  .demo-cap .c1 { animation-delay:2.2s }
  .demo-cap .c2 { animation-delay:4.2s }
  .demo-cap .c3 { animation-delay:6.4s }
  @keyframes cap { 0%,1% { opacity:0 } 4%,18% { opacity:1 } 21%,100% { opacity:0 } }
  /* The hand-off, seen. */
  .talk { position:relative }
  .say-out, .say-in { display:block; margin-top:5px; font-size:10px; font-style:normal;
                      color:#ddd; opacity:0; animation:say 10s linear infinite }
  .say-in { color:#4ade80; animation-delay:2.4s }
  @keyframes say { 0%,8% { opacity:0 } 14%,74% { opacity:1 } 82%,100% { opacity:0 } }
  .msg { position:absolute; top:34px; width:7px; height:7px; border-radius:50%; background:#ff5a60;
         box-shadow:0 0 8px #ff5a60; opacity:0; animation:msg 10s linear infinite }
  @keyframes msg {
    0%, 16%   { left:26%; opacity:0 }
    19%       { opacity:1 }
    23%       { left:70%; opacity:1 }
    25%, 100% { left:74%; opacity:0 }
  }
  @media (prefers-reduced-motion: reduce) {
    .d2, .d3 { flex-grow:1; opacity:1; border-width:1px; padding-left:8px; padding-right:8px }
    .say-out, .say-in { opacity:1 }
    .caret, .msg, .demo-cap span, .d2, .d3, .say-out, .say-in { animation:none }
    .c3 { opacity:1 }
  }
  /* The two little screens. Both keep to the twelve-second loop. */
  .mini { margin-top:12px; border-radius:8px; overflow:hidden; }
  .phone-mini { border:1px solid #2e2e2e; background:#0e0e0e; padding:7px 8px; }
  .mini-row { display:flex; align-items:center; gap:7px; font-size:11px; color:#c8c8c8;
              padding:3px 2px; font-family:ui-monospace, Menlo, monospace; }
  .dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
  .dot.busy { background:#4ade80; animation:net-busy 12s linear infinite }
  .dot.idle { background:#3a3a3a }
  .dot.ask  { background:#c9272e; opacity:.25; animation:net-ask-dot 12s linear infinite }
  @keyframes net-ask-dot { 0%,43% { opacity:.25 } 46%,64% { opacity:1 } 67%,100% { opacity:.25 } }
  /* Green on black, the one place on this site where that is not a mistake:
     it is what the hardware actually draws. */
  .g2-mini { border:1px solid #1e3a24; background:#050805; padding:8px 9px;
             font-family:ui-monospace, Menlo, monospace; color:#4ade80; line-height:1.5; }
  .g2-head { font-size:9.5px; color:#2f7a45; border-bottom:1px solid #143020; padding-bottom:3px; }
  .g2-body { font-size:11px; margin-top:5px; opacity:0; animation:net-g2-body 12s linear infinite }
  .g2-choice { font-size:11px; margin-top:2px; opacity:0; animation:net-g2-body 12s linear infinite }
  .g2-pick { padding:0 4px; border-radius:3px; animation:net-g2-pick 12s linear infinite }
  .g2-foot { font-size:9px; color:#2f7a45; margin-top:5px; }
  @keyframes net-g2-body { 0%,43% { opacity:0 } 46%,64% { opacity:1 } 67%,100% { opacity:0 } }
  @keyframes net-g2-pick {
    0%, 57%   { background:transparent; color:#4ade80 }
    60%, 65%  { background:#4ade80; color:#050805 }
    68%, 100% { background:transparent; color:#4ade80 }
  }
  @media (prefers-reduced-motion: reduce) {
    .g2-body, .g2-choice { opacity:1 }
    .g2-pick, .dot.busy, .dot.ask { animation:none }
    .net-wire::after, .net-wire::before, .net-dart, .net-handoff em { animation:none; opacity:0 }
    .net-agents span, .net-busy, .net-ask { animation:none }
    .net-ask { opacity:1 }
  }
  .net-label { text-align:center; font-size:11px; color:#7d7d7d; line-height:1.45; }
  .net-label b { display:block; font-size:12px; color:#ff8a8f; font-weight:600; }
  .wiz-hero { display:flex; justify-content:center; margin:2px 0 18px; }
  .wiz-hero .bi { border-radius:26px; box-shadow:0 10px 34px rgba(224,53,60,.18); }
  .wiz-foot { position:sticky; bottom:0; display:flex; gap:8px; padding:12px 20px 20px;
              background:linear-gradient(to top, #0a0a0a 60%, transparent); }
  .wiz-primary, .wiz-ghost { padding:13px 16px; border-radius:9px; font-size:14px; cursor:pointer; }
  .wiz-primary { flex:1; border:none; background:#c9272e; color:#fff; font-weight:600; }
  .wiz-ghost { border:1px solid #3a3a3a; background:transparent; color:#999; font-weight:500; }
  .wiz-link { color:#ff8a8f; text-decoration:underline; }
  .wiz-linkbtn { display:block; text-align:center; padding:12px; border-radius:9px;
                 border:1px solid #5a2226; background:#180c0d; color:#ff8a8f;
                 text-decoration:none; font-size:14px; font-weight:600; margin:8px 0; }
  .wiz-scan { display:block; width:100%; padding:13px; border-radius:9px; border:1px solid #5a2226;
              background:#180c0d; color:#ff8a8f; font-size:14px; font-weight:600; cursor:pointer;
              margin:0 0 10px; }
  .wiz-scan[disabled] { opacity:.55; }
  .wiz-or { display:flex; align-items:center; gap:10px; color:#666; font-size:11px; margin:2px 0 10px; }
  .wiz-or::before, .wiz-or::after { content:''; flex:1; height:1px; background:#242424; }
  .wiz-input { width:100%; padding:12px; border-radius:8px; border:1px solid #333; background:#1a1a1a;
               color:#eee; font-size:14px; font-family:ui-monospace, Menlo, monospace; }
  .wiz-input:focus { outline:none; border-color:#e0353c; }
  .wiz-status { font-size:13px; margin-top:10px; min-height:18px; }
  .wiz-wide { display:block; width:100%; margin:4px 0 12px; }
  .wiz-ok { color:#4ade80; }
  .wiz-dot { width:9px; height:9px; border-radius:50%; background:#4ade80; animation:wiz-pulse 2s infinite; }
  @keyframes wiz-pulse { 0%,100% { opacity:1 } 50% { opacity:.35 } }
`

export function shellHtml(id: StepId): string {
  const list = steps()
  const index = stepIndex(id)
  const step = list[index]
  const { title, html } = screenHtml(id)
  const pct = Math.round(((index + 1) / list.length) * 100)
  const where = step.where === 'machine' ? t('nav.onMachine') : t('nav.onPhone')

  const back =
    index > 0
      ? `<button type="button" class="wiz-ghost" id="wiz-back">${t('nav.back')}</button>`
      : ''
  // Returning app users need a direct route to Connect. The hand-off screen on
  // the public site explicitly points to this button, so it must live in the
  // embedded guide rather than in the native wrapper around it.
  const skip =
    embedded && id === 'intro'
      ? `<button type="button" class="wiz-ghost" id="wiz-skip">${t('nav.skip')}</button>`
      : ''
  // The connect screen's action is connecting, and the last screen has nowhere
  // to go — so neither carries a "next".
  const next =
    id === 'connect'
      ? `<button type="button" class="wiz-primary" id="wiz-connect">${t('connect.connectButton')}</button>`
      : index < list.length - 1
        ? `<button type="button" class="wiz-primary" id="wiz-next">${
            index === 0 ? t('nav.start') : t('nav.next')
          }</button>`
        : ''

  const langs = (['en', 'ja'] as const)
    .map(
      (l) =>
        `<button type="button" class="wiz-lang${l === getLang() ? ' on' : ''}" data-lang="${l}">${
          l === 'en' ? 'EN' : '日本語'
        }</button>`,
    )
    .join('')

  return `
    <div class="wiz">
      <div class="wiz-top">
        <div class="wiz-brand">
          <div class="wiz-mark">${brandIcon('hdr', 28)}</div>
          <div class="wiz-name">${PRODUCT_NAME}<span style="color:#666; font-weight:400"> ${t('brand.for')}</span></div>
          <div class="wiz-langs">${langs}</div>
        </div>
        <div class="wiz-bar"><i style="width:${pct}%"></i></div>
        <div class="wiz-meta">
          <span>${t('nav.step', { n: index + 1, total: list.length, label: t(`step.${id}`) })}</span>
          <span class="wiz-where ${step.where}">${where}</span>
        </div>
      </div>
      <div class="wiz-body">
        <h1 class="wiz-title">${title}</h1>
        ${html}
      </div>
      ${id === 'done' || !(skip || back || next) ? '' : `<div class="wiz-foot">${skip}${back}${next}</div>`}
    </div>
    <style>${CSS}${BRAND_CSS}</style>
  `
}

export { type Lang, getLang, setLang, t, DEFAULT_PORT }
