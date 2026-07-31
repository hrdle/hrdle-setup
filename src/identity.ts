// What the product is called.
//
// Mirrored from `identity.json` in hrdle/hrdle, which is that repository's
// single source of truth for the name, the binary, the repo and the port. This
// is a separate project and cannot read that file, so it keeps a copy — the same
// bargain `install.sh` makes there, and for the same reason.
//
// If a rename ever happens again, this file is one of the places that has to
// move. It is small on purpose so that it is easy to check.

export const PRODUCT_NAME = 'Hrdle'
export const BINARY_NAME = 'hrdle'
export const REPO = 'hrdle/hrdle'
export const DEFAULT_PORT = 5924

export const INSTALL_CMD = `curl -fsSL https://raw.githubusercontent.com/${REPO}/main/install.sh | bash`
