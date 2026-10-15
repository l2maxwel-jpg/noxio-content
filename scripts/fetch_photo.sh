#!/usr/bin/env bash
# Download a stock photo for a cover into assets/photos/<id>.jpg (max 1600 px tall) and note the author in CREDITS.md.
# Usage: scripts/fetch_photo.sh e09 "https://images.unsplash.com/photo-..." "Author Name"
set -euo pipefail
cd "$(dirname "$0")/.."
ID="$1"; URL="$2"; AUTHOR="${3:-}"
mkdir -p assets/photos
BASE="${URL%%\?*}"
curl -sSfL -m 60 -o "build/$ID.photo.jpg" "$BASE?fm=jpg&q=85&w=1600"
convert "build/$ID.photo.jpg" -resize '1600x1600>' -strip -quality 85 "assets/photos/$ID.jpg"
touch assets/photos/CREDITS.md
grep -v "^| $ID |" assets/photos/CREDITS.md > build/credits.tmp || true
mv build/credits.tmp assets/photos/CREDITS.md
grep -q "^| Episode" assets/photos/CREDITS.md || printf '# Cover photos\n\nUnsplash License. Kept for the record; not shown on the videos.\n\n| Episode | Author | Source |\n| --- | --- | --- |\n' > assets/photos/CREDITS.md
echo "| $ID | $AUTHOR | $BASE |" >> assets/photos/CREDITS.md
identify -format "%f %wx%h\n" "assets/photos/$ID.jpg"
