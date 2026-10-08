# R2 素材維護紀錄

## 2026-10-09：既有素材重新命名

本批僅整理 `cloudflare-r2:miguo-website-cdn` 原有的 98 個物件；其他本機素材尚未全部遷移。

- 建立 93 個符合命名規則的新物件。5 組 SHA-256 相同的素材共用新 key；不同格式仍分開保留。
- 更新專案 8 份文件的 55 處 CDN URL，保留作品標題、文章內容、頁面 permalink 與原有換行。
- 建立新 key 後貯體原有 191 個物件。2026-10-09 部署驗證並取得使用者清理授權後，已精確刪除 98 個舊 key，剩餘 93 個新物件；舊貯體 `miguo-website` 的回復副本保留。
- 提交 `826e7ae` 已推送 `main` 並[部署成功](https://github.com/miguotw/MiGuo-Website/actions/runs/37808669615)，8 個正式頁面確認使用新 CDN URL。本清單已補上部署及清理結果。
- 完整對照見 [2026-10-09-renames.json](2026-10-09-renames.json)，包含來源／目標 key、CDN URL、檔案類型、大小、SHA-256、中繼資料、引用位置與驗證狀態。行號是本批更新時的紀錄。

## 路徑對照摘要

| 原分類 | 新分類 |
| --- | --- |
| `images/home/about.png` | `site/social/default-preview.png` |
| `images/event/水晶轉印貼黏貼4步驟/step_01.jpg` | `articles/crystal-transfer-guide/step-01.jpg` |
| `images/posts/米淉子日常/01.png` | `articles/miguoko-daily/image-01.png` |
| `images/posts/繪日和-日子的形狀/web_page_01.jpg` | `articles/shapes-of-days/page-01.jpg` |
| `images/portfolio/` 與其 `illustration/` 子目錄 | `works/<stable-slug>/<asset-name>` |
| `minecraft-model-viewer/models/netherite_sword.json` | `models/minecraft/netherite-sword/models/model.json` |
| `minecraft-model-viewer/textures/netherite_sword.png` | `models/minecraft/netherite-sword/textures/texture.png` |
| `minecraft-model-viewer/textures/7c653b1c4bfacc1e.png` | `models/minecraft/skins/7c653b1c4bfacc1e.png` |

舊作品集素材即使沒有專案引用也保留並命名，沒有重新加入已撤下的頁面。無法從既有資料確認個別作品名稱的素材使用原識別碼或集合名稱。

## 模型相容性

4 個 Minecraft JSON 的 `textures` 值由 `item/...` 改為 `texture`；材質索引、幾何、UV 與其他模型內容保持不變。

現有預覽器從模型 URL 的最後一層 `/models/` 推導同層 `/textures/`，並替材質值加上 `.png`。每個模型因此使用 `models/model.json` 與 `textures/texture.png` 配對。

`_pages/test.md` 仍透過預覽器設定載入儲存庫內的模型與材質，本機素材路徑未變動。R2 新模型完成改名，待 CORS 設定並驗證後才能另行切換預覽器來源。

## 驗證紀錄

- rclone 先 dry-run，再以 `copyto --metadata --immutable` 建立新 key；沒有刪除物件。
- `rclone check --one-way --download`：93 個新物件全部匹配，0 差異。模型以更新材質引用後的 JSON 比對。
- 新物件的 Content-Type 與來源快取／內容相關中繼資料已核對；非模型內容不變。
- 93 個新 CDN URL 全部 GET 成功，SHA-256 與 Content-Type 匹配。請求帶入官網 Referer 與 Origin。
- 新 key 只新增於目標貯體且可從 CDN 取得，確認目前 CDN 可供應新路徑；未使用管理 API 稽核 Cloudflare 帳戶設定。
- Jekyll 完整建置成功，輸出至隔離的暫存目錄，沒有重啟既有 4000 埠預覽服務。
- 無頭 Chrome 用本機建置 HTML 模擬官網頁面並實際連線 CDN：米淉子日常 17 張、繪日和 26 張、水晶轉印教學 5 張圖片全數載入成功。
- 無頭 Chrome 以現有預覽器載入已核對內容的同源測試素材：4 個模型與 1 個 Alex skin 全部觸發 `model-load`，沒有 `model-error`。模型沒有使用 texture override，驗證了 JSON 材質路徑解析。
- 專案與建置輸出已檢查本批舊 URL 殘留；內部對照清單不視為網站引用。
- 差異檢查使用 `git -c core.whitespace=blank-at-eol,blank-at-eof,space-before-tab,cr-at-eol diff --check`，保留既有 CRLF 檔案。

## 部署與清理

1. 連結更新已部署並驗證。清理只使用對照清單中的 98 個完整來源 key，先 dry-run 核對選取集合，再執行刪除，沒有清空前綴或貯體。
2. 新 CDN GET 回應沒有 `Access-Control-Allow-Origin`。一般圖片已驗證，但跨來源 fetch／WebGL 材質載入尚不可據此宣稱可用。
3. `_config.yml` 已排除 `maintenance/`。現有 Jekyll serve 須重新啟動才能載入新的 exclude 設定，本次未干預該服務。
4. 清理後核對 98 個舊 key 全數不存在、93 個新物件中繼資料未變，並實際 GET 比對 48 個有專案引用的 CDN 素材，SHA-256 全部匹配。未主動清除 CDN 舊 URL 的快取，舊網址可能暫時仍回應快取內容。

## 既有問題

`_projects/_draft/2001-01-01-test.md` 引用的 CDN key `assets/images/projects/%E9%9B%AA%E3%81%AE%E5%A6%96%E7%B2%BE/21N_001.jpg` 不在本批原有 98 個物件內。沒有猜測對應素材或擴大上傳範圍，此草稿引用未修改。
