#!/bin/sh
# Собирает index.html из src/head.html + src/app.js
cd "$(dirname "$0")"
{ cat src/head.html; printf '<script>\n'; cat src/app.js; printf '</script>\n<script>\nif ("serviceWorker" in navigator && location.protocol.startsWith("http")) {\n  navigator.serviceWorker.register("sw.js").catch(() => {});\n}\n</script>\n</body></html>\n'; } > index.html
