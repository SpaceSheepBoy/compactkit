# Just Compress

Free, privacy-first file compressors that run **entirely in the browser**. Files are processed on the user's own device with WebAssembly and are never uploaded.

- **Compress PDF** — `/compress-pdf/` — Ghostscript (WASM)
- **Compress Audio** — `/compress-audio/` — FFmpeg (WASM)
- **Compress Video** — `/compress-video/` — FFmpeg (WASM)

Static site, hosted on GitHub Pages. No build step.

## Open-source components

- **Ghostscript** (PDF engine) is loaded at runtime from `@jspawn/ghostscript-wasm` (AGPL-3.0). This site's source is public, satisfying AGPL's source-availability requirement.
- **FFmpeg** (audio/video engine) is loaded at runtime from `@ffmpeg/core` (WASM). The `@ffmpeg/ffmpeg` and `@ffmpeg/util` wrapper files vendored under `/vendor/` are MIT-licensed, included here so the worker loads same-origin (cross-origin module workers are blocked by browsers).

## Companion iOS apps

- [Just PDF Compressor on the App Store](https://apps.apple.com/us/app/pdf-compressor-sign-merge/id6769762323)
- [Just Audio Compressor on the App Store](https://apps.apple.com/us/app/audio-compressor-reduce-size/id6769563659)
