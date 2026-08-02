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
// Kept deliberately in step with `glasses/src/i18n.ts` in hrdle/hrdle: the same
// keys, the same wording. Someone reads five of these screens here and the last
// two in the app, and a sentence that changes voice at the boundary is worse
// than either version alone.

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
  'nav.next': 'Done — next',
  'nav.back': 'Back',
  'nav.skip': 'Already running',
  'nav.step': 'Step {n} of {total} · {label}',
  'nav.onMachine': 'On that machine',
  'nav.onPhone': 'On your phone',
  'cmd.copy': 'copy',
  'cmd.copied': 'copied',
  'cmd.copyFailed': 'failed',

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

  'intro.title': 'Why you would want this',
  'intro.lead':
    'The session itself is yours to control. Open one, look inside it, type into it, start another, close it. That is the difference, and everything else follows from it.',
  'intro.nameTitle': 'Where the name comes from',
  'intro.name':
    '{product} is <strong>herdr</strong> plus <strong>handle</strong>. herdr runs the sessions; this is the handle you take hold of them by, from the G2. Not a view of them — a grip on them: what you would do at the keyboard, you do here.',
  'demo.one': 'one session',
  'demo.split': 'split it',
  'demo.more': 'start another',
  'demo.send': 'type into any of them',
  'demo.watch': 'and you can watch it happen',
  'intro.diffTitle': 'What this is next to',
  'intro.diff':
    'Holding the sessions is not {product}\'s doing — herdr does that, and a session here <em>is</em> a herdr pane. So the honest comparisons are not Claude Code and the rest, which are the things being run. They are these three.',
  'intro.rivalEvenTitle': "Even's own Terminal Mode",
  'intro.rivalEven':
    'The closest thing there is, and it comes from the people who made the glasses: <code>even-terminal</code> spawns one agent, renders its output to the G2, and turns ring gestures back into keystrokes. If you want one agent on your glasses, install it and stop reading — it is one npm install and a QR scan, and there is no herdr to set up. What it does not do is hold sessions: it is a renderer and an input bridge, one process, one working directory.',
  'intro.rivalCmuxTitle': 'cmux',
  'intro.rivalCmux':
    'A native macOS terminal built for running agents in parallel — tabs, split panes, an embedded browser, a socket API, and an iPhone app that mirrors the terminals. If you work at a Mac and want the best window onto several agents while you are sitting at it, this is that. macOS only, and no glasses.',
  'intro.rivalHerdrTitle': 'herdr on its own',
  'intro.rivalHerdr':
    'Everything {product} knows about sessions, herdr already does — and you can drive it from a terminal without any of this. The catch is the terminal: the grip is real, but the hand holding it has to be at a keyboard.',
  'intro.gapTitle': 'You need never open a computer again',
  'intro.gap':
    'Not to watch a session — to <em>start</em> one. Once the setup below is done, the server is already awake: you make a new session from your phone (a name, a directory, which agent, which machine), say out loud what you want done, and answer from the glasses when it asks. Nothing in that day involves a laptop.',
  'intro.gap2':
    'That is the line the others do not cross. <code>even-terminal</code> spawns an agent in the directory you launched it from, so the work begins at the keyboard you launched it from. cmux is a window onto the Mac you are sitting at. Both are good ways to keep an eye on work you started at a desk. This is a way to start it without one — and with more than one session, on more than one machine, at the same time.',
  'intro.seeTitle': 'Agents talking to each other, in plain sight',
  'intro.see':
    'When Claude Code hands work to Kimi Code, that is not something happening inside a black box. It is a pane, on a screen, that you can watch it happen in. herdr makes the conversation between agents as visible as the conversation with one.',
  'intro.freeTitle': 'And so: not tied to a desk',
  'intro.free':
    'What you control, you can control from anywhere. Develop while you walk. Develop on the train. An agent works for minutes, stops to ask you something — and instead of waiting until you are back at the screen, the question arrives on your glasses and you answer it with the ring.',
  'intro.stillTitle': 'The reason it is worth anything',
  'intro.still':
    'A coding agent works for minutes at a time, then stops to ask you something. If you are not at the screen, it waits — and so does the work.',
  'intro.problemTitle': 'What that looks like',
  'intro.problem':
    'You set a refactor going and walk away. Ten minutes later it is sitting on a question it asked nine minutes ago, and nothing has happened since.',
  'intro.answerTitle': 'What {product} does about it',
  'intro.answer':
    'The question arrives on your glasses. You answer it with the ring — in the kitchen, on a walk, in a meeting — and the agent carries on. The screen stops being the place you have to be.',
  'intro.whatTitle': 'What it is, concretely',
  'intro.what':
    '{product} runs your coding agents — Claude Code, Codex, Grok, Kimi — on a machine of yours, and puts them on your phone and on the G2.',
  'intro.net.machine': 'A machine · awake 24/7',
  'intro.net.machineDesc': 'the {product} server, and herdr underneath it',
  'how.herdr': 'herdr — every session lives in one',
  'how.agents': 'and they can talk to each other',
  'tour.0': 'The agents run on a machine of yours. This one.',
  'tour.1': 'Inside it, herdr holds every session — and one can drive another.',
  'tour.2': 'The other two devices run nothing at all. They are windows onto this.',
  'tour.3': 'An agent stops to ask something. The question travels out to you.',
  'tour.4': 'It arrives in front of your eye. Answer with the ring, and work resumes.',
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
  'tour.ask': 'Apply this refactor?',
  'tour.yes': 'yes',
  'tour.no': 'no',
  'tour.tap': 'tap to skip ahead',
  'how.caption': 'A question travels out. An answer goes back. The agent never stopped for long.',
  'how.handoff': 'one hands work to another',
  'how.dogfoodShort':
    'This was built this way. The machine running the agents was somewhere else, and the answers went back through a pair of glasses — including the ones that produced this screen.',
  'how.dogfoodTitle': 'This was built this way',
  'how.dogfood':
    'Hrdle is developed on Hrdle. This screen, and the sentence you are reading, were not written at a desk — the machine running the agents was somewhere else entirely, and the answers went back through a pair of glasses. A development PC has stopped being a place you have to be.',
  'how.freeTitle': 'Nothing is walled off',
  'how.free':
    'Starting a session is an ordinary operation, and so is one session talking to another. Claude Code can drive Kimi Code. Codex can be handed a task by something that is not you. An agent can read what another agent is looking at, answer its question, and hand back — across a machine, or across two of them over the tailnet. There is no sandbox between them saying no.',
  'intro.net.machineNote':
    'A desktop at home or a VPS you rent. The agents actually run here and keep working while you are not watching, so it must not sleep.',
  'intro.net.tailscale': 'Tailscale',
  'intro.net.tailscaleWire': 'over the internet',
  'intro.net.tailscaleNote':
    '<b>Tailscale</b> is a VPN across your own devices. That leg crosses the open internet, so the phone reaches the machine from anywhere — encrypted end to end, with no port opened for anyone else to find.',
  'intro.net.phone': 'Your phone',
  'intro.net.phoneDesc': 'the {product} app',
  'intro.net.bluetooth': 'Bluetooth',
  'intro.net.bluetoothWire': 'in the room',
  'intro.net.glasses': 'The G2',
  'intro.net.glassesDesc': 'read, and answer with the ring',
  'how.title': 'How the pieces fit',
  'how.lead':
    'The agent feels like it is right here — one line in front of your eye, answered with a thumb. It is not. It is on a machine somewhere else entirely, and these two hops are what close the distance.',
  'how.closingTitle': 'Which is the trick',
  'how.closing':
    'Nothing runs on the glasses and nothing runs on the phone. They are a window onto a machine that may be in another building, and the window is what makes it feel like arm\'s reach.',
  'intro.getTitle': 'What you get',
  'intro.get1': 'Run several agent sessions at once and switch between them',
  'intro.get2': 'Watch what each one is doing, live',
  'intro.get3': 'Approve or reject a prompt from the glasses, with the ring',
  'intro.get4': 'Read back the conversation',
  'intro.time':
    'Five short steps here, then two in the app on your phone. About ten minutes.',
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
    'One or two cores and 2 GB of memory is enough for several agent sessions. Your agent accounts sign in from there rather than from your desk, which is worth knowing but is not usually a problem.',

  'agent.title': 'Install a coding agent',
  'agent.lead':
    '{product} drives agents; it is not one itself. Install at least one on that machine and sign in.',
  'agent.claudeTitle': 'Claude Code',
  'agent.claudeNote': 'Then run <code>claude</code> once and sign in.',
  'agent.signInTitle': 'Sign in now, not later',
  'agent.signIn':
    'An agent that has never been signed in shows a login screen when it starts — and a login screen is not something you want to meet through the glasses.',
  'agent.others':
    'Codex, Grok Build and Kimi Code work too, and you can add them later. One is enough to finish this setup.',

  'tailscale.title': 'Put that machine on Tailscale',
  'tailscale.lead':
    'Tailscale is how this phone reaches that machine, and where its HTTPS certificate comes from. No ports are opened to the internet.',
  'tailscale.linux': 'Linux',
  'tailscale.macos': 'macOS',
  'tailscale.brewNote':
    'Install it with brew rather than the App Store — the App Store build ships no command line tool, and setup needs one.',
  'tailscale.certTitle': 'Then allow certificates, once',
  'tailscale.certNote':
    'Without this {binary} cannot issue its HTTPS certificate and will refuse to start.',
  'tailscale.downloads':
    '{link} — sign in with any account you like; you will use the same one on this phone later.',
  'tailscale.downloadsLabel': 'Tailscale downloads',

  'groq.title': 'A key for the voice input',
  'groq.lead':
    'Talking to the glasses is the main way to drive this. You say what you want, it becomes text, and the agent gets it as a prompt — which needs a transcription key. It is free, and it takes two minutes.',
  'groq.whyTitle': 'Why not the ring',
  'groq.why':
    'Choosing between two answers with a thumb is fine when the agent has offered two answers. Most of the time what you want to say is a sentence, and speaking it is faster than any control on a pair of glasses could be.',
  'groq.step1': '1 &middot; Make a Groq account',
  'groq.step1Note': 'Free, and it does not ask for a card.',
  'groq.openConsole': 'Open the Groq console',
  'groq.step2': '2 &middot; Create an API key',
  'groq.step2Note':
    'API Keys, then Create API Key. What you get starts with <code>gsk_</code>. Copy it now — the page shows it once and never again.',
  'groq.step3': '3 &middot; Paste it here',
  'groq.pasteNote':
    'There is nowhere to send it yet — no server has answered. So it waits on this phone and goes across by itself the moment you connect, which is two screens away. Held in this browser only, and deleted the instant it lands.',
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
    'You paste it once you have connected, on the last screen of this setup. Leave the tab open, or paste it somewhere you can get at from your phone.',
  'groq.privacyTitle': 'Where your voice goes',
  'groq.privacy':
    'The glasses hand raw audio to your own server, which sends it to Groq and gets text back. The key is stored on that server and is never relayed anywhere else — nobody who built {product} is in the path. If you would rather not speak to it at all, skip this: everything else works without it.',
  'install.title': 'Install {product}',
  'install.lead':
    'One command. Leave that window open when it finishes — it ends by drawing a QR code, and the next screen reads it.',
  'install.whatTitle': 'What it does',
  'install.what':
    'Installs {binary} into <code>~/bin</code> and {herdr} if it is missing, registers the service so it survives a reboot, and prints the address as a QR code.',
  'install.sudoNote':
    'If it says a sudo command is still needed, run that line and then <code>{binary} setup</code>.',
  'install.passwordTitle': 'Want a password on it?',
  'install.password':
    'As installed, anything signed in to your tailnet can open it — usually your own devices, and nothing is exposed to the internet either way. To be asked for a password in the browser instead, run:',

  'connect.title': 'Connect to {product}',
  'connect.lead':
    'Two things on this phone: join the tailnet, then tell the app where that machine is.',
  'connect.tailscaleTitle': '1 · Tailscale on this phone',
  'connect.tailscaleNote':
    'Sign in with the same account you used on that machine, or the two cannot see each other. If neither link opens from here, copy this into a browser:',
  'connect.addressTitle': '2 · The short address',
  'connect.addressNote':
    'Run this on that machine. Under the code it prints a short address — nine characters, like 91.210.90. That is what goes in the box.',
  'connect.addressForms':
    'A hostname works too, and so does a full URL if you have one to paste. Scanning the code with this phone\u2019s own camera app opens the server in a browser, which is a different thing from setting the glasses up.',
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
  'done.launchTitle': 'Launch it on the glasses',
  'done.launch':
    'Open {product} from the G2 app menu. Swipe to move between sessions, tap to select, double tap to go back.',
  'done.disconnect': 'Disconnect',

  'scan.cameraFailed': 'The camera could not be opened: {error}',
  'scan.readFailed': 'Could not read that photo: {error}',
  'scan.noCode': 'No QR code in that photo. Fill more of the frame with it and try again.',
  'scan.notAnAddress': 'That code is not a web address. Scan the one printed by `{binary} qr`.',
  'scan.imageUnreadable': 'that image could not be read',
  'scan.imageEmpty': 'that image was empty',
  'scan.cannotProcess': 'this device cannot process the photo',

  'outro.title': 'Now finish it on your phone',
  'outro.lead':
    'The installer ended by drawing a QR code. The last two steps happen in the {product} app on your phone, which reads it.',
  'outro.step1Title': '1 · Open the app',
  'outro.step1':
    'Open {product} from the EVEN app menu on your phone. It shows the same wizard you have been reading — press <b>Already running</b> on the first screen to skip straight to the end.',
  'outro.step2Title': '2 · Join the tailnet and scan',
  'outro.step2':
    'Install Tailscale on the phone with the same account, then point the camera at the code. That is the whole of it — reading the code connects.',
  'outro.qrGoneTitle': 'Lost the code?',
  'outro.qrGone': 'Run this on the machine again:',
  'outro.getApp': 'Get the app for the G2',
  'settings.title': 'Voice input',
  'settings.subtitle':
    'Transcription runs on the server through Groq. The key never leaves that host.',
  'settings.key': 'Groq API key',
  'settings.keySave': 'Save key',
  'settings.keyClear': 'Clear',
  'settings.keyNone': 'No key set - transcription will fail with 503.',
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
  'settings.prompt': 'Vocabulary prompt',
  'settings.promptSave': 'Save prompt',
  'settings.promptReset': 'Reset',
  'settings.promptSetting': 'Using the prompt saved here.',
  'settings.promptEnv': 'Using HRDLE_STT_PROMPT from the server environment.',
  'settings.promptComposed':
    'Using the prompt composed from your workspace names and the glossary.',
  'settings.failed': 'Failed: {error}',
}

const JA: Table = {
  'brand.for': 'for EVEN G2',
  'nav.start': 'セットアップを始める',
  'nav.next': 'できた — 次へ',
  'nav.back': '戻る',
  'nav.skip': 'もう動いている',
  'nav.step': 'ステップ {n}/{total} · {label}',
  'nav.onMachine': 'サーバー側の作業',
  'nav.onPhone': 'スマホでの作業',
  'cmd.copy': 'コピー',
  'cmd.copied': 'コピーしました',
  'cmd.copyFailed': '失敗',

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

  'intro.title': 'なぜこれを使うのか',
  'intro.lead':
    'セッションそのものが、あなたの制御下にあります。開く、中を覗く、文字を送る、新しく作る、閉じる。そこが違いで、ほかのことはすべてそこから出てきます。',
  'intro.nameTitle': '名前の由来',
  'intro.name':
    '{product} は <strong>herdr</strong> と <strong>handle</strong> です。セッションを動かしているのは herdr で、これはそれを掴むための取っ手。G2 から握ります。眺めるためのものではありません。キーボードの前でやることは、ここでできます。',
  'demo.one': 'セッションがひとつ',
  'demo.split': '分割する',
  'demo.more': 'もうひとつ作る',
  'demo.send': 'どれにでも打ち込める',
  'demo.watch': 'そしてそれが見える',
  'intro.diffTitle': '何と比べるか',
  'intro.diff':
    'セッションを掌握できること自体は {product} の手柄ではありません。それは herdr がやっていて、ここでのセッションは herdr のペイン<em>そのもの</em>です。だから比較すべき相手は Claude Code たちではありません。あれは動かされる側です。比べるべきはこの3つです。',
  'intro.rivalEvenTitle': 'Even 純正の Terminal Mode',
  'intro.rivalEven':
    '最も近いもので、しかもグラスを作った当人たちのものです。<code>even-terminal</code> はエージェントを1つ起動し、その出力を G2 に描き、リングのジェスチャーをキー入力に戻します。グラスでエージェントを1つ見たいだけなら、これを入れてここを読むのをやめてください。npm install ひとつと QR スキャンで済み、herdr の用意も要りません。やらないのはセッションの掌握です。あれはレンダラと入力ブリッジで、1プロセス・1ディレクトリです。',
  'intro.rivalCmuxTitle': 'cmux',
  'intro.rivalCmux':
    'エージェントを並列に動かすための macOS ネイティブなターミナルです。タブ、分割ペイン、埋め込みブラウザ、ソケット API、そしてターミナルを同期する iPhone アプリまであります。Mac の前に座って複数のエージェントを見るなら、いちばん良い窓はこれです。macOS 専用で、グラスには出ません。',
  'intro.rivalHerdrTitle': 'herdr 単体',
  'intro.rivalHerdr':
    '{product} がセッションについて知っていることは、すべて herdr が既にやっています。これを入れなくても、ターミナルから同じように操れます。引っかかるのはそのターミナルです。掌握は本物ですが、掌握する側がキーボードの前にいなければなりません。',
  'intro.gapTitle': 'もう PC を開かなくてよくなる',
  'intro.gap':
    'セッションを見るためではなく、<em>始める</em>ために、です。下のセットアップを一度終えれば、サーバーはもう起きています。新しいセッションはスマホから作れます（名前、作業ディレクトリ、どのエージェント、どのマシン）。やってほしいことは声で伝え、聞かれたらグラスで答える。その一日のどこにも laptop は出てきません。',
  'intro.gap2':
    'ここが、ほかが越えない線です。<code>even-terminal</code> は起動したディレクトリでエージェントを立ち上げるので、仕事は起動したキーボードの前で始まります。cmux は目の前の Mac を覗く窓です。どちらも机で始めた仕事を見張る手段としては良いものです。これは、机なしで始めるための手段です。しかも複数のセッションを、複数のマシンにまたがって、同時に。',
  'intro.seeTitle': 'エージェント同士のやり取りも、目に見える',
  'intro.see':
    'Claude Code が Kimi Code に仕事を渡すとき、それはブラックボックスの中の出来事ではありません。画面上のペインで、実際に起きているのが見えます。herdr は、エージェント同士の会話を、エージェントとの会話と同じだけ見えるものにします。',
  'intro.freeTitle': 'だから、机に縛られない',
  'intro.free':
    '制御下にあるものは、どこからでも制御できます。歩きながら開発する。電車の中で開発する。エージェントは数分働いては何かを尋ねて止まりますが、あなたが画面の前に戻るまで待たせる代わりに、その質問はグラスに届き、リングで答えられます。',
  'intro.stillTitle': 'なぜそれに意味があるのか',
  'intro.still':
    'コーディングエージェントは数分働いては、あなたに何かを尋ねて止まります。画面の前にいなければ、エージェントは待ち続け、仕事も止まったままです。',
  'intro.problemTitle': '実際に起きること',
  'intro.problem':
    'リファクタを走らせて席を立つ。10分後に戻ると、9分前に投げられた質問の前で止まっていて、その間なにも進んでいない。',
  'intro.answerTitle': '{product} がすること',
  'intro.answer':
    'その質問がグラスに届きます。台所でも、散歩中でも、会議中でも、リングで答えればエージェントは続きを始めます。画面の前が「いなければならない場所」ではなくなります。',
  'intro.whatTitle': '具体的には',
  'intro.what':
    '{product} は Claude Code、Codex、Grok、Kimi といったコーディングエージェントをあなたのマシンで動かし、それをスマホと G2 に映します。',
  'intro.net.machine': 'マシン · 24時間起動',
  'intro.net.machineDesc': '{product} サーバーと、その下の herdr',
  'how.herdr': 'herdr — すべてのセッションはこの中',
  'how.agents': 'そして互いに話せる',
  'tour.0': 'エージェントが動くのは、あなたのマシン。これです。',
  'tour.1': '中では herdr がすべてのセッションを持っていて、一方が他方を動かせます。',
  'tour.2': 'ほかの2つは何も動かしていません。これを覗く窓です。',
  'tour.3': 'エージェントが何かを尋ねて止まる。その質問があなたに向かって出ていきます。',
  'tour.4': '目の前に届く。リングで答えれば、仕事が再開します。',
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
  'tour.ask': 'このリファクタを適用する?',
  'tour.yes': 'はい',
  'tour.no': 'いいえ',
  'tour.tap': 'タップで次へ',
  'how.caption': '質問が出ていき、答えが返る。エージェントが止まっている時間は短い。',
  'how.handoff': '一方が他方に仕事を渡す',
  'how.dogfoodShort':
    'これ自身も、これで作られました。エージェントを動かすマシンは別の場所にあり、答えはグラス越しに返っていきました。この画面を作ったやり取りも、そうやって行われています。',
  'how.dogfoodTitle': 'これ自身も、これで作られました',
  'how.dogfood':
    'Hrdle の開発は Hrdle の上で行われています。この画面も、いま読んでいるこの文章も、机に向かって書かれたものではありません。エージェントを動かしていたマシンはまったく別の場所にあり、返事はグラス越しに戻っていきました。開発用の PC は、もう「いなければならない場所」ではありません。',
  'how.freeTitle': '制限がない',
  'how.free':
    'セッションを起動するのも、セッション同士が話すのも、ごく普通の操作です。Claude Code から Kimi Code を動かす。Codex に、あなた以外の誰かが仕事を渡す。別のエージェントが見ているものを読み、その質問に答えて返す — 同じマシンの中でも、tailnet 越しに2台にまたがってでも。あいだに「駄目だ」と言うサンドボックスはありません。',
  'intro.net.machineNote':
    '自宅のデスクトップでも、借りた VPS でも構いません。エージェントが実際に動くのはここで、あなたが見ていない間も動き続けるため、スリープさせてはいけません。',
  'intro.net.tailscale': 'Tailscale',
  'intro.net.tailscaleWire': 'インターネット経由',
  'intro.net.tailscaleNote':
    '<b>Tailscale</b> は自分のデバイス同士をつなぐ VPN です。この区間はインターネットを通るので、どこからでもマシンに届きます。通信は端から端まで暗号化され、他人に見つかるポートは開きません。',
  'intro.net.phone': 'スマホ',
  'intro.net.phoneDesc': '{product} アプリ',
  'intro.net.bluetooth': 'Bluetooth',
  'intro.net.bluetoothWire': '同じ部屋の中',
  'intro.net.glasses': 'G2 グラス',
  'intro.net.glassesDesc': '読んで、リングで答える',
  'how.title': '全体のつながり',
  'how.lead':
    'エージェントはすぐ目の前にいるように感じます。視界に1行出て、指先で答えられる。けれど実際は、まったく別の場所にあるマシンの中にいます。その距離を埋めているのが、この2つのつなぎ目です。',
  'how.closingTitle': 'そこが面白いところ',
  'how.closing':
    'グラスでも、スマホでも、何ひとつ動いていません。2つとも、別の建物にあるかもしれないマシンを覗く窓です。その窓が、手の届く距離にいるように感じさせています。',
  'intro.getTitle': 'できること',
  'intro.get1': '複数のエージェントセッションを同時に動かし、切り替える',
  'intro.get2': 'それぞれが何をしているかをリアルタイムで見る',
  'intro.get3': 'グラスから、リングだけで承認・却下する',
  'intro.get4': '会話を読み返す',
  'intro.time':
    'ここで5ステップ、続きはスマホのアプリで2ステップ。10分ほどです。',
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
    '1〜2コアとメモリ 2GB あれば複数のエージェントセッションを動かせます。エージェントのアカウントは手元ではなくその VPS からサインインすることになる点は知っておくとよいですが、通常は問題になりません。',

  'agent.title': 'コーディングエージェントを入れる',
  'agent.lead':
    '{product} はエージェントを動かす側であって、エージェントそのものではありません。マシンに少なくとも1つ入れて、サインインまで済ませてください。',
  'agent.claudeTitle': 'Claude Code',
  'agent.claudeNote': 'インストール後、一度 <code>claude</code> を実行してサインインします。',
  'agent.signInTitle': 'サインインは後回しにしない',
  'agent.signIn':
    '一度もサインインしていないエージェントは、起動するとログイン画面を出します。ログイン画面はグラス越しに出会いたいものではありません。',
  'agent.others':
    'Codex、Grok Build、Kimi Code にも対応しています。後から追加できるので、このセットアップを終えるには1つあれば足ります。',

  'tailscale.title': 'マシンを Tailscale につなぐ',
  'tailscale.lead':
    'このスマホがマシンに届くのも、HTTPS 証明書が出るのも Tailscale 経由です。インターネットに向けてポートを開くことはありません。',
  'tailscale.linux': 'Linux',
  'tailscale.macos': 'macOS',
  'tailscale.brewNote':
    'App Store 版ではなく brew で入れてください。App Store 版にはコマンドラインツールが含まれず、セットアップにはそれが必要です。',
  'tailscale.certTitle': '証明書の発行を一度だけ許可する',
  'tailscale.certNote':
    'これがないと {binary} は HTTPS 証明書を発行できず、起動を拒否します。',
  'tailscale.downloads':
    '{link} — アカウントは何でも構いませんが、後でこのスマホでも同じものを使います。',
  'tailscale.downloadsLabel': 'Tailscale のダウンロード',

  'groq.title': '音声入力のためのキー',
  'groq.lead':
    'このツールを動かす主な手段はグラスに話しかけることです。話した内容が文字になり、エージェントへのプロンプトとして届きます。そのために音声認識のキーが要ります。無料で、2分で終わります。',
  'groq.whyTitle': 'リングではなく声である理由',
  'groq.why':
    '2つの選択肢から指で選ぶのは、エージェントが2つ用意してくれたときには十分です。ただ実際に言いたいことはたいてい一文で、それを声に出すほうが、グラスのどんな操作より速い。',
  'groq.step1': '1 &middot; Groq のアカウントを作る',
  'groq.step1Note': '無料で、カード番号も聞かれません。',
  'groq.openConsole': 'Groq コンソールを開く',
  'groq.step2': '2 &middot; API キーを作る',
  'groq.step2Note':
    'API Keys から Create API Key。<code>gsk_</code> で始まる文字列が出ます。この場でコピーしてください。ページは一度しか見せてくれません。',
  'groq.step3': '3 &middot; ここに貼る',
  'groq.pasteNote':
    'まだ送り先がありません。どのサーバーも応答していないからです。そこでこのスマホの中で待たせておき、接続した瞬間に自分で渡りに行きます。接続は2画面先です。このブラウザの中だけに置かれ、渡った瞬間に消えます。',
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
    '貼り付けるのは接続したあと、このセットアップの最後の画面です。タブを開いたままにするか、スマホから取り出せるところに控えておいてください。',
  'groq.privacyTitle': '声がどこへ行くか',
  'groq.privacy':
    'グラスは生の音声をあなた自身のサーバーに渡し、サーバーが Groq に送って文字を受け取ります。キーはそのサーバーに保存され、ほかのどこにも中継されません。{product} を作った人間も経路にいません。話しかけるつもりがなければ、この手順は飛ばして構いません。ほかはすべて動きます。',
  'install.title': '{product} を入れる',
  'install.lead':
    'コマンド1つです。終わってもそのウィンドウは開いたままにしてください。最後に QR コードを描き、次の画面でそれを読み取ります。',
  'install.whatTitle': 'このコマンドがすること',
  'install.what':
    '{binary} を <code>~/bin</code> に入れ、{herdr} が無ければそれも入れ、再起動後も動くようサービス登録し、最後にアドレスを QR コードで表示します。',
  'install.sudoNote':
    'sudo のコマンドがまだ必要だと表示されたら、その行を実行してから <code>{binary} setup</code> を実行してください。',
  'install.passwordTitle': 'パスワードを付けたい場合',
  'install.password':
    'そのままの状態では、あなたの tailnet にサインインしているものなら開けます。たいていは自分のデバイスだけですし、どちらにせよインターネットには公開されません。ブラウザでパスワードを求めるようにするには、次を実行します:',

  'connect.title': '{product} につなぐ',
  'connect.lead':
    'このスマホですることは2つ。tailnet に参加し、マシンの居場所をアプリに伝えます。',
  'connect.tailscaleTitle': '1 · このスマホに Tailscale',
  'connect.tailscaleNote':
    'マシンで使ったのと同じアカウントでサインインしてください。違うと互いに見えません。どちらのリンクもここから開かない場合は、これをブラウザに貼り付けてください:',
  'connect.addressTitle': '2 · 短いアドレス',
  'connect.addressNote':
    'マシンで次を実行してください。コードの下に短いアドレスが表示されます。91.210.90 のような9文字で、それを下の欄に入力します。',
  'connect.addressForms':
    'ホスト名でも構いませんし、URL を貼り付けられるならそれでも動きます。なお、コードをこのスマホの標準カメラアプリで読むとブラウザでサーバーが開きますが、それはグラスの設定とは別のことです。',
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
  'done.launchTitle': 'グラスで起動する',
  'done.launch':
    'G2 のアプリメニューから {product} を開きます。スワイプでセッションを移動、タップで選択、ダブルタップで戻ります。',
  'done.disconnect': '接続を解除',

  'scan.cameraFailed': 'カメラを開けませんでした: {error}',
  'scan.readFailed': 'その写真を読み取れませんでした: {error}',
  'scan.noCode':
    'その写真に QR コードが見つかりません。コードが画面いっぱいに写るようにして、もう一度試してください。',
  'scan.notAnAddress':
    'そのコードはウェブアドレスではありません。`{binary} qr` が表示するコードを読み取ってください。',
  'scan.imageUnreadable': '画像を読み込めませんでした',
  'scan.imageEmpty': '画像が空でした',
  'scan.cannotProcess': 'この端末では写真を処理できません',

  'outro.title': '続きはスマホで',
  'outro.lead':
    'インストーラは最後に QR コードを表示します。残り2ステップは、それを読み取るスマホの {product} アプリで行います。',
  'outro.step1Title': '1 · アプリを開く',
  'outro.step1':
    'スマホの EVEN アプリのメニューから {product} を開きます。ここで読んだのと同じウィザードが出るので、最初の画面で <b>もう動いている</b> を押せば末尾まで飛べます。',
  'outro.step2Title': '2 · tailnet に参加してコードを読む',
  'outro.step2':
    'スマホに Tailscale を入れて同じアカウントでサインインし、カメラをコードに向けます。読み取れば接続まで完了します。',
  'outro.qrGoneTitle': 'コードを見失ったら',
  'outro.qrGone': 'マシンでもう一度実行してください:',
  'outro.getApp': 'G2 用アプリを入手',
  'settings.title': '音声入力',
  'settings.subtitle':
    '音声認識はサーバー側で Groq を通して実行されます。キーがそのホストから出ることはありません。',
  'settings.key': 'Groq API キー',
  'settings.keySave': 'キーを保存',
  'settings.keyClear': '消去',
  'settings.keyNone': 'キーが未設定です。音声認識は 503 で失敗します。',
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
  'settings.prompt': '語彙プロンプト',
  'settings.promptSave': 'プロンプトを保存',
  'settings.promptReset': '既定に戻す',
  'settings.promptSetting': 'ここに保存されたプロンプトを使っています。',
  'settings.promptEnv': 'サーバー環境変数の HRDLE_STT_PROMPT を使っています。',
  'settings.promptComposed': 'ワークスペース名と用語集から組み立てたプロンプトを使っています。',
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
