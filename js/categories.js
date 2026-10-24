// 地圖首頁的「樹種類別」篩選。
// 這是團隊自訂的分類，不是開放資料的欄位：依 data/trees.json 裡的 79 種樹，照外觀和用途分成 7 類。
// 資料裡沒列到的樹種（例如紅邊竹蕉）都算「其他」。
export const CATEGORIES = [
  { id: 'shade', emoji: '🌳', name: '常綠遮蔭樹', species: ['樟樹', '茄苳', '白千層', '黑板樹', '海檬果', '鐵冬青', '烏心石', '肯氏蒲桃', '大葉山欖', '大葉楠', '光蠟樹', '掌葉蘋婆', '錫蘭橄欖', '紅楠', '青剛櫟', '木麻黃', '馬拉巴栗'] },
  { id: 'flower', emoji: '🌸', name: '開花樹', species: ['紫薇', '刺桐', '梅', '洋玉蘭', '印度紫檀', '水黃皮', '阿勃勒', '臺灣欒樹', '流蘇', '苦楝', '櫻花', '美人樹', '大花紫薇', '串錢柳', '山櫻花', '緬梔花', '豔紫荊', '黃脈刺桐', '鳳凰木', '火焰木', '白玉蘭', '風鈴木', '木棉', '羊蹄甲', '黃玉蘭', '樹蘭', '毛風鈴木'] },
  { id: 'autumn', emoji: '🍁', name: '變色落葉樹', species: ['楓香', '小葉欖仁', '烏桕', '青楓', '榔榆', '欖仁樹', '櫸', '九芎'] },
  { id: 'banyan', emoji: '🌿', name: '榕樹家族', species: ['榕樹', '垂榕', '雀榕', '菩提樹', '稜果榕', '印度橡膠樹', '水同木'] },
  { id: 'palm', emoji: '🌴', name: '椰子類', species: ['大王椰子', '酒瓶椰子', '黃椰子', '蒲葵'] },
  { id: 'conifer', emoji: '🌲', name: '松柏類', species: ['蘭嶼羅漢松', '黑松', '龍柏', '小葉南洋杉', '肯氏南洋杉'] },
  { id: 'fruit', emoji: '🍊', name: '果樹', species: ['龍眼', '芒果', '柚子', '楊桃', '桑樹', '麵包樹', '檸檬', '蓮霧', '金桔', '羅庚果'] },
  { id: 'other', emoji: '', name: '其他', species: [] },
];

const BY_SPECIES = new Map(CATEGORIES.flatMap((c) => c.species.map((s) => [s, c])));
const OTHER = CATEGORIES.at(-1);

/** 樹種 → 類別物件，對不到的算「其他」 */
export const categoryOf = (species) => BY_SPECIES.get(species) ?? OTHER;
