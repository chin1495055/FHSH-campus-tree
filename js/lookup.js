// 用樹號找樹。負責人：Saori
// 地圖只收錄總部周邊的樹，民眾在家附近掃到的樹牌常常不在裡面。
// 這時先用樹號做一棵「樹種待查」的樹，樹木頁照樣打得開，也能守護、回報、分享。
import { categoryOf } from './categories.js';

// 樹號：兩個英文字母＋10 位數字，例如 JJ0530051019。市府網址和我們的 #/tree/樹號 網址都讀得到
export const TREE_ID = /\b[A-Z]{2}\d{10}\b/;

export const treeIdFrom = (text) => String(text).toUpperCase().match(TREE_ID)?.[0] ?? null;

// 樹號前兩碼是行政區（從臺北市行道樹及公園樹木分布圖整理，16 萬棵只有十幾棵例外）
const DISTRICT_BY_PREFIX = {
  BT: '北投區', DA: '大安區', DT: '大同區', JJ: '中正區', JS: '中山區', NG: '南港區',
  NH: '內湖區', SL: '士林區', SS: '松山區', SY: '信義區', WH: '萬華區', WS: '文山區',
};

/** 不在資料裡的樹號：只知道樹號和大概的行政區，其他欄位留空（畫面上顯示［待補］） */
export function placeholderTree(id) {
  const species = '樹種待查';
  return {
    id,
    species,
    lat: null,
    lng: null,
    district: '臺北市',
    location: DISTRICT_BY_PREFIX[id.slice(0, 2)] ?? '',
    dbh: null,
    height: null,
    surveyDate: null,
    managerEstimated: null,
    ageEstimated: null,
    beast: undefined,
    status: 'ok',
    category: categoryOf(species),
    guardians: { local: 0, remote: 0 },
    unlisted: true,
  };
}
