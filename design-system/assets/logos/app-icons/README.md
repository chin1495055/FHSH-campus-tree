# 網站圖示（favicon、App 圖示）

從 `../logo-emblem.svg`（鬚鬚公圓章）轉出的 PNG，給簡報和網站的瀏覽器分頁、加到主畫面、PWA 用。圓章本身沒有改色、沒有重畫。

| 檔案 | 尺寸 | 背景 | 用途 |
|---|---|---|---|
| `../logo-emblem.svg` | 向量 | 透明 | 瀏覽器分頁圖示（支援 SVG 的瀏覽器優先用這個） |
| `favicon-32.png`、`favicon-64.png` | 32、64 | 透明 | 不支援 SVG 圖示的瀏覽器 |
| `apple-touch-icon.png` | 180 | 宣紙米白 `surface` | iPhone「加入主畫面」 |
| `icon-192.png`、`icon-512.png` | 192、512 | 宣紙米白 | PWA `manifest.json` 的 `icons`（`purpose: "any"`） |
| `icon-512-maskable.png` | 512 | 宣紙米白，圓章縮到 70% | PWA `manifest.json`（`purpose: "maskable"`），Android 會裁成圓形或圓角方形 |

## 網頁 `<head>` 範例

路徑依頁面位置調整：

```html
<link rel="icon" type="image/svg+xml" href="design-system/assets/logos/logo-emblem.svg">
<link rel="icon" type="image/png" sizes="32x32" href="design-system/assets/logos/app-icons/favicon-32.png">
<link rel="apple-touch-icon" href="design-system/assets/logos/app-icons/apple-touch-icon.png">
```

## `manifest.json` 範例

```json
"icons": [
  { "src": "design-system/assets/logos/app-icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
  { "src": "design-system/assets/logos/app-icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
  { "src": "design-system/assets/logos/app-icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
]
```

要重新產生時，用 Chrome headless 把 `logo-emblem.svg` 依上表的尺寸和背景截圖即可。
