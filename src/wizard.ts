// The setup guide: five screens of preparation, then a hand-off to the phone.
//
// Why this is a site and not part of the glasses app: the commands on these
// screens are typed on a machine that is usually not the phone reading them, and
// a page you can open *on that machine* is one you can copy out of. The rest of
// the setup lives in the app because it needs things a web page cannot have —
// the host's own store, which is where the G2 reads the server address from, and
// the host's camera for the QR code. Those two screens stay there; everything
// before them is here, where a wording change costs a deploy rather than a
// rebuilt ehpk, a store upload and a version bump.
//
// The wording is kept in step with `glasses/src/i18n.ts` in hrdle/hrdle on
// purpose. Someone reads five screens here and two in the app, and a sentence
// that changes voice at the boundary is worse than either version alone.

import { BRAND_CSS, brandIcon } from './brand.ts'
import { settingsPanelHtml } from './settings-ui.ts'
import { BINARY_NAME, DEFAULT_PORT, INSTALL_CMD, PRODUCT_NAME, REPO } from './identity.ts'
import { type Lang, getLang, setLang, t } from './i18n.ts'

export type StepId =
  | 'intro'
  | 'machine'
  | 'agent'
  | 'tailscale'
  | 'install'
  | 'outro'
  | 'connect'
  | 'done'

interface Step {
  id: StepId
  where: 'machine' | 'phone'
}

const PREPARATION: readonly Step[] = [
  { id: 'intro', where: 'phone' },
  { id: 'machine', where: 'machine' },
  { id: 'agent', where: 'machine' },
  { id: 'tailscale', where: 'machine' },
  { id: 'install', where: 'machine' },
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

function screenHtml(id: StepId): { title: string; html: string } {
  const product = PRODUCT_NAME
  const binary = BINARY_NAME

  switch (id) {
    case 'intro':
      return {
        title: t('intro.title', { product }),
        html: `
          <div class="wiz-hero">${brandIcon('hero', 132)}</div>
          <p class="wiz-lead">${t('intro.lead', { product })}</p>
          <div class="wiz-net">
            <div class="wiz-net-box">
              <b>${t('intro.net.machine')}</b>
              <span>${t('intro.net.machineDesc', { product })}</span>
            </div>
            <div class="wiz-net-hop">
              <div class="wiz-net-wire wan"></div>
              <p>${t('intro.net.tailscale')}</p>
            </div>
            <div class="wiz-net-box here">
              <b>${t('intro.net.phone')}</b>
              <span>${t('intro.net.phoneDesc', { product })}</span>
            </div>
            <div class="wiz-net-hop">
              <div class="wiz-net-wire"></div>
              <p>${t('intro.net.bluetooth')}</p>
            </div>
            <div class="wiz-net-box here">
              <b>${t('intro.net.glasses')}</b>
              <span>${t('intro.net.glassesDesc')}</span>
            </div>
          </div>
          <div class="wiz-card">
            <h3>${t('intro.getTitle')}</h3>
            <ul class="wiz-points">
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
            ${cmd(`${binary} setup -P yourpassword`)}
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
            <h3>${t('connect.scanTitle')}</h3>
            <p class="wiz-note">${t('connect.scanNote')}</p>
            ${cmd(`${binary} qr`)}
            <button type="button" class="wiz-scan" id="wiz-scan">${t('connect.scanButton')}</button>
            <div id="wiz-scan-status" class="wiz-status" style="margin:0 0 6px"></div>
            <div class="wiz-or">${t('connect.orType')}</div>
            <input id="wiz-url" class="wiz-input" type="url" inputmode="url" autocapitalize="off"
                   autocorrect="off" spellcheck="false"
                   placeholder="https://your-machine.tailnet.ts.net:${DEFAULT_PORT}" />
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
            <h3>${t('outro.qrGoneTitle')}</h3>
            <p class="wiz-note">${t('outro.qrGone')}</p>
            ${cmd(`${binary} qr`)}
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
  .wiz-net { margin:0 0 16px; }
  .wiz-net-box { background:#111; border:1px solid #262626; border-radius:10px; padding:11px 13px; }
  .wiz-net-box b { display:block; font-size:13.5px; color:#eee; margin-bottom:3px; }
  .wiz-net-box span { display:block; font-size:12px; color:#8d8d8d; line-height:1.55; }
  .wiz-net-box.here { border-color:#5a2226; }
  .wiz-net-hop { display:flex; gap:12px; padding:7px 0 7px 13px; }
  .wiz-net-wire { width:0; border-left:2px solid #4a2024; }
  .wiz-net-wire.wan { border-left-style:dashed; border-left-color:#6b2b30; }
  .wiz-net-hop p { margin:0; font-size:11.5px; color:#8d8d8d; line-height:1.6; }
  .wiz-net-hop p b { color:#ff8a8f; font-weight:600; }
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
      ${id === 'done' || !(back || next) ? '' : `<div class="wiz-foot">${back}${next}</div>`}
    </div>
    <style>${CSS}${BRAND_CSS}</style>
  `
}

export { type Lang, getLang, setLang, t, DEFAULT_PORT }
