#!/bin/sh
# Regenerates the home screen icons in public/icons from assets/app-icon.svg.
# Needs python3 and rsvg-convert (brew install librsvg).
set -e
cd "$(dirname "$0")/.."
tmp=$(mktemp -d)
python3 scripts/glass-icon.py assets/app-icon.svg "$tmp"
rsvg-convert -w 180 -h 180 "$tmp/app-icon-glass.svg" -o public/icons/apple-touch-icon.png
rsvg-convert -w 192 -h 192 "$tmp/app-icon-glass-android.svg" -o public/icons/icon-192.png
rsvg-convert -w 512 -h 512 "$tmp/app-icon-glass-android.svg" -o public/icons/icon-512.png
rsvg-convert -w 512 -h 512 "$tmp/app-icon-glass-maskable.svg" -o public/icons/icon-maskable-512.png
rm -rf "$tmp"
echo "Icons written to public/icons"
