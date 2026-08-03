# hrdle-setup

The setup guide for [Hrdle](https://github.com/hrdle/hrdle), served from
Cloudflare Workers.

**https://hrdle-setup.abe00makoto.workers.dev**

## Why this is not part of the app

Getting Hrdle running takes a machine, two other tools, a command that needs
sudo, and a URL nobody has memorised. The glasses app walks someone through all
of it — but the commands are typed on a machine that is usually *not* the phone
reading them, and a page you can open **on that machine** is a page you can copy
out of. That alone is worth a website.

The rest of it is release cadence. A wording change here costs a deploy. The
same change inside the app costs a rebuilt ehpk, an upload to EVEN Hub, a version
bump and a promotion to Beta — which is what happened three times in one
afternoon before this existed.

## What stays in the app

The boundary is not a preference, it is what a web page cannot do:

| Screen | Where | Why |
|---|---|---|
| What this is, the machine, a coding agent, Tailscale, install | here | nothing but words and commands |
| Connect | the app | the server address must be written to the **host's** store, which is where the G2 reads it from. A different origin's `localStorage` does not exist as far as the glasses are concerned |
| Ready | the app | it talks to the server, and a tailnet address is unreachable from this public origin — Chrome refuses public-to-private outright |

So this site ends by handing over: open the app, press *Already running* on its
first screen, and the last two steps happen there.

## Keeping the wording in step

`src/i18n.ts` is deliberately the same keys and the same sentences as
`glasses/src/i18n.ts` in hrdle/hrdle. Someone reads five screens here and two in
the app; a sentence that changes voice at the boundary is worse than either
version alone. When you change one, change the other.

`src/identity.ts` mirrors that repository's `identity.json` — the product name,
the binary, the repo and the port. It is a copy because this is a separate
project and cannot read that file, the same bargain `install.sh` makes there.

## Development

```bash
bun install
bun run dev        # vite, :5173
bun run build      # -> dist/
bun run deploy     # build, then wrangler deploy — only when bypassing main
```

`wrangler.jsonc` declares static assets and no Worker script at all — Workers
rather than Pages, which is where Cloudflare puts new static projects now.

## Deploying

**A push to `main` is the deploy.** Cloudflare builds and publishes it; there is
nothing to run. That is the whole reason this repository exists — a wording
change should cost a commit, not a release.

`bun run deploy` pushes from a working copy instead, which is for the rare case
where the change must not be on `main` first. It needs `CLOUDFLARE_API_TOKEN` in
the environment; the automatic build does not, because Cloudflare holds its own
credentials.
