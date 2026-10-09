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

`_projects/_draft/2001-01-01-test.md` 引用的 CDN key `assets/images/projects/%E9%9B%AA%E3%81%AE%E5%A6%96%E7%B2%BE/21N_001.jpg` 不在本批原有 98 個物件內。沒有猜測對應素材或擴大上傳範圍，此草稿引用未修改。後續「作品圖片遷移」已確認本機來源並上傳至 `works/winter-fairy/image-01.jpg`，此草稿引用現已修正。

## 2026-10-09：文章專屬素材遷移

對照與驗證見 [2026-10-09-posts.json](2026-10-09-posts.json)。本批專指文章圖片與下載包，不包含全站共用的腳本、樣式、作者頭像或首頁執行中的 Live2D 模型。

- 13 個素材，共 57,566,805 bytes（約 54.9 MiB）：台北捷運站牌圖片 5 張與 ZIP 1 個、武器收藏圖片 4 張、みつる圖片 2 張與 ZIP 1 個。
- 目標使用 `articles/taipei-mrt-signboard/`、`articles/weapon-collection/`、`articles/mitsuru/` 與 `downloads/`。未引用的 `110_001.jpeg` 一併保存至 `articles/weapon-collection/image-001.jpeg`，沒有自行新增文章圖片。
- ZIP 只重新命名公開 object key，包內檔案與模型引用完整保留，SHA-256 不變。`mituru-44` 保留來源檔名識別碼，不推定新的模型版本。
- 先 dry-run，再上傳，使用 immutable 避免覆寫既有 key。R2 完整下載比對 13 個檔案全部匹配，CDN GET 的 SHA-256 與 Content-Type 全數吻合。
- Cache-Control 為 `public, max-age=14400`；ZIP 使用 `application/zip` 與 attachment Content-Disposition，瀏覽器下載檔名遵守命名規則。
- 更新三篇文章的 12 處 URL，作品標題、內文、外部下載網址、頁面 permalink 與換行未改動；沒有素材被其他來源文件引用。
- 無頭 Chrome 以本機正式建置 HTML 模擬官網來源、實際存取 CDN，驗證五篇文章圖片與 OG 封面，包含延遲載入的 data-src；兩個下載按鈕取得完整 ZIP，雜湊與原檔匹配。三篇變更文章另檢查手機寬度可載入文章內容；沒有宣稱完整視覺版面驗收。
- 依使用者本次要求，驗證完成後已刪除專案中 13 個本機來源及空目錄，釋出約 54.9 MiB 的來源檔案；Jekyll 重建後 `_site` 也不再保留這批舊副本。刪除清單只涵蓋本批已驗證素材。
- `_posts` 不再直接引用本機 `/assets/` URL；全站建置內容沒有本批舊素材連結，內部記錄已排除於公開輸出。
- 本批完成後 R2 有 106 個物件。網站修改仍待本次授權提交、推送與部署；正式網站在新部署前仍由先前的 GitHub Pages 版本供應舊連結與素材。

## 2026-10-09：賀卡與首頁素材遷移

對照與驗證見 [2026-10-09-home-cards.json](2026-10-09-home-cards.json)。

- 指定兩個資料夾共 14 張圖片、14,244,879 bytes（約 13.6 MiB）：賀卡 7 張、首頁素材 7 張。賀卡及舊背景雖無站內引用，仍完整保存在 R2。
- 賀卡放 `works/<stable-slug>/greeting-card.jpg`；共用列印圖放 `works/greeting-cards/print-layout.png`；首頁素材依用途放 `site/brand/`、`site/author/`、`site/home/`。
- 更新 `_data/settings.yml`、`_includes/head.html` 與 `index.html` 的 7 處 URL。標誌明暗配對保持原設定；首頁 JPG 與既有 PNG 預設社群圖是不同素材，分別保留。
- `_includes/header.html` 的兩個標誌使用 `relative_url`，避免將 baseurl 直接拼接到完整 CDN URL。
- 先 dry-run 再上傳，immutable 防止覆寫既有 key。R2 完整下載比對 14 個檔案全數匹配、0 差異；CDN GET 的 SHA-256、Content-Type 與快取標頭皆已核對，瀏覽器也能解碼全部 14 張圖片。
- 無頭 Chrome 以本機正式建置 HTML 模擬官網來源並實際讀取 CDN：首頁桌面／手機、深色／淺色共四種組合通過，標誌、頭像、背景與社群圖 URL 正確；一般文章的共用作者頭像亦使用新網址。桌面深色與手機淺色截圖已檢視。
- Apple touch icon 已驗證標籤 URL 與圖片解碼；未進行實體 iOS 主畫面圖示測試。
- 依先前的遷移清理要求，驗證後已移除專案中 14 個本機來源與空目錄，Jekyll 重建也移除舊輸出副本。約 13.6 MiB 的來源圖片由 R2 提供。
- 本批後 R2 有 120 個物件。本批未變更文章名稱、公開路由或部署架構；已隨提交 `88a93e2` 推送 main 並[部署成功](https://github.com/miguotw/MiGuo-Website/actions/runs/37817404857)。

## 2026-10-09：作品圖片遷移

對照與驗證見 [2026-10-09-projects.json](2026-10-09-projects.json)。

- `assets/images/projects` 共 14 件作品、61 張圖片、57,775,893 bytes（約 55.1 MiB）。目標為 `works/<stable-slug>/cover.jpg`、`image-01.jpg` 等路徑，保留原副檔名；兩張未引用圖片亦完整保存在 R2。
- 更新 15 份 `_projects` 文件（含一份草稿）的 63 處 URL。逐檔與 Git 版本比對，除圖片網址外，作品標題、內文、圖片順序、公開路由與換行均未改動。
- 草稿原有失效的雪の妖精 CDN URL 已依確認的本機來源改為 `works/winter-fairy/image-01.jpg`，封面亦同步切換。
- 先 dry-run 再上傳，以 immutable 避免覆寫既有物件。R2 完整下載比對 61 張圖片全數匹配、0 差異；CDN GET 的 SHA-256、Content-Type 與物件中繼資料已核對。
- 無頭 Chrome 以本機正式建置 HTML 模擬官網來源並實際存取 CDN，14 個作品頁、作品列表與首頁均可載入圖片及 OG 封面；另檢查雪の妖精、水色の夢與作品列表的手機寬度。包含延遲載入圖片的解碼驗證，沒有宣稱完整視覺版面驗收或本機來源防盜連例外已設定。
- 驗證後精確移除 61 張本機來源與空目錄，釋出約 55.1 MiB。清理後 Jekyll 重建成功，兩份建置輸出均無舊素材副本或舊路徑引用，維護記錄未公開輸出。
- 本批後 R2 有 181 個物件。本批與賀卡／首頁批次已一併提交 `88a93e2`、推送 main 並[部署成功](https://github.com/miguotw/MiGuo-Website/actions/runs/37817404857)。正式網站 14 個作品頁、作品列表及首頁已實際讀取 CDN 圖片與社群封面成功，沒有本批舊作品圖片路徑；另檢查三個頁面的手機寬度。

## 2026-10-09：AOD 素材資料夾重新整理

目前路徑對照見 [2026-10-09-aod-reorganization.json](2026-10-09-aod-reorganization.json)。早期清單保留當次歷史路徑；本批清單記錄其後續變動。

- 依使用者指定搬移 13 個物件，不新增子資料夾：三張角色圖合併至 `works/zzz-aod-01/`，`zzz-collection` 四張圖片及六個指定委託素材合併至 `works/zzz-aod-02/`。
- 三張角色圖使用 `aria-image-01.jpg`、`chinatsu-image-01.jpg`、`nanguhane-image-01.jpg`；集合圖片保留 `image-01.jpg` 至 `image-04.jpg`，撞名的三張委託 JPG 加 `commissions-` 前綴。其餘 PNG／GIF 保留原檔名。
- `works/zzz-commissions/image-05.jpg` 未在搬移範圍內，保留原位。
- 搜尋全部 Git 追蹤網站來源，沒有這 13 個舊路徑引用，因此無須修改頁面 URL；歷史維護清單中的舊路徑不屬於網站引用。
- 先 dry-run 再 copyto，保留中繼資料且使用 immutable。13 個來源、新 S3 物件及 CDN GET 的 SHA-256 全數匹配；內容標頭已比對。刪除前重新確認來源內容未變，再精確刪除 13 個舊 key，沒有清空任何前綴。
- 本批未提交或推送，沒有更動模型、Live2D、頁面路由或部署設定。

## 2026-10-09：使用者指定的後續資料夾整理

路徑、撞名處理與驗證見 [2026-10-09-folder-reorganization-02.json](2026-10-09-folder-reorganization-02.json)。

- 使用者已自行將 `works/zzz-aod-02/` 移至 `articles/zzz-aod-02/`，10 個物件的 S3／CDN SHA-256 均與上批紀錄相符；AOD 清單已更新目前目標並保留 previous_target_key，網站未引用這批路徑。
- 16 個物件依指示複製到 `articles/shapes-of-days/`（6 個）、`works/tokoyami-towa/`（1 個）、`works/new-year-2024/`（3 個）、`works/christmas-2025/`（1 個）、`works/halloween-2025/`（5 個），不新增子資料夾。
- 撞名檔案改為 `minecraft-collection-image-01.jpg`、`nc-collection-image-01.jpg`、`fan-art-image-01.jpg`；其他檔案保留原名。既有目標素材未覆寫。
- 16 個新物件的來源／S3／CDN SHA-256 全數匹配，內容中繼資料保留。兩份作品文件更新 8 處 URL，逐檔證明除 URL 外內容與換行不變，作品標題及公開路由保留。
- Jekyll 建置、兩個作品頁、作品列表、首頁圖片與 OG 封面載入通過；另檢查作品頁與列表手機寬度。瀏覽器使用本機正式 HTML 模擬官網來源，實際讀取 CDN，不表示已部署。
- 8 個未被網站引用的來源已精確清理。`works/new-year-vol-2/` 與 `works/roar/` 共 8 個舊物件仍被已部署版本使用，先保留至本次更新部署成功後再清理；新的目的地已可使用。
- 本次尚未 commit、push 或部署；本批 R2 物件數為 189，其中包含 8 個待上線後清理的舊物件。
