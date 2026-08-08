// English and Japanese for the phone screens.
//
// `glasses/src` had no i18n at all, which is why every string in the setup
// wizard was written in English and stayed there: the repository rule is that
// prose we write is English *unless* it goes through a translation table, and
// there was no table to put it in. This is the table.
//
// Deliberately not react-i18next, which the web UI uses — nothing here is React,
// and the ehpk pays for every kilobyte it carries. What a wizard needs is a
// lookup, a language, and a way to change it.
//
// The app embeds this guide, so the setup prose has one source of truth here.
// The `settings.*` subset is also used by the copy of the voice-settings panel
// in hrdle/hrdle's simulator; keep that shared subset in step there.

export type Lang = 'en' | 'ja'

/** localStorage, minus the ways it throws. Private mode has no store to read. */
function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const LANG_KEY = 'hrdle-setup-lang'

/** Table of every string the phone screens can show. */
type Table = Record<string, string>

/**
 * Values are HTML, and are inserted with `innerHTML`.
 *
 * Every one of them is written here, in this file, by us — there is no path
 * from user input into this table, which is what makes the markup safe. Keep it
 * that way: interpolate through `t()`'s `vars`, never by building a key.
 */
const EN: Table = {
  'brand.for': 'for EVEN G2',
  'nav.start': 'Start setup',
  'nav.next': 'Next',
  'nav.back': 'Back',
  'nav.skip': 'Already set up',
  'nav.step': 'Step {n} of {total} · {label}',
  'nav.onMachine': 'On that machine',
  'nav.onPhone': 'On your phone',
  'cmd.copy': 'copy',
  'cmd.copied': 'copied',
  'cmd.copyFailed': 'could not copy',

  'step.intro': 'What this is',
  'step.how': 'How it fits together',
  'step.machine': 'A machine',
  'step.agent': 'Coding agent',
  'step.tailscale': 'Tailscale',
  'step.install': 'Install',
  'step.groq': 'Voice input',
  'step.connect': 'Connect',
  'step.done': 'Glasses',
  'step.outro': 'Finish in the app',

  'intro.title': 'Your agents, even away from the desk',
  'intro.lead':
    'You are no longer in front of the PC.<br>And still, the work moves on.',
  'intro.nameTitle': 'Where the name comes from',
  'intro.name':
    '{product} = <strong>herdr</strong> + <strong>handle</strong>. A handle, held from the G2, for the thing that herds your sessions. The hurdle of getting started is in the name too.',
  'demo.head': 'tax-flow — kimi',
  'demo.head2': 'tax-flow — codex',
  'demo.session': 'tax-flow',
  'demo.you': 'before we start fixing, please have codex review this code',
  'demo.split': '[Bash] herdr pane split --direction down',
  'demo.start': '[Bash] herdr agent start reviewer --kind codex',
  'demo.prompt': '[Bash] herdr agent prompt reviewer "please review this repository — review only, do not change the code',
  'demo.report': 'codex\'s review is done — all 5 earlier findings judged "valid", plus new findings',
  'demo.again': 'all of it, please',
  'demo.verify': '[Agent] verify the tax numbers against primary sources',
  'demo.done': 'all fixes verified — 13 regression tests, all green',
  'demo.cyou': 'please review this repository — review only, do not change the code',
  'demo.cwrite': '[Write] /tmp/codex-review.md',
  'demo.cdone': 'done: /tmp/codex-review.md',
  'demo.watch': 'This exchange really happened — the words are verbatim.',
  'intro.diffTitle': 'What this is next to',
  'intro.diff': 'Three things come close.',
  'intro.rivalEvenTitle': "Even's own Terminal Mode",
  'intro.rivalEven':
    'The closest alternative comes from the people who made the glasses: <code>even-terminal</code> connects one agent process to the G2 and turns ring gestures into keystrokes. If one agent in one working directory is all you need, it is the simpler fit. {product} differs by keeping multiple sessions available and letting you start and manage them remotely.',
  'intro.rivalCmuxTitle': 'cmux',
  'intro.rivalCmux':
    'A native macOS terminal built for running agents in parallel — tabs, split panes, an embedded browser, a socket API, and an iPhone app that mirrors the terminals. If you work at a Mac and want the best window onto several agents while you are sitting at it, this is that. macOS only, and no glasses.',
  'intro.rivalHerdrTitle': 'herdr on its own',
  'intro.rivalHerdr':
    'Everything {product} knows about sessions, herdr already does — and you can drive it from a terminal without any of this. The catch is the terminal: the grip is real, but the hand holding it has to be at a keyboard.',
  'intro.gapTitle': 'Start work without opening a laptop',
  'intro.gap':
    'Not just watching — starting. Create a session, ask by voice, answer its questions from the glasses. The PC stays closed.',
  'intro.seeTitle': 'Agents talking to each other, in plain sight',
  'intro.see':
    'You ask an agent from the glasses.<br>That agent hands it to another.<br>All of it, visible in the panes.',
  'intro.whatTitle': 'What it is, concretely',
  'intro.what':
    '{product} runs your coding agents — Claude Code, Codex, Grok, Kimi, opencode — on a machine of yours, and puts the controls on your phone and on the G2.',
  'intro.net.machine': 'A machine · awake 24/7',
  'intro.net.machineDesc': 'the {product} server, and herdr underneath it',
  'how.herdr': 'herdr — every session lives in one',
  'shot.speakTitle': 'Mostly, you just talk to it',
  'shot.speak':
    'Hold the touchpad and say what you want. It goes to your own server, comes back as text, and reaches the agent as a prompt. This is how the thing is actually used — not choosing between options, but saying a sentence while walking.',
  'shot.askTitle': 'And when it asks something, it asks here',
  'shot.ask':
    'This is the real thing, not a mock-up: green on black, seven lines, drawn by the glasses. The agent got as far as it could and needs a decision.',
  'shot.chooseTitle': 'Two answers, and the ring is quicker',
  'shot.choose':
    'When the agent has narrowed it to a choice, a swipe and a tap beat a sentence. That is the only time the ring is the faster instrument — the rest of the time you speak.',
  'shot.rest':
    'The rest of the time it stays out of your way. It only speaks when it is stuck.',
  'how.caption': 'A question travels out. An answer goes back. The agent never stopped for long.',
  'how.handoff': 'one hands work to another',
  'how.dogfoodShort':
    'This was built this way. The machine running the agents was somewhere else, and the answers went back through a pair of glasses — including the ones that produced this screen.',
  'how.dogfoodTitle': 'This was built this way',
  'intro.net.tailscale': 'Tailscale',
  'intro.net.tailscaleWire': 'over the internet',
  'intro.net.phone': 'Your phone',
  'intro.net.phoneDesc': 'the {product} app',
  'intro.net.bluetooth': 'Bluetooth',
  'intro.net.bluetoothWire': 'in the room',
  'intro.net.glasses': 'The G2',
  'intro.net.glassesDesc': 'read, and answer with the ring',
  'how.title': 'How the pieces fit',
  'how.lead':
    'The agent feels like it is right here — one line in front of your eye, answered with a thumb. It is not. It is on a machine somewhere else entirely, and these two hops are what close the distance.',
  'intro.getNew': 'Start new sessions',
  'intro.get1': 'Run several agent sessions at once and switch between them',
  'intro.get2': 'Watch what each one is doing, live',
  'intro.get3': 'Approve or reject a prompt from the glasses, with the ring',
  'intro.get4': 'Read back the conversation',
  'intro.time':
    'Five setup tasks here, then two in the app on your phone. About ten minutes.',
  'intro.openOnDesktop':
    'You can read this on the machine itself and copy the commands straight out of it.',

  'machine.title': 'A machine to run it on',
  'machine.lead':
    'Pick the machine the agents will run on. It does not have to be a computer you own.',
  'machine.supported': 'Supported today',
  'machine.linux': 'Linux',
  'machine.linuxArch': 'x86_64',
  'machine.macos': 'macOS',
  'machine.macosArch': 'Apple silicon',
  'machine.headlessTitle': 'It does not need a screen',
  'machine.headless':
    'No display, no keyboard, nobody sitting at it. Headless is the case this was built for: you reach the machine over Tailscale and drive it from your phone and your glasses, so the only thing it owes you is staying awake.',
  'machine.awakeTitle': 'It must not sleep',
  'machine.awake1':
    'An agent keeps working while you are away, and nothing reaches you from a sleeping machine — a session started in the morning is only there in the afternoon if the machine stayed awake the whole time.',
  'machine.awake2':
    'A laptop works while it is open and plugged in. Something that runs around the clock is what this is for. Turn sleep and hibernation off before you go on.',
  'machine.vpsTitle': 'No machine to spare? Rent one',
  'machine.vps1':
    'A small VPS does this job well. It is already awake around the clock, it is already somewhere with a fixed home, and Tailscale installs on it exactly as it would on a desktop.',
  'machine.vps2':
    'One or two cores and 2 GB of memory is a reasonable starting point for light use. Builds, tests and several busy agents may need more, so size the VPS for the projects you will run. Your agent accounts will sign in from that host.',

  'agent.title': 'Install a coding agent',
  'agent.lead':
    '{product} drives agents; it is not one itself. Install at least one on that machine and sign in.',
  'agent.claudeTitle': 'Claude Code',
  'agent.claudeNote': 'Then run <code>claude</code> once and sign in.',
  'agent.signInTitle': 'Sign in now, not later',
  'agent.signIn':
    'An agent that has never been signed in shows a login screen when it starts — and a login screen is not something you want to meet through the glasses.',
  'agent.others':
    'Codex, Grok Build, Kimi Code and opencode work too, and you can add them later. One is enough to finish this setup.',

  'tailscale.title': 'Put that machine on Tailscale',
  'tailscale.lead':
    'Tailscale is how this phone reaches that machine, and where its HTTPS certificate comes from. No ports are opened to the internet.',
  'tailscale.linux': 'Linux',
  'tailscale.macos': 'macOS',
  'tailscale.brewNote':
    'The command above puts <code>tailscale</code> on your PATH. The macOS apps also include a CLI, but it may need to be enabled in Tailscale Settings or called from inside the app. Before continuing, make sure <code>tailscale version</code> works in this terminal.',
  'tailscale.certTitle': 'If certificate access needs permission',
  'tailscale.certNote':
    'This is normally needed on Linux and command-line-only installs. Some macOS app installs already allow certificate generation; if this command is unsupported there, continue to the installer. The {binary} installer prints the required action if setup cannot continue.',
  'tailscale.downloads':
    '{link} — sign in with any account you like; you will use the same one on this phone later.',
  'tailscale.downloadsLabel': 'Tailscale downloads',

  'groq.title': 'A key for the voice input',
  'groq.lead':
    'Talking to the glasses is the main way to drive this. You say what you want, it becomes text, and the agent gets it as a prompt — which needs a transcription key. Groq has a rate-limited free tier, and setup takes about two minutes.',
  'groq.whyTitle': 'Why not the ring',
  'groq.why':
    'Choosing between two answers with a thumb is fine when the agent has offered two answers. Most of the time what you want to say is a sentence, and speaking it is faster than any control on a pair of glasses could be.',
  'groq.step1': '1 &middot; Make a Groq account',
  'groq.step1Note': 'The free tier does not require a card, but usage limits apply.',
  'groq.openConsole': 'Open the Groq console',
  'groq.step2': '2 &middot; Create an API key',
  'groq.step2Note':
    'API Keys, then Create API Key. What you get starts with <code>gsk_</code>. Copy it now — the page shows it once and never again.',
  'groq.step3': '3 &middot; Paste it here',
  'groq.pasteNote':
    'There is nowhere to send it yet — no server has answered. It will be stored temporarily in this app\'s browser storage, sent when you connect, and deleted after the server accepts it. Do not use this on a shared phone.',
  'groq.pastePlaceholder': 'gsk_...',
  'groq.pasteSave': 'Hold it for me',
  'groq.pasteHeld': 'Held. It will be sent when you connect.',
  'groq.pasteCleared': 'Cleared.',
  'groq.pasteEmpty': 'Nothing to hold — the field is empty.',
  'groq.pasteClear': 'Forget it',
  'groq.step3Later': '3 &middot; Keep it for the last screen',
  'groq.sent': 'The key you pasted earlier has been sent to your server.',
  'groq.sendFailed': 'The key you pasted earlier could not be sent: {error}. Paste it again below.',
  'groq.step3Note':
    'You paste it after connecting, on the last screen of this setup. Keep this tab open, or save the key in a password manager you can access from your phone.',
  'groq.privacyTitle': 'Where your voice goes',
  'groq.privacy':
    'The glasses send raw audio to your server. Your server then sends the audio and API key to Groq and receives the transcript; nobody who built {product} is in that path. Groq documents its retention and Zero Data Retention options in {dataPolicy}. If you would rather not send audio to Groq, skip this step: everything else works without voice input.',
  'groq.dataPolicy': 'Your Data in GroqCloud',
  'install.title': 'Install {product}',
  'install.lead':
    'One command. Leave that terminal open when it finishes, or save the short address it prints. You will enter that address in the phone app at the end of setup.',
  'install.whatTitle': 'What it does',
  'install.what':
    'Installs {binary} into <code>~/bin</code> and {herdr} if it is missing, registers the service so it survives a reboot, and prints the short address you will enter in the phone app.',
  'install.sudoNote':
    'If it says a sudo command is still needed, run that line and then <code>{binary} setup</code>.',
  'install.passwordTitle': 'Want a password on it?',
  'install.password':
    'Without a password, any user or device allowed to reach this machine by your tailnet policy can open it. That may be fine for a private tailnet; use a password for a shared one. Replace the placeholder below. The password is passed on the command line and may remain in your shell history.',

  'connect.title': 'Connect to {product}',
  'connect.lead':
    'Two things on this phone: join the tailnet, then tell the app where that machine is.',
  'connect.tailscaleTitle': '1 · Tailscale on this phone',
  'connect.tailscaleNote':
    'Sign in with the same account you used on that machine, or the two cannot see each other. If neither link opens from here, copy this into a browser:',
  'connect.addressTitle': '2 · The short address',
  'connect.addressNote':
    'Run this on that machine. It prints a short address — nine characters, like 91.210.90. That is what goes in the box.',
  'connect.addressForms':
    'A hostname works too, and so does a full URL if you have one to paste. The same command prints the full URL under it — that one is for a browser, which is a different thing from setting the glasses up.',
  'connect.connectButton': 'Connect',
  'connect.troubleTitle': 'If it will not connect',
  'connect.trouble':
    'Check that Tailscale says connected on this phone, that <code>{binary} status</code> on that machine says it is running, and that the address matches what the machine printed.',
  'connect.resolving': 'Looking for that machine...',
  'connect.notFound': 'That machine did not answer',
  'connect.enterFirst': 'Enter the address first',
  'connect.connecting': 'Connecting...',
  'connect.connected': 'Connected',
  'connect.failed': 'Could not connect: {error}',

  'done.title': 'Ready',
  'done.connected': 'Connected',
  'done.server': 'Server',
  'done.version': 'Version',
  'done.sessions': 'Sessions',
  'done.usage': 'API usage',
  'done.app': 'Glasses app',
  'done.launchTitle': 'Launch it on the glasses',
  'done.launch':
    'Open {product} from the G2 app menu. Swipe to move between sessions, tap to select, double tap to go back.',
  'done.disconnect': 'Disconnect',

  'outro.title': 'Now finish it on your phone',
  'outro.lead':
    'The installer ended by printing a short address. The last two steps happen in the {product} app on your phone, which asks for it.',
  'outro.step1Title': '1 · Open the app',
  'outro.step1':
    'Open {product} from the EVEN app menu on your phone. It shows the same wizard you have been reading — press <b>Already set up</b> on the first screen to go straight to Connect.',
  'outro.step2Title': '2 · Join the tailnet and type the address',
  'outro.step2':
    'Install Tailscale on the phone with the same account, then type in the short address the installer printed — nine characters, like 91.210.90. That is the whole of it.',
  'outro.addressGoneTitle': 'Lost the address?',
  'outro.addressGone': 'Run this on the machine again:',
  'settings.title': 'Voice input',
  'settings.subtitle':
    'Transcription runs through Groq. The key is stored on this host and sent to Groq only with transcription requests.',
  'settings.key': 'Groq API key',
  'settings.keySave': 'Save key',
  'settings.keyClear': 'Clear',
  'settings.keyNone': 'No key is set. Add one to use voice transcription.',
  'settings.keyEnv':
    'A key is set from the server environment (GROQ_API_KEY). Saving one here overrides it.',
  'settings.keySaved': 'A key is saved here.',
  'settings.keyPlaceholderSet': 'A key is set - type a new one to replace it',
  'settings.keyEmpty': 'Nothing to save - the field is empty.',
  'settings.lang': 'Language',
  'settings.langAuto': 'Auto-detect',
  'settings.langJa': 'Japanese',
  'settings.langEn': 'English',
  'settings.langSaved': 'Saved here.',
  'settings.langDefault': 'Server default ({lang}). Pick one to change it.',
  'settings.prompt': 'Shared vocabulary',
  'settings.promptSave': 'Save words',
  'settings.promptReset': 'Clear',
  'settings.promptOff': 'No vocabulary is sent at all (this is set to `off`).',
  'settings.promptEnv': 'Replaced by HRDLE_STT_PROMPT in the server environment.',
  'settings.promptComposed':
    'These words are sent with every transcription, ahead of the glossary. A session adds its own words in front of them.',
  'settings.failed': 'Failed: {error}',
}

const JA: Table = {
  'brand.for': 'for EVEN G2',
  'nav.start': 'セットアップを始める',
  'nav.next': '次へ',
  'nav.back': '戻る',
  'nav.skip': 'セットアップ済み',
  'nav.step': 'ステップ {n}/{total} · {label}',
  'nav.onMachine': 'サーバー側の作業',
  'nav.onPhone': 'スマホでの作業',
  'cmd.copy': 'コピー',
  'cmd.copied': 'コピーしました',
  'cmd.copyFailed': 'コピーできませんでした',

  'step.intro': 'これは何か',
  'step.how': '全体のつながり',
  'step.machine': 'マシン',
  'step.agent': 'エージェント',
  'step.tailscale': 'Tailscale',
  'step.install': 'インストール',
  'step.groq': '音声入力',
  'step.connect': '接続',
  'step.done': 'グラス',
  'step.outro': 'アプリで仕上げる',

  'intro.title': '机を離れても、エージェントに届く',
  'intro.lead':
    'パソコンの前に、あなたはもういない。<br>それでも、仕事は進んでいる。',
  'intro.nameTitle': '名前の由来',
  'intro.name':
    '{product} = herdr + handle です。セッションを束ねる herdr を、G2 から握るハンドル、という名前です。導入にハードル(hurdle)があることも、由来のひとつです。',
  'demo.head': '税金の行方 — kimi',
  'demo.head2': '税金の行方 — codex',
  'demo.session': '税金の行方',
  'demo.you': '修正範囲に入る前にこのコードに関してレビュー依頼をコーデックスにお願いしてください',
  'demo.split': '[Bash] herdr pane split --direction down',
  'demo.start': '[Bash] herdr agent start reviewer --kind codex',
  'demo.prompt': '[Bash] herdr agent prompt reviewer "このリポジトリのコードレビューをお願いします。コードは変更せず、レビューのみ行ってください',
  'demo.report': 'Codex のレビューが完了。先行指摘5件はすべて「妥当」と判定され、新しい指摘が加わりました',
  'demo.again': '全部お願いします',
  'demo.verify': '[Agent] 税制数値を一次情報で確認',
  'demo.done': '全スコープの修正と検証が完了しました。テスト13件、すべて成功',
  'demo.cyou': 'このリポジトリのコードレビューをお願いします。コードは変更せず、レビューのみ行ってください',
  'demo.cwrite': '[Write] /tmp/codex-review.md',
  'demo.cdone': '完了しました: /tmp/codex-review.md',
  'demo.watch': '実際にあったやり取りです。言葉も、そのまま。',
  'intro.diffTitle': '何と比べるか',
  'intro.diff': '似ているものは3つあります。',
  'intro.rivalEvenTitle': 'Even 純正の Terminal Mode',
  'intro.rivalEven':
    '最も近い選択肢は、グラスを作った Even の <code>even-terminal</code> です。1つのエージェントプロセスを G2 につなぎ、リングの操作をキー入力として伝えます。1つの作業ディレクトリで1つのエージェントを使えればよい場合は、こちらのほうがシンプルです。{product} は複数のセッションを維持し、離れた場所から開始・管理できる点が異なります。',
  'intro.rivalCmuxTitle': 'cmux',
  'intro.rivalCmux':
    'エージェントを並列に動かすための macOS ネイティブなターミナルです。タブ、分割ペイン、埋め込みブラウザ、ソケット API、そしてターミナルを同期する iPhone アプリまであります。Mac の前に座って複数のエージェントを見るなら、いちばん良い窓はこれです。macOS 専用で、グラスには出ません。',
  'intro.rivalHerdrTitle': 'herdr 単体',
  'intro.rivalHerdr':
    '{product} が扱うセッションは、もともと herdr が管理しています。{product} を入れなくても、ターミナルから操作できます。違いは操作する場所で、herdr 単体では基本的にキーボードの前にいる必要があります。',
  'intro.gapTitle': 'PC を開かずに仕事を始める',
  'intro.gap':
    '見るだけでなく、始められます。セッションを作り、声で頼み、質問にはグラスで答える。パソコンは、開かないままでいい。',
  'intro.seeTitle': 'エージェント同士のやり取りも、目に見える',
  'intro.see':
    'グラスから、エージェントに頼む。<br>そのエージェントが、別のエージェントに渡す。<br>その全部が、ペインの上に見えている。',
  'intro.whatTitle': '具体的には',
  'intro.what':
    '{product} は Claude Code、Codex、Grok、Kimi、opencode といったコーディングエージェントをあなたのマシンで動かし、スマホと G2 から操作できるようにします。',
  'intro.net.machine': 'マシン · 24時間起動',
  'intro.net.machineDesc': '{product} サーバーと、その下の herdr',
  'how.herdr': 'herdr — すべてのセッションはこの中',
  'shot.speakTitle': 'ふだんは、ただ話しかけます',
  'shot.speak':
    'タッチパッドを押さえて、言いたいことを言う。音声はあなた自身のサーバーへ行き、文字になって戻り、プロンプトとしてエージェントに届きます。実際の使い方はこれです。選択肢を選ぶことではなく、歩きながら一文を言うこと。',
  'shot.askTitle': 'そして尋ねられるときは、ここに出ます',
  'shot.ask':
    'これはモックではなく実物です。黒地に緑、7行、グラスが実際に描いたもの。エージェントは行けるところまで行って、判断を待っています。',
  'shot.chooseTitle': '二択なら、リングのほうが速い',
  'shot.choose':
    'エージェントが選択肢まで絞ってくれたときは、スワイプとタップのほうが一文より速い。リングが勝つのはそのときだけで、あとは話しかけます。',
  'shot.rest':
    'それ以外の時間は黙っています。詰まったときだけ話しかけてきます。',
  'how.caption': '質問が出ていき、答えが返る。エージェントが止まっている時間は短い。',
  'how.handoff': '一方が他方に仕事を渡す',
  'how.dogfoodShort':
    'これ自身も、これで作られました。エージェントを動かすマシンは別の場所にあり、答えはグラス越しに返っていきました。この画面を作ったやり取りも、そうやって行われています。',
  'how.dogfoodTitle': 'これ自身も、これで作られました',
  'intro.net.tailscale': 'Tailscale',
  'intro.net.tailscaleWire': 'インターネット経由',
  'intro.net.phone': 'スマホ',
  'intro.net.phoneDesc': '{product} アプリ',
  'intro.net.bluetooth': 'Bluetooth',
  'intro.net.bluetoothWire': '同じ部屋の中',
  'intro.net.glasses': 'G2 グラス',
  'intro.net.glassesDesc': '読んで、リングで答える',
  'how.title': '全体のつながり',
  'how.lead':
    'エージェントはすぐ目の前にいるように感じます。視界に1行出て、指先で答えられる。けれど実際は、まったく別の場所にあるマシンの中にいます。その距離を埋めているのが、この2つのつなぎ目です。',
  'intro.getNew': '新しいセッションを作る',
  'intro.get1': '複数のエージェントセッションを同時に動かし、切り替える',
  'intro.get2': 'それぞれが何をしているかをリアルタイムで見る',
  'intro.get3': 'グラスから、リングだけで承認・却下する',
  'intro.get4': '会話を読み返す',
  'intro.time':
    'ここで行うセットアップ作業は5つ、続きはスマホのアプリで2つです。所要時間は10分ほどです。',
  'intro.openOnDesktop':
    'このページはマシン本体でも開けます。その場合はコマンドをそのままコピーできます。',

  'machine.title': 'エージェントを動かすマシン',
  'machine.lead':
    'エージェントを動かすマシンを決めます。自分が所有するコンピュータである必要はありません。',
  'machine.supported': '対応環境',
  'machine.linux': 'Linux',
  'machine.linuxArch': 'x86_64',
  'machine.macos': 'macOS',
  'machine.macosArch': 'Apple シリコン',
  'machine.headlessTitle': '画面はいりません',
  'machine.headless':
    'ディスプレイもキーボードも、そこに座る人も不要です。ヘッドレスこそが本来の想定です。マシンへは Tailscale 越しに届き、操作はスマホとグラスから行うので、そのマシンに求めるのは起き続けていることだけです。',
  'machine.awakeTitle': 'スリープさせないこと',
  'machine.awake1':
    'エージェントはあなたが離れている間も動き続けます。スリープしたマシンからは何も届きません。朝に始めたセッションが午後もそこにあるのは、マシンがずっと起きていた場合だけです。',
  'machine.awake2':
    'ノートPCでも、開いて電源につないでいる間は使えます。とはいえ24時間動き続けるものが本来の想定です。先に進む前にスリープと休止状態を切っておいてください。',
  'machine.vpsTitle': '空いているマシンがない場合は借りる',
  'machine.vps1':
    '小さな VPS で十分にこなせます。もともと24時間起動していて、住所も固定されており、Tailscale もデスクトップと同じように入ります。',
  'machine.vps2':
    '軽い用途なら、1〜2コアとメモリ 2GB が出発点になります。ビルドやテスト、複数エージェントの同時実行にはより多くの資源が必要な場合があるため、実行するプロジェクトに合わせて選んでください。エージェントのアカウントには、その VPS からサインインします。',

  'agent.title': 'コーディングエージェントを入れる',
  'agent.lead':
    '{product} はエージェントを動かす側であって、エージェントそのものではありません。マシンに少なくとも1つ入れて、サインインまで済ませてください。',
  'agent.claudeTitle': 'Claude Code',
  'agent.claudeNote': 'インストール後、一度 <code>claude</code> を実行してサインインします。',
  'agent.signInTitle': 'サインインは後回しにしない',
  'agent.signIn':
    '一度もサインインしていないエージェントは、起動するとログイン画面を出します。ログイン画面はグラス越しに出会いたいものではありません。',
  'agent.others':
    'Codex、Grok Build、Kimi Code、opencode にも対応しています。後から追加できるので、このセットアップを終えるには1つあれば足ります。',

  'tailscale.title': 'マシンを Tailscale につなぐ',
  'tailscale.lead':
    'このスマホがマシンに届くのも、HTTPS 証明書が出るのも Tailscale 経由です。インターネットに向けてポートを開くことはありません。',
  'tailscale.linux': 'Linux',
  'tailscale.macos': 'macOS',
  'tailscale.brewNote':
    '上のコマンドなら <code>tailscale</code> が PATH に入ります。macOS アプリにも CLI は含まれますが、Tailscale の設定で CLI 連携を有効にするか、アプリ内の実行ファイルを指定する必要があります。先へ進む前に、このターミナルで <code>tailscale version</code> が動くことを確認してください。',
  'tailscale.certTitle': '証明書の権限を求められた場合',
  'tailscale.certNote':
    '通常は Linux や CLI だけの構成で必要です。macOS アプリでは、すでに証明書を発行できる場合があります。このコマンドが macOS アプリで非対応なら、そのままインストーラへ進んでください。セットアップを続けられない場合は、{binary} のインストーラが必要な操作を表示します。',
  'tailscale.downloads':
    '{link} — アカウントは何でも構いませんが、後でこのスマホでも同じものを使います。',
  'tailscale.downloadsLabel': 'Tailscale のダウンロード',

  'groq.title': '音声入力のためのキー',
  'groq.lead':
    'このツールを動かす主な手段はグラスに話しかけることです。話した内容が文字になり、エージェントへのプロンプトとして届きます。そのために音声認識のキーが要ります。Groq には利用上限付きの無料枠があり、設定は2分ほどで終わります。',
  'groq.whyTitle': 'リングではなく声である理由',
  'groq.why':
    '2つの選択肢から指で選ぶのは、エージェントが2つ用意してくれたときには十分です。ただ実際に言いたいことはたいてい一文で、それを声に出すほうが、グラスのどんな操作より速い。',
  'groq.step1': '1 &middot; Groq のアカウントを作る',
  'groq.step1Note': '無料枠はカード登録なしで使えますが、利用上限があります。',
  'groq.openConsole': 'Groq コンソールを開く',
  'groq.step2': '2 &middot; API キーを作る',
  'groq.step2Note':
    'API Keys から Create API Key。<code>gsk_</code> で始まる文字列が出ます。この場でコピーしてください。ページは一度しか見せてくれません。',
  'groq.step3': '3 &middot; ここに貼る',
  'groq.pasteNote':
    'まだ応答したサーバーがないため、キーは一時的にこのアプリのブラウザストレージへ保存されます。接続時に送信し、サーバーが受け取ったあとで削除します。共用のスマホでは使わないでください。',
  'groq.pastePlaceholder': 'gsk_...',
  'groq.pasteSave': '預かってもらう',
  'groq.pasteHeld': '預かりました。接続したときに送ります。',
  'groq.pasteCleared': '消しました。',
  'groq.pasteEmpty': '預かるものがありません。入力欄が空です。',
  'groq.pasteClear': '忘れてもらう',
  'groq.step3Later': '3 &middot; 最後の画面まで取っておく',
  'groq.sent': '先ほど貼ったキーをサーバーに送りました。',
  'groq.sendFailed': '先ほど貼ったキーを送れませんでした: {error}。下からもう一度貼ってください。',
  'groq.step3Note':
    '貼り付けるのは接続したあと、このセットアップの最後の画面です。このタブを開いたままにするか、スマホから使えるパスワードマネージャーに保存してください。',
  'groq.privacyTitle': '声がどこへ行くか',
  'groq.privacy':
    'グラスは生の音声をあなたのサーバーへ送り、サーバーは音声と API キーを Groq へ送って文字を受け取ります。{product} の開発者はこの経路に入りません。Groq の保存方針と Zero Data Retention の設定は {dataPolicy} で確認できます。音声を Groq へ送りたくない場合は、この手順を飛ばしてください。音声入力以外の機能は使えます。',
  'groq.dataPolicy': 'GroqCloud のデータ取扱い',
  'install.title': '{product} を入れる',
  'install.lead':
    'コマンド1つです。終わってもターミナルを開いたままにするか、最後に表示される短いアドレスを控えてください。セットアップの最後にスマホのアプリへ入力します。',
  'install.whatTitle': 'このコマンドがすること',
  'install.what':
    '{binary} を <code>~/bin</code> に入れ、{herdr} が無ければそれも入れ、再起動後も動くようサービス登録し、最後にスマホのアプリへ入力する短いアドレスを表示します。',
  'install.sudoNote':
    'sudo のコマンドがまだ必要だと表示されたら、その行を実行してから <code>{binary} setup</code> を実行してください。',
  'install.passwordTitle': 'パスワードを付けたい場合',
  'install.password':
    'パスワードを設定しない場合、tailnet のポリシーでこのマシンへの到達を許されたユーザーやデバイスは Hrdle を開けます。個人用の tailnet ならそのままでも構いませんが、共有している場合はパスワードを設定してください。下のプレースホルダーは置き換えてください。パスワードはコマンドライン経由で渡すため、シェル履歴に残る場合があります。',

  'connect.title': '{product} につなぐ',
  'connect.lead':
    'このスマホですることは2つ。tailnet に参加し、マシンの居場所をアプリに伝えます。',
  'connect.tailscaleTitle': '1 · このスマホに Tailscale',
  'connect.tailscaleNote':
    'マシンで使ったのと同じアカウントでサインインしてください。違うと互いに見えません。どちらのリンクもここから開かない場合は、これをブラウザに貼り付けてください:',
  'connect.addressTitle': '2 · 短いアドレス',
  'connect.addressNote':
    'マシンで次を実行してください。短いアドレスが表示されます。91.210.90 のような9文字で、それを下の欄に入力します。',
  'connect.addressForms':
    'ホスト名でも構いませんし、URL を貼り付けられるならそれでも動きます。なお、同じコマンドはその下に完全な URL も表示しますが、あれはブラウザ用で、グラスの設定とは別のことです。',
  'connect.connectButton': '接続する',
  'connect.troubleTitle': 'つながらないとき',
  'connect.trouble':
    'このスマホの Tailscale が接続済みか、マシンで <code>{binary} status</code> が動作中と表示するか、アドレスがマシンの表示と一致しているかを確認してください。',
  'connect.resolving': 'マシンを探しています...',
  'connect.notFound': 'そのマシンから応答がありません',
  'connect.enterFirst': '先にアドレスを入力してください',
  'connect.connecting': '接続しています...',
  'connect.connected': '接続しました',
  'connect.failed': '接続できませんでした: {error}',

  'done.title': '準備完了',
  'done.connected': '接続済み',
  'done.server': 'サーバー',
  'done.version': 'バージョン',
  'done.sessions': 'セッション',
  'done.usage': 'API 使用量',
  'done.app': 'グラスアプリ',
  'done.launchTitle': 'グラスで起動する',
  'done.launch':
    'G2 のアプリメニューから {product} を開きます。スワイプでセッションを移動、タップで選択、ダブルタップで戻ります。',
  'done.disconnect': '接続を解除',

  'outro.title': '続きはスマホで',
  'outro.lead':
    'インストーラは最後に短いアドレスを表示します。残り2ステップは、それを入力するスマホの {product} アプリで行います。',
  'outro.step1Title': '1 · アプリを開く',
  'outro.step1':
    'スマホの EVEN アプリのメニューから {product} を開きます。ここで読んだのと同じウィザードが出るので、最初の画面で <b>セットアップ済み</b> を押すと接続画面へ進めます。',
  'outro.step2Title': '2 · tailnet に参加してアドレスを入力する',
  'outro.step2':
    'スマホに Tailscale を入れて同じアカウントでサインインし、インストーラが表示した短いアドレスを入力します。91.210.90 のような9文字で、それだけです。',
  'outro.addressGoneTitle': 'アドレスを見失ったら',
  'outro.addressGone': 'マシンでもう一度実行してください:',
  'settings.title': '音声入力',
  'settings.subtitle':
    '音声認識には Groq を使います。キーはこのホストに保存され、音声認識のリクエスト時だけ Groq へ送信されます。',
  'settings.key': 'Groq API キー',
  'settings.keySave': 'キーを保存',
  'settings.keyClear': '消去',
  'settings.keyNone': 'キーが未設定です。音声入力を使うには追加してください。',
  'settings.keyEnv':
    'サーバーの環境変数 (GROQ_API_KEY) からキーが設定されています。ここで保存するとそちらより優先されます。',
  'settings.keySaved': 'キーはここに保存されています。',
  'settings.keyPlaceholderSet': 'キーは設定済みです。置き換えるには新しいものを入力してください',
  'settings.keyEmpty': '保存するものがありません。入力欄が空です。',
  'settings.lang': '言語',
  'settings.langAuto': '自動判定',
  'settings.langJa': '日本語',
  'settings.langEn': '英語',
  'settings.langSaved': 'ここに保存されています。',
  'settings.langDefault': 'サーバーの既定値 ({lang})。変更するには選んでください。',
  'settings.prompt': '共通の語彙',
  'settings.promptSave': '語彙を保存',
  'settings.promptReset': '消す',
  'settings.promptOff': '語彙を送らない設定（off）になっています。',
  'settings.promptEnv': 'サーバー環境変数の HRDLE_STT_PROMPT で置き換えられています。',
  'settings.promptComposed':
    'ここの語を毎回の音声認識に、用語集より先に送っています。セッション独自の語はさらにその前に付きます。',
  'settings.failed': '失敗しました: {error}',
}

const TABLES: Record<Lang, Table> = { en: EN, ja: JA }

/**
 * The language to start in.
 *
 * A saved choice wins, because it was made deliberately on this device. Failing
 * that, the browser's own preference: a Japanese phone should not have to be
 * told twice.
 */
function detect(): Lang {
  const saved = read(LANG_KEY)
  if (saved === 'en' || saved === 'ja') return saved
  const candidates = [
    ...(typeof navigator !== 'undefined' ? navigator.languages ?? [] : []),
    typeof navigator !== 'undefined' ? navigator.language : '',
  ]
  return candidates.some((l) => l?.toLowerCase().startsWith('ja')) ? 'ja' : 'en'
}

/**
 * Resolved on first use, not on import.
 *
 * Detection reads the store, and the store's key is built from a constant Vite
 * injects at build time — so doing this at module scope throws in a unit test,
 * which imports the file directly with nothing injected. Deferring it also
 * keeps an import from touching `localStorage` as a side effect.
 */
let current: Lang | null = null

function ensure(): Lang {
  if (current === null) {
    try {
      current = detect()
    } catch {
      current = 'en'
    }
  }
  return current
}

export function getLang(): Lang {
  return ensure()
}

/** Switch language and remember it. The caller re-renders. */
export function setLang(lang: Lang): void {
  current = lang
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {
    // Nothing to persist to; the choice still holds for this run.
  }
}

/**
 * Look up `key`, substituting `{name}` placeholders from `vars`.
 *
 * A missing key falls back to English and then to the key itself. Showing the
 * key is ugly and unmistakable, which is what you want from a string that was
 * never translated — an empty label looks like a layout bug and gets ignored.
 */
export function t(key: string, vars?: Record<string, string | number>): string {
  const raw = TABLES[ensure()][key] ?? EN[key] ?? key
  if (!vars) return raw
  return raw.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in vars ? String(vars[name]) : whole,
  )
}

/** Every key the tables are expected to carry. Used by the tests. */
export function keysOf(lang: Lang): string[] {
  return Object.keys(TABLES[lang]).sort()
}
