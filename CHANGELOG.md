# Changelog

## 1.4.0

- Accept `site` + `form` combo (in lieu of `id`) for identifying forms.

## 1.3.0

- Fix bugs affecting form data that is not an instance of `FormData`.
- Remove use of `async`/`await` in favor of promises, to reduce transpilating needs.
- Remove use of `class` to reduce transpiling needs.
- Bundle in [ponyfills](https://github.com/sindresorhus/ponyfill) for `window.fetch`, `Promise`, and `objectAssign`.
