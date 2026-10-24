#!/bin/bash
# 把 cards.html 的每張圖卡輸出成 PNG，放到 out/。
# 用法：在 repo 根目錄跑 bash docs/vote-campaign/cards/render.sh（可以只給卡片編號，例如 render.sh c1 c6-3h）
# 用本機的 Google Chrome 無頭模式截圖；字體和 QR code 從網路載入，要有網路。
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
CHROME="${CHROME_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
OUT="$DIR/out"
mkdir -p "$OUT"
IDS=("$@")
if [ ${#IDS[@]} -eq 0 ]; then
  IDS=(c1 c2-1 c2-2 c2-3 c2-4 c2-5 c3-1 c3-2 c3-3 c3-4 c3-5 c4-xuxugong c4-gadang c4-queque c4-luan c5 c6-3d c6-1d c6-3h c7 og c8-1 c8-2 c8-3 c8-4 c8-5)
fi
for id in "${IDS[@]}"; do
  case "$id" in c6-*) W=1080 H=1920 ;; og) W=1200 H=630 ;; *) W=1080 H=1350 ;; esac
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --force-device-scale-factor=1 --window-size=$W,$H --virtual-time-budget=8000 \
    --screenshot="$OUT/$id.png" "file://$DIR/cards.html?c=$id" >/dev/null 2>&1
  echo "已輸出 $id.png"
done
