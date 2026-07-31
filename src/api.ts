// URL tidying, and nothing else.
//
// This file used to hold the calls to someone's Hrdle server. They live in the
// app now: this page is served from a public origin, a tailnet address is inside
// CGNAT space, and Chrome refuses that crossing under Private Network Access no
// matter what CORS says. Measured rather than assumed — from this origin a fetch
// to api.github.com returns 200 and one to a `.ts.net` host fails to reach the
// network at all.
//
// What is left is the one piece of that work a page can still do usefully.

/**
 * A URL typed by a person, made into one that can be fetched.
 *
 * Both halves matter on a phone keyboard: the scheme is four characters of
 * punctuation nobody wants to type, and the port is the part people forget and
 * then cannot diagnose.
 */
export function normalizeUrl(input: string, defaultPort: number): string {
  let value = input.trim().replace(/\/+$/, '')
  if (!value) return ''
  if (!value.match(/^https?:\/\//)) value = `https://${value}`
  if (!value.match(/:\d+$/)) value = `${value}:${defaultPort}`
  return value
}
