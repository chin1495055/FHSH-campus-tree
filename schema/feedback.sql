-- 意見回饋（worker.js 寫入）。不存姓名、Email、IP。
-- 建表：npx wrangler d1 execute dsh-feedback --remote --file=schema/feedback.sql（本機測試改用 --local）
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,  -- UTC ISO 時間
  kind TEXT NOT NULL,        -- idea 建議／bug 問題／other 其他
  message TEXT NOT NULL,     -- 1–1000 字
  page TEXT,                 -- 從哪一頁點進回饋（hash 路由）
  ua TEXT                    -- 瀏覽器，方便重現問題
);
CREATE INDEX IF NOT EXISTS feedback_created_at ON feedback (created_at);
