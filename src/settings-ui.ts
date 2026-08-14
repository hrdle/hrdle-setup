// The voice-input settings panel, shared by the phone companion UI and the
// browser simulator.
//
// These three values used to live only in the server's environment, which meant
// changing the language or trying a different vocabulary prompt required editing
// a systemd EnvironmentFile and restarting. They are per-use settings, so they
// belong on a screen. The key is here too because a fresh install otherwise has
// no way to supply one without shell access.
//
// The panel talks to /api/glasses/settings, which returns everything except the
// key itself; what it can say about the key is whether one is set and where it
// came from.

import type { GlassesSettingsView, SttRequestPreview } from './host-bridge.ts'
import { t } from './i18n.ts'

/** Languages offered. `auto` sends none and lets Whisper detect it. */
const LANGS: Array<{ value: string; labelKey: string }> = [
  { value: 'auto', labelKey: 'settings.langAuto' },
  { value: 'ja', labelKey: 'settings.langJa' },
  { value: 'en', labelKey: 'settings.langEn' },
]


// The accent is a variable so the panel can sit in either palette. Here it is
// always the red one; the copy that lives in the glasses repo also serves the
// browser simulator, which is green because that is what the G2 draws in.
const S = {
  section: 'background:#111;border:1px solid #222;border-radius:12px;padding:16px;margin-bottom:16px;',
  h2: 'font-size:15px;color:var(--panel-accent,#ff6167);margin:0 0 4px;font-weight:600;',
  sub: 'font-size:12px;color:#888;margin:0 0 12px;',
  label: 'display:block;font-size:12px;color:#bbb;margin:12px 0 4px;',
  input:
    'width:100%;padding:10px;border-radius:8px;border:1px solid #333;background:#1a1a1a;color:#eee;font-size:14px;box-sizing:border-box;',
  row: 'display:flex;gap:8px;margin-top:8px;',
  btn: 'padding:10px 14px;border-radius:8px;border:none;background:var(--panel-accent-strong,#c9272e);color:#fff;font-size:13px;font-weight:600;cursor:pointer;',
  btnGhost:
    'padding:10px 14px;border-radius:8px;border:1px solid #444;background:transparent;color:#aaa;font-size:13px;cursor:pointer;',
  status: 'font-size:12px;color:#888;margin-top:8px;min-height:16px;',
  toggle:
    'display:flex;align-items:center;gap:8px;font-size:14px;color:#eee;margin-top:4px;cursor:pointer;',
  // A provider's own box, nested inside the voice-input section: the border
  // is what says "these fields belong to the choice above".
  subsection:
    'background:#0c0c0c;border:1px solid #2a2a2a;border-radius:10px;padding:12px;margin-top:14px;',
  h3: 'font-size:13px;color:#ddd;margin:0 0 8px;font-weight:600;',
  // The line as it goes out: read-only, wrapping, and monospaced so a term cut
  // by the budget is visible as a term rather than as prose.
  preview:
    'margin-top:8px;padding:10px;border-radius:8px;border:1px solid #333;background:#1a1a1a;color:#bbb;font-size:12px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;line-height:1.5;white-space:pre-wrap;word-break:break-word;',
}

/**
 * Four sections, split by who a value belongs to. The screen setting is not
 * voice input at all; language and vocabulary go with the speech wherever it
 * is sent; the key and the model list are Groq's own; the custom endpoint is
 * its own machine. One box holding all of it read as "these are all Groq
 * settings", which is exactly what it wasn't.
 *
 * The screen section and the custom section follow the model row's rule: a
 * server from before the feature reports nothing, and a setting it would drop
 * must not be offered - wireSettingsPanel() unhides them.
 */
export function settingsPanelHtml(): string {
  return `
    <div id="glasses-screen-settings" style="${S.section}" hidden>
      <h2 style="${S.h2}">${t('settings.glassesTitle')}</h2>
      <label style="${S.label}" for="screen-off-seconds">${t('settings.screenOff')}</label>
      <p style="${S.sub}">${t('settings.screenOffHint')}</p>
      <input id="screen-off-seconds" type="number" inputmode="numeric" min="0" max="3600" step="1" style="${S.input}" />
      <div style="${S.row}">
        <button type="button" id="screen-off-save" style="${S.btn}">${t('settings.screenOffSave')}</button>
      </div>
      <div id="screen-off-status" style="${S.status}"></div>
    </div>

    <div id="stt-settings" style="${S.section}">
      <h2 style="${S.h2}">${t('settings.title')}</h2>
      <p style="${S.sub}">${t('settings.subtitle')}</p>

      <!-- Hidden against a server from before the provider choice existed:
           choosing against a server that ignores the answer is worse than the
           old single-box layout. wireSettingsPanel() unhides it. -->
      <div id="stt-provider-row" hidden>
        <label style="${S.label}" for="stt-provider">${t('settings.provider')}</label>
        <select id="stt-provider" style="${S.input}">
          <option value="groq">${t('settings.providerGroq')}</option>
          <option value="custom">${t('settings.providerCustom')}</option>
        </select>
        <label style="${S.toggle}">
          <input type="checkbox" id="stt-fallback" />
          <span>${t('settings.fallbackToggle')}</span>
        </label>
        <div id="stt-destination" style="${S.status}"></div>
      </div>

      <label style="${S.label}" for="stt-lang">${t('settings.lang')}</label>
      <select id="stt-lang" style="${S.input}">
        ${LANGS.map((l) => `<option value="${l.value}">${t(l.labelKey)}</option>`).join('')}
      </select>
      <div id="stt-lang-status" style="${S.status}"></div>

      <span style="${S.label}">${t('settings.bias')}</span>
      <label style="${S.toggle}">
        <input type="checkbox" id="stt-bias" />
        <span>${t('settings.biasToggle')}</span>
      </label>
      <!-- Not an editor: the line comes from the same call the transcription
           makes, so what is shown is what is sent (hrdle#255). With no session
           named, that is the glossary every session shares. -->
      <div id="stt-bias-preview" style="${S.preview}"></div>
      <div id="stt-bias-status" style="${S.status}"></div>

      <div id="stt-groq-settings" style="${S.subsection}">
        <h3 style="${S.h3}">${t('settings.groqTitle')}</h3>
        <p style="${S.sub}">${t('settings.groqSubtitle')}</p>

        <label style="${S.label}" for="stt-key">${t('settings.key')}</label>
        <input id="stt-key" type="password" autocomplete="off" placeholder="gsk_..." style="${S.input}" />
        <div style="${S.row}">
          <button type="button" id="stt-key-save" style="${S.btn}">${t('settings.keySave')}</button>
          <button type="button" id="stt-key-clear" style="${S.btnGhost}">${t('settings.keyClear')}</button>
        </div>
        <div id="stt-key-status" style="${S.status}"></div>

        <!-- Hidden until the settings say otherwise: a server from before
             hrdle#253 has no model setting, and the options come from its own
             list, so there is nothing to draw. Filled in by wireSettingsPanel(). -->
        <div id="stt-model-row" hidden>
          <label style="${S.label}" for="stt-model">${t('settings.model')}</label>
          <select id="stt-model" style="${S.input}"></select>
          <div id="stt-model-status" style="${S.status}"></div>
        </div>
      </div>

      <div id="stt-custom-settings" style="${S.subsection}" hidden>
        <h3 style="${S.h3}">${t('settings.endpoint')}</h3>
        <p style="${S.sub}">${t('settings.endpointHint')}</p>
        <label style="${S.label}" for="stt-endpoint-url">${t('settings.endpointUrl')}</label>
        <input id="stt-endpoint-url" type="url" autocomplete="off" placeholder="https://..." style="${S.input}" />
        <label style="${S.label}" for="stt-endpoint-model">${t('settings.endpointModel')}</label>
        <input id="stt-endpoint-model" type="text" autocomplete="off" placeholder="whisper-1" style="${S.input}" />
        <label style="${S.label}" for="stt-endpoint-key">${t('settings.endpointKey')}</label>
        <input id="stt-endpoint-key" type="password" autocomplete="off" placeholder="${t('settings.endpointKeyPlaceholder')}" style="${S.input}" />
        <div style="${S.row}">
          <button type="button" id="stt-endpoint-save" style="${S.btn}">${t('settings.endpointSave')}</button>
          <button type="button" id="stt-endpoint-clear" style="${S.btnGhost}">${t('settings.endpointClear')}</button>
        </div>
        <div id="stt-endpoint-status" style="${S.status}"></div>
        <details style="margin-top:8px;">
          <summary style="${S.sub.replace('margin:0 0 12px;', 'cursor:pointer;')}">${t('settings.endpointSpecTitle')}</summary>
          <div style="${S.sub.replace('margin:0 0 12px;', 'margin:8px 0 0;')}">${t('settings.endpointSpec')}</div>
        </details>
      </div>
    </div>
  `
}

function el<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null
}

function describeKey(v: GlassesSettingsView): string {
  if (!v.hasApiKey) return t('settings.keyNone')
  return v.apiKeySource === 'env' ? t('settings.keyEnv') : t('settings.keySaved')
}

/**
 * What the line below the switch is, said from the preview rather than guessed.
 *
 * The three cases are the three the server reports, and they are not the same
 * sentence: `off` means nothing is sent, `env` means the server was handed a
 * line to send instead, and `composed` means this is the shared part of one -
 * a session speaking adds its own words in front of it.
 */
function describeBias(p: SttRequestPreview, v: GlassesSettingsView | null): string {
  // Off *and* not by this screen's doing: a disabled switch with no reason
  // beside it is the same unexplained silence hrdle#210 was.
  if (p.promptSource === 'off' && v?.sttBiasSource === 'env') return t('settings.biasEnvOff')
  if (p.promptSource === 'off') return t('settings.biasOff')
  if (p.promptSource === 'env') return t('settings.biasEnv')
  return t('settings.biasComposed')
}

/**
 * Wire the panel up. Loads the current settings, then saves on demand.
 *
 * Every save round-trips the server's own view back into the fields, so what
 * the panel shows is what the next transcription will use rather than what was
 * typed.
 */
export interface SettingsApi {
  get(): Promise<GlassesSettingsView>
  put(patch: {
    groqApiKey?: string | null
    sttLang?: string | null
    sttBias?: 'on' | 'off' | null
    sttModel?: string | null
    screenOffSeconds?: number | null
    sttEndpointUrl?: string | null
    sttEndpointModel?: string | null
    sttEndpointKey?: string | null
    sttProvider?: 'groq' | 'custom' | null
    sttFallback?: 'on' | 'off' | null
  }): Promise<GlassesSettingsView>
  /** What a transcription would send right now (hrdle#255). */
  preview(): Promise<SttRequestPreview>
}

export async function wireSettingsPanel(api: SettingsApi): Promise<void> {
  const key = el<HTMLInputElement>('stt-key')
  const lang = el<HTMLSelectElement>('stt-lang')
  const bias = el<HTMLInputElement>('stt-bias')
  if (!key || !lang || !bias) return

  const keyStatus = el('stt-key-status')
  const langStatus = el('stt-lang-status')
  const model = el<HTMLSelectElement>('stt-model')
  const modelRow = el('stt-model-row')
  const modelStatus = el('stt-model-status')
  const biasStatus = el('stt-bias-status')
  const biasPreview = el('stt-bias-preview')
  const screenOffSeconds = el<HTMLInputElement>('screen-off-seconds')
  const screenSection = el('glasses-screen-settings')
  const screenOffStatus = el('screen-off-status')
  const destination = el('stt-destination')
  const endpointSection = el('stt-custom-settings')
  const providerRow = el('stt-provider-row')
  const provider = el<HTMLSelectElement>('stt-provider')
  const fallback = el<HTMLInputElement>('stt-fallback')
  const endpointUrl = el<HTMLInputElement>('stt-endpoint-url')
  const endpointModel = el<HTMLInputElement>('stt-endpoint-model')
  const endpointKey = el<HTMLInputElement>('stt-endpoint-key')
  const endpointStatus = el('stt-endpoint-status')

  // The last view, for the one thing the preview cannot say on its own: why it
  // is off. `off` looks the same from down there whoever switched it.
  let current: GlassesSettingsView | null = null

  const render = (v: GlassesSettingsView) => {
    current = v
    key.value = ''
    key.placeholder = v.hasApiKey ? t('settings.keyPlaceholderSet') : 'gsk_...'
    if (keyStatus) keyStatus.textContent = describeKey(v)

    lang.value = LANGS.some((l) => l.value === v.sttLang) ? v.sttLang : 'auto'
    if (langStatus) {
      langStatus.textContent =
        v.sttLangSource === 'setting'
          ? t('settings.langSaved')
          : t('settings.langDefault', { lang: v.sttLang })
    }

    // The server names the models it accepts; offering any other would be a
    // 400 on every utterance, reported to the wearer as "STT provider error".
    // A server that names none has no such setting at all, so the row stays
    // hidden instead of showing a select with nothing in it.
    if (modelRow) modelRow.hidden = !v.sttModel
    if (model && v.sttModel) {
      const models = v.sttModels?.length ? v.sttModels : [v.sttModel]
      model.innerHTML = models.map((m) => `<option value="${m}">${m}</option>`).join('')
      model.value = v.sttModel
      if (modelStatus) {
        modelStatus.textContent =
          v.sttModelSource === 'setting'
            ? t('settings.modelSaved')
            : t('settings.modelDefault', { model: v.sttModel })
      }
    }

    bias.checked = v.sttBias
    // `HRDLE_STT_PROMPT=off` is a decision made at the process level and this
    // screen cannot undo it, so the switch says so rather than pretending.
    bias.disabled = v.sttBiasSource === 'env'

    // Both new sections follow the model row's rule: a server that reports
    // nothing gets no section, not a section that pretends.
    if (screenSection) screenSection.hidden = v.screenOffSeconds === undefined
    if (screenOffSeconds && v.screenOffSeconds !== undefined) {
      screenOffSeconds.value = String(v.screenOffSeconds)
      if (screenOffStatus) {
        // What is set, not what just happened - `render` is the initial paint
        // as well as the one after a save, and the save's own line is written
        // by the handler that performed it.
        screenOffStatus.textContent =
          v.screenOffSecondsSource !== 'setting'
            ? t('settings.screenOffDefault')
            : v.screenOffSeconds > 0
              ? t('settings.screenOffOn', { seconds: String(v.screenOffSeconds) })
              : t('settings.screenOffNever')
      }
    }

    if (providerRow) providerRow.hidden = !v.sttEndpoint
    if (v.sttEndpoint && provider && fallback) {
      provider.value = v.sttEndpoint.provider
      fallback.checked = v.sttEndpoint.fallback
    }
    if (destination) {
      destination.textContent = v.sttEndpoint
        ? t('settings.destinationLine', { destination: v.sttEndpoint.destination })
        : ''
    }

    if (endpointSection) endpointSection.hidden = !v.sttEndpoint
    if (v.sttEndpoint && endpointUrl && endpointModel) {
      endpointUrl.value = v.sttEndpoint.url ?? ''
      endpointModel.value = v.sttEndpoint.model ?? ''
      // Write-only, like the Groq one: the field says whether a key is stored
      // and never what it is, so leaving it be must not clear the stored one.
      if (endpointKey) {
        endpointKey.value = ''
        endpointKey.placeholder = v.hasEndpointKey
          ? t('settings.endpointKeySet')
          : t('settings.endpointKeyPlaceholder')
      }
      if (endpointStatus) {
        endpointStatus.textContent =
          v.sttEndpoint.source === 'none'
            ? t('settings.endpointNone')
            : t(
                v.sttEndpoint.source === 'env' ? 'settings.endpointEnv' : 'settings.endpointSaved',
                { destination: v.sttEndpoint.destination },
              )
      }
    }
  }

  /**
   * The line itself, asked of the server after every change.
   *
   * A second request rather than a field on the settings response, because it
   * is a different question: this one has an answer per session, and the
   * settings screen is asking the no-session case of it.
   */
  const renderPreview = async () => {
    try {
      const preview = await api.preview()
      if (biasPreview) biasPreview.textContent = preview.prompt || t('settings.biasNone')
      if (biasStatus) biasStatus.textContent = describeBias(preview, current)
    } catch (err) {
      fail(biasStatus, err)
    }
  }

  const fail = (node: HTMLElement | null, err: unknown) => {
    if (node) {
      node.textContent = t('settings.failed', {
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  try {
    render(await api.get())
  } catch (err) {
    fail(keyStatus, err)
    return
  }
  await renderPreview()

  el('stt-key-save')?.addEventListener('click', async () => {
    if (!key.value.trim()) {
      if (keyStatus) keyStatus.textContent = t('settings.keyEmpty')
      return
    }
    try {
      render(await api.put({ groqApiKey: key.value }))
    } catch (err) {
      fail(keyStatus, err)
    }
  })

  el('stt-key-clear')?.addEventListener('click', async () => {
    try {
      render(await api.put({ groqApiKey: null }))
    } catch (err) {
      fail(keyStatus, err)
    }
  })

  lang.addEventListener('change', async () => {
    try {
      render(await api.put({ sttLang: lang.value }))
    } catch (err) {
      fail(langStatus, err)
    }
  })

  model?.addEventListener('change', async () => {
    try {
      render(await api.put({ sttModel: model.value }))
    } catch (err) {
      fail(modelStatus, err)
    }
  })

  bias.addEventListener('change', async () => {
    try {
      render(await api.put({ sttBias: bias.checked ? 'on' : 'off' }))
      await renderPreview()
    } catch (err) {
      fail(biasStatus, err)
    }
  })

  el('screen-off-save')?.addEventListener('click', async () => {
    if (!screenOffSeconds) return
    // Validated here as well as at the server, because the server's answer to
    // a bad number is a 400 whose message is for a machine. Emptiness first:
    // Number('') is 0, which would silently save "never turn off".
    const raw = screenOffSeconds.value.trim()
    const seconds = Number(raw)
    if (raw === '' || !Number.isInteger(seconds) || seconds < 0 || seconds > 3600) {
      if (screenOffStatus) screenOffStatus.textContent = t('settings.screenOffInvalid')
      return
    }
    try {
      render(await api.put({ screenOffSeconds: seconds }))
      if (screenOffStatus) screenOffStatus.textContent = t('settings.screenOffSaved')
    } catch (err) {
      fail(screenOffStatus, err)
    }
  })

  provider?.addEventListener('change', async () => {
    try {
      render(await api.put({ sttProvider: provider.value as 'groq' | 'custom' }))
      await renderPreview()
    } catch (err) {
      fail(destination, err)
    }
  })

  fallback?.addEventListener('change', async () => {
    try {
      render(await api.put({ sttFallback: fallback.checked ? 'on' : 'off' }))
    } catch (err) {
      fail(destination, err)
    }
  })

  el('stt-endpoint-save')?.addEventListener('click', async () => {
    if (!endpointUrl || !endpointModel) return
    const url = endpointUrl.value.trim()
    // URL and model travel together: the model belongs to the URL it was
    // written for.
    try {
      const typedKey = endpointKey?.value.trim() ?? ''
      render(
        await api.put({
          sttEndpointUrl: url || null,
          sttEndpointModel: endpointModel.value.trim() || null,
          // Empty means "leave what is stored", not "clear it" - the field is
          // always empty on load, so the other reading would delete the key
          // every time the URL was edited. Clearing the URL clears the key with
          // it: it belonged to that endpoint.
          sttEndpointKey: url ? (typedKey || undefined) : null,
        }),
      )
      await renderPreview()
    } catch (err) {
      fail(endpointStatus, err)
    }
  })

  el('stt-endpoint-clear')?.addEventListener('click', async () => {
    try {
      render(
        await api.put({
          sttEndpointUrl: null,
          sttEndpointModel: null,
        }),
      )
      await renderPreview()
    } catch (err) {
      fail(endpointStatus, err)
    }
  })
}
