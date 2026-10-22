地圖標記：小屋簷形狀，兩端燕尾上翹，屋簷下一根墨色小柱，柱底的墨點就是樹的座標。顏色＋屋簷內的記號表示樹況，給 Leaflet `L.divIcon` 使用。

## 尺寸與錨點

| 種類 | 外框（觸控範圍） | Leaflet `iconSize` | Leaflet `iconAnchor` |
| --- | --- | --- | --- |
| 一般樹 `dsh-marker` | `target-min` × `target-min`×1.25（48×60） | `[48, 60]` | `[24, 55]` |
| 神獸 `dsh-marker dsh-marker--beast` | `target-min`×1.5 × `target-min`×1.875（72×90） | `[72, 90]` | `[36, 84]` |

- 屋簷寬約 `marker-size`（44px），整個外框至少 `target-min`，圖形再小也點得到。
- 錨點＝柱底墨點的圓心。若之後改了 `target-min`，錨點要跟著等比例換算。
- `L.divIcon` 的 `className` 一定要設成 `dsh-leaflet-icon`，蓋掉 Leaflet 預設的白底白框。

## 狀態

| class | 樹況 | 填色 | 屋簷內記號 |
| --- | --- | --- | --- |
| `dsh-marker--ok` | 正常 | `state-ok` | 無 |
| `dsh-marker--watch` | 需關注 | `state-watch` 亮黃 | 墨色「!」 |
| `dsh-marker--notice` | 公示中 | `state-notice` 橘 | 墨色 45° 斜紋 |
| `dsh-marker--keep` | 保留 | `state-keep` | 米白菱形 |
| `dsh-marker--move` | 移植 | `state-move` | 米白箭頭 |

保留和移植的顏色亮度接近正常，所以一定要有記號，不能只靠顏色。任何樹況都不用紅色。

## 部件

- `dsh-marker__shape`：整個 SVG（屋簷 `__roof`、外框線 `__line`、燕尾 `__ridge`、柱 `__stem`、墨點 `__dot`、斜紋 `__stripes`、記號 `__mark`／`__mark--solid`）。
- 神獸版另有 `__halo`（`honor` 金色光圈）、`__avatar-bg`＋SVG `<image>`＋`__avatar-ring`（神獸小圖，圓形裁切）、`__plaque`（屋簷下小金匾）。屋簷縮成一頂小屋帽蓋在神獸頭上。
- 神獸小圖：`assets/character/beasts/{神獸}/healthy-icon.webp`，96×96。
- `dsh-marker__count`：守護人數小標籤（前面一盞小燈），掛在標記右上。
- `dsh-marker__label`：狀態文字，只在選取時出現在標記下方，顏色用各狀態的 text／bg token。

## 選取中

外層加 `is-selected`：圖形以錨點為軸放大 1.15 倍（錨點不會移動）、腳下出現一圈樹綠地盤、下方顯示狀態文字。底部卡片打開時加上，關閉時拿掉；Leaflet 裡同時用 `marker.setZIndexOffset(1000)` 讓它浮到最上層。

## HTML 範例（一般樹・需關注）

```html
<span class="dsh-marker dsh-marker--watch" role="img" aria-label="需關注，5 位守護">
  <svg class="dsh-marker__shape" viewBox="0 0 48 60" aria-hidden="true">
    <path class="dsh-marker__stem" d="M24 36 V51"/>
    <circle class="dsh-marker__dot" cx="24" cy="55" r="3.5"/>
    <path class="dsh-marker__roof" d="M5 36 Q17.5 32 24 5 Q30.5 32 43 36 Z"/>
    <path class="dsh-marker__line" d="M5 36 Q17.5 32 24 5 Q30.5 32 43 36 Z"/>
    <path class="dsh-marker__ridge" d="M5 36 C2.5 36 1.5 32 1 28 M43 36 C45.5 36 46.5 32 47 28"/>
    <path class="dsh-marker__mark" d="M24 17 V25"/><circle class="dsh-marker__mark--solid" cx="24" cy="30" r="2"/>
  </svg>
  <span class="dsh-marker__count" aria-hidden="true">5</span>
  <span class="dsh-marker__label">需關注</span>
</span>
```

## 範本函式（原生 JavaScript，直接塞進 `L.divIcon`）

```js
var DSH_MARKER = {
  size: { tree: [48, 60], beast: [72, 90] },
  anchor: { tree: [24, 55], beast: [36, 84] },
  labels: { ok: '正常', watch: '需關注', notice: '公示中', keep: '保留', move: '移植' }
};

function dshEscape(s) {
  return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
}

function dshMarkerHtml(o) {
  var status = o.status || 'ok';
  var beast = !!o.beastIcon;
  var label = DSH_MARKER.labels[status];
  var svg;
  if (!beast) {
    var ROOF = 'M5 36 Q17.5 32 24 5 Q30.5 32 43 36 Z';
    var marks = {
      watch: '<path class="dsh-marker__mark" d="M24 17 V25"/><circle class="dsh-marker__mark--solid" cx="24" cy="30" r="2"/>',
      keep: '<path class="dsh-marker__mark--solid" d="M24 20 L28 25.5 L24 31 L20 25.5 Z"/>',
      move: '<path class="dsh-marker__mark" d="M18.5 26 H29 M25 22 L29 26 L25 30"/>'
    };
    var stripes = status === 'notice'
      ? '<defs><clipPath id="dsh-roof-clip"><path d="' + ROOF + '"/></clipPath></defs><g class="dsh-marker__stripes" clip-path="url(#dsh-roof-clip)"><path d="M0 24 L18 6 M4 36 L28 12 M12 40 L36 16 M22 40 L44 18 M32 40 L50 22"/></g>'
      : '';
    svg = '<svg class="dsh-marker__shape" viewBox="0 0 48 60" aria-hidden="true">' +
      '<path class="dsh-marker__stem" d="M24 36 V51"/><circle class="dsh-marker__dot" cx="24" cy="55" r="3.5"/>' +
      '<path class="dsh-marker__roof" d="' + ROOF + '"/>' + stripes +
      '<path class="dsh-marker__line" d="' + ROOF + '"/>' +
      '<path class="dsh-marker__ridge" d="M5 36 C2.5 36 1.5 32 1 28 M43 36 C45.5 36 46.5 32 47 28"/>' +
      (marks[status] || '') + '</svg>';
  } else {
    var CAP = 'M10 26 Q26 22 36 4 Q46 22 62 26 Z';
    var bmarks = {
      watch: '<path class="dsh-marker__mark" d="M36 10.5 V17"/><circle class="dsh-marker__mark--solid" cx="36" cy="21" r="1.8"/>',
      keep: '<path class="dsh-marker__mark--solid" d="M36 12 L39 16.5 L36 21 L33 16.5 Z"/>',
      move: '<path class="dsh-marker__mark" d="M31 17 H40 M37 14 L40 17 L37 20"/>'
    };
    var bstripes = status === 'notice'
      ? '<clipPath id="dsh-cap-clip"><path d="' + CAP + '"/></clipPath>'
      : '';
    svg = '<svg class="dsh-marker__shape" viewBox="0 0 72 90" aria-hidden="true">' +
      '<defs><clipPath id="dsh-beast-avatar"><circle cx="36" cy="46" r="21"/></clipPath>' + bstripes + '</defs>' +
      '<path class="dsh-marker__stem" d="M36 75 V80"/><circle class="dsh-marker__dot" cx="36" cy="84" r="4"/>' +
      '<circle class="dsh-marker__halo" cx="36" cy="46" r="29"/>' +
      '<circle class="dsh-marker__avatar-bg" cx="36" cy="46" r="21"/>' +
      '<image href="' + dshEscape(o.beastIcon) + '" x="15" y="25" width="42" height="42" clip-path="url(#dsh-beast-avatar)"/>' +
      '<circle class="dsh-marker__avatar-ring" cx="36" cy="46" r="21"/>' +
      '<path class="dsh-marker__roof" d="' + CAP + '"/>' +
      (status === 'notice' ? '<g class="dsh-marker__stripes" clip-path="url(#dsh-cap-clip)"><path d="M8 26 L28 6 M18 28 L38 8 M28 28 L46 10 M38 28 L56 10 M48 28 L62 14"/></g>' : '') +
      '<path class="dsh-marker__line" d="' + CAP + '"/>' +
      '<path class="dsh-marker__ridge" d="M10 26 C6.5 26 5 21 4.5 17 M62 26 C65.5 26 67 21 67.5 17"/>' +
      '<rect class="dsh-marker__plaque" x="28" y="27" width="16" height="7" rx="1"/>' +
      (bmarks[status] || '') + '</svg>';
  }
  var name = o.name ? dshEscape(o.name) + '，' : '';
  var count = o.count != null ? '<span class="dsh-marker__count" aria-hidden="true">' + dshEscape(o.count) + '</span>' : '';
  return '<span class="dsh-marker dsh-marker--' + status + (beast ? ' dsh-marker--beast' : '') + (o.selected ? ' is-selected' : '') + '"' +
    ' role="img" aria-label="' + name + label + (o.count != null ? '，' + dshEscape(o.count) + ' 位守護' : '') + '">' +
    svg + count + '<span class="dsh-marker__label">' + label + '</span></span>';
}

function dshMarkerIcon(o) {
  var kind = o.beastIcon ? 'beast' : 'tree';
  return L.divIcon({ className: 'dsh-leaflet-icon', html: dshMarkerHtml(o), iconSize: DSH_MARKER.size[kind], iconAnchor: DSH_MARKER.anchor[kind] });
}

// 使用
L.marker([25.06, 121.51], { icon: dshMarkerIcon({ status: 'watch', count: 5 }) }).addTo(map);
L.marker([25.07, 121.52], { icon: dshMarkerIcon({
  status: 'ok', name: '鬚鬚公', count: 128,
  beastIcon: 'assets/character/beasts/xuxugong/healthy-icon.webp'
}) }).addTo(map);
// 選取：marker.setIcon(dshMarkerIcon({ ...opts, selected: true })); marker.setZIndexOffset(1000);
```

`o` 的欄位：`status`（ok／watch／notice／keep／move）、`count`（守護人數，可省略）、`name`（神獸名，給讀屏用）、`beastIcon`（有值就是神獸版）、`selected`。

使用者提供：座標、狀態、守護人數、是否為神獸與神獸小圖、點擊行為（打開 TreeCard 並加 `is-selected`）。

不要：用水滴形地圖釘；用紅色（`action`）表示任何樹況；替神獸加星等、閃光或稀有度標記。
