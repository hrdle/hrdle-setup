// Entry point.
//
// The whole site is one page that swaps its contents, because the guide is a
// sequence rather than a set of documents: what matters is where you are in it,
// and that is remembered in `localStorage` so closing the tab is not a restart.
//
// The step is also mirrored into the URL hash, which the wizard inside the app
// deliberately does not do. Here it is worth it — this page gets sent to people
// ("start at the Tailscale bit"), opened on a second machine, and bookmarked
// halfway through, none of which a phone app screen ever is.

import { type StepId, STEPS, getLang, parseStep, setLang, shellHtml, stepIndex, t } from './wizard.ts'

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

/** The hash wins over the stored step: a link someone was sent is a deliberate
 *  instruction, and the stored one is only where they happened to stop. */
function initialStep(): StepId {
  const fromHash = location.hash.replace(/^#\/?/, '')
  if (STEPS.some((s) => s.id === fromHash)) return fromHash as StepId
  return parseStep(read(STEP_KEY))
}

let step: StepId = initialStep()

function goTo(next: StepId): void {
  step = next
  write(STEP_KEY, next)
  // `replaceState` rather than a hash assignment: this should not stack up a
  // browser-history entry per screen, or Back becomes a second, worse Back
  // button next to the real one.
  history.replaceState(null, '', `#/${next}`)
  render()
  window.scrollTo({ top: 0 })
}

function render(): void {
  if (!app) return
  app.innerHTML = shellHtml(step)
  document.title = `${t(`step.${step}`)} — Hrdle`

  const index = stepIndex(step)
  app.querySelector('#wiz-next')?.addEventListener('click', () => {
    if (index < STEPS.length - 1) goTo(STEPS[index + 1].id)
  })
  app.querySelector('#wiz-back')?.addEventListener('click', () => {
    if (index > 0) goTo(STEPS[index - 1].id)
  })

  for (const button of app.querySelectorAll<HTMLButtonElement>('[data-lang]')) {
    button.addEventListener('click', () => {
      const lang = button.dataset.lang
      if (lang !== 'en' && lang !== 'ja') return
      if (lang === getLang()) return
      setLang(lang)
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
}

// Someone editing the hash by hand, or arriving through the back button.
window.addEventListener('hashchange', () => {
  const next = initialStep()
  if (next !== step) {
    step = next
    write(STEP_KEY, next)
    render()
  }
})

render()
