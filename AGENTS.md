# AGENTS.md

## 專案用途

本專案是「米淉 MiGuo」的個人網站，展示插畫、Live2D、其他創作專案與委託資訊。以 Tarne 主題為基礎客製化，使用 Jekyll 產生靜態網站。

- 網站設定網址：`https://www.miguo.art`。
- 部分素材由 Cloudflare R2 的自訂網域 `https://cdn.miguo.art` 提供。
- 主要介面與溝通語言使用繁體中文；保留作品原有的中文、日文名稱與文案。
- README 主要是原始主題介紹；判斷實際功能時，以目前程式、資料與設定為準。

## 工作原則

- 開始修改前，確認 `git status --short`、目前分支及相關檔案；保留使用者未提交的變更。
- 優先沿用現有模板、資料結構、樣式與原生 JavaScript，避免為小功能引入新的框架或建置流程。
- 只修改本次需求涉及的內容，不順便重排整份 YAML、改寫文章或更新依賴。
- 修改前先閱讀目標檔案；若子目錄新增 `AGENTS.md`，也需遵循其適用範圍內的指引。
- 檔案使用 UTF-8，保留原有換行與縮排慣例。中文與含空白路徑必須正確引用。

## 主要目錄

| 路徑 | 用途 |
| --- | --- |
| `_config.yml` | 網址、collections、permalink、預設 layout、分頁與建置設定 |
| `_data/settings.yml` | 品牌資訊、導覽、社群連結、首頁區塊與全站功能設定 |
| `_data/services.yml` | 委託服務內容；委託頁會引用這份資料 |
| `_data/clients.yml`、`_data/faq.yml` | 客戶與常見問題資料 |
| `_pages/` | 一般頁面，例如委託、關於、文章列表與作品列表 |
| `_posts/` | 文章與其他創作專案 |
| `_projects/` | 插畫作品 collection |
| `_layouts/` | default、page、post、project 等頁面模板 |
| `_includes/` | 導覽、頁首、頁尾、作品卡片及首頁區塊 |
| `css/main.scss` | Sass 入口，含 Jekyll front matter 與 Liquid include_relative |
| `css/_0-settings/` 至 `css/_4-layouts/` | 變數、工具、基礎樣式、元件及版面樣式 |
| `js/scripts.js`、`js/common.js` | 前端腳本；修改前先確認各檔案的現有責任 |
| `assets/` | 圖片、OhMyLive2D、Minecraft 模型檢視器等靜態資源 |
| `index.html` | 首頁區塊組合與 OhMyLive2D 初始化 |
| `_includes/head.html` | SEO、canonical、Open Graph、Twitter Card 與樣式載入 |
| `search.json` | 搜尋索引模板，目前收錄 posts 與 projects |
| `.github/workflows/jekyll.yml` | GitHub Pages 建置與部署流程 |
| `_site/`、`.jekyll-cache/` | 建置輸出與快取，不是修改來源 |

## 開發環境與指令

使用 Ruby、Bundler 與 Jekyll。Gemfile 包含 `jekyll`、`jekyll-paginate`、`jekyll-sitemap`；目前本機 lockfile 為 Jekyll 4.4.1。CI 指定 Ruby 3.2，本機曾以 Ruby 3.4.4 建置成功；不要把本機版本當成 CI 版本。

目前開發環境是 WSL2 的 Ubuntu-22.04，專案 Linux 路徑為：

```text
/home/miguo/website_jekyll/MiGuo-Website
```

在 Linux shell 中執行：

```bash
cd /home/miguo/website_jekyll/MiGuo-Website
bundle install                       # 初次設定或依賴變更時使用
bundle exec jekyll serve --host 127.0.0.1 --port 4000
bundle exec jekyll build
```

- 若已有預覽伺服器，先確認程序與連接埠，不要直接另開或終止使用者的服務。
- `_config.yml` 變更後需要重新啟動預覽伺服器。
- 從 Windows 操作時，可透過 `wsl.exe -d Ubuntu-22.04 -- bash -lc '...'` 執行 Linux 建置指令；不要混用 Windows Ruby 與 WSL 安裝的 gems。
- 本機 Ruby 由 RVM 提供時，登入 shell 可載入其環境。若找不到 bundle，先檢查現有環境，不要直接重裝。
- `.gitignore` 目前忽略 `Gemfile.lock`，該檔未追蹤；不要順手加入版本控制。

## 內容與版型修改

- 新增內容時參考同 collection 的相近頁面，保留 front matter。常見欄位包括 `title`、`description`、`date`、`image`、`featured`、`toc`、`adult`、`show_home_cover_image` 與 `show_page_image`，依實際需求使用。
- 日期沿用台灣時區 `+0800`；不要僅依檔名推定文章發布日期。
- 現有路由：pages 為 `/:name`、posts 為 `/posts/:slug`、projects 為 `/project/:slug`；頁面可用 `permalink` 覆寫。修改路由時同步檢查站內引用。
- 導覽入口主要在 `_data/settings.yml`，不要只刪除頁面卻留下連結。
- `/portfolio/design` 與 `/portfolio/illustration` 是已撤下的求職作品集頁面；除非使用者要求，不要重新加入頁面或導覽入口。
- 共用區塊修改需考慮所有引用它的 layout；維持手機版、深淺色模式、搜尋、書籤及既有內容提示的行為。
- 修改 Sass 時保留 `css/main.scss` 的 front matter 與 Liquid 載入方式，不直接修改 `_site/css/main.css`。
- 圖片與 Live2D、模型檢視器等資產可能由多個頁面共用，刪除前先搜尋引用。

## R2 素材管理與遷移

### 連線與已驗證狀態

- 網站靜態素材將分批遷移至 `miguo-website-cdn`；CDN 網址使用 `https://cdn.miguo.art`。
- WSL 的 rclone remote 名稱為 `cloudflare-r2`，provider 為 `Cloudflare`（大小寫需正確），region 使用 `auto`，`no_check_bucket = true`。
- 使用既有本機 rclone 設定。不要在輸出、聊天、Git、文件或腳本中列出 Access Key ID、Secret Access Key、API token 或完整憑證設定檔。
- rclone 使用 R2 的存取金鑰識別碼與秘密存取金鑰；S3 API Endpoint 與公開 CDN 網址不同。憑證權限應限於操作所需的指定貯體。
- 2026-10-08 已以 `rclone copy --metadata` 將舊貯體 `miguo-website` 複製至 `miguo-website-cdn`，並以 `rclone check --download` 完整比對：98 個檔案、122,491,302 bytes、0 差異。這是當次遷移紀錄，不是永遠固定的檔案數量。
- 舊貯體 `miguo-website` 保留。2026-10-09 已確認只新增於 `miguo-website-cdn` 的 93 個新路徑可由 `cdn.miguo.art` 讀取，回應內容 SHA-256 全數吻合；驗證請求使用官網 Referer。這是 CDN 實際供檔證據，不代表已完整稽核 Cloudflare 帳戶設定。
- 2026-10-09 已將上述 98 個舊 key 對應到 93 個新 key（5 組相同內容共用新 key），並更新專案 55 處 CDN 引用。提交 `826e7ae` 已推送並部署成功，8 個正式頁面已確認使用新連結。2026-10-09 依使用者授權刪除目標貯體內 98 個舊 key，清理後剩 93 個新物件；舊貯體 `miguo-website` 的 98 個物件仍保留作為回復副本。對照、雜湊、引用位置與驗證狀態見 `maintenance/r2/2026-10-09-renames.json`，流程與限制見 `maintenance/r2/README.md`。
- 新路徑 GET 回應尚未提供 `Access-Control-Allow-Origin`，不能宣稱 Minecraft／Live2D 跨來源載入可用。現有 Minecraft 預覽器仍使用本機素材；其他本機靜態資源也尚未全部遷移。

- 2026-10-09 已完成 `_posts` 的專屬圖片與下載包遷移：13 個素材（11 張圖片、2 個 ZIP）、57,566,805 bytes，上傳至 `articles/` 與 `downloads/`，更新三篇文章的 12 處連結，完整 R2／CDN 及五篇文章瀏覽器驗證後移除本機來源與舊建置副本。含一張未引用的武器截圖；ZIP 內容未改動。記錄見 `maintenance/r2/2026-10-09-posts.json`。本批完成後 R2 有 106 個物件；這是當次紀錄，不代表永久數量。提交與部署狀態另依本次 Git／Actions 證據判斷。

- 2026-10-09 已完成 `assets/images/greeting_card` 與 `assets/images/home` 遷移：14 張圖片、14,244,879 bytes；賀卡放 `works/`，品牌／頭像／首頁素材放 `site/`，更新 7 處 URL，標誌模板使用 `relative_url` 支援完整 CDN URL。R2／CDN 內容比對與首頁桌面、手機、深淺色模式驗證後，已移除本機來源與舊建置副本。無引用的賀卡與舊背景亦保留於 R2。記錄見 `maintenance/r2/2026-10-09-home-cards.json`；本批完成後 R2 為 120 個物件，提交與部署另依當次證據判斷。

- 2026-10-09 已完成 `assets/images/projects` 遷移：14 件作品的 61 張圖片、57,775,893 bytes，使用 `works/<stable-slug>/cover` 與 `image-01` 等角色檔名；更新 15 份作品文件（含草稿）的 63 處 URL。R2／CDN 內容比對、14 個作品頁、作品列表與首頁的瀏覽器檢查通過，清理後建置成功，已移除本機來源與舊建置副本。兩張未引用圖片亦保留於 R2，作品名稱、內文與路由不變。記錄見 `maintenance/r2/2026-10-09-projects.json`；本批後 R2 有 181 個物件，提交與部署另依當次證據判斷。

- 賀卡／首頁與作品圖片兩批共 75 個素材已隨提交 `88a93e2` 推送 main；GitHub Pages run `37817404857` 部署成功。正式網站 14 個作品頁、作品列表及首頁的 CDN 圖片檢查通過，兩份批次清單已補上實際部署證據。

- 2026-10-09 依使用者指定將 13 個 AOD 素材重新整理至 `works/zzz-aod-01/` 與 `works/zzz-aod-02/`，後者已由使用者移至 `articles/zzz-aod-02/` 並完成 10 個物件的 S3／CDN 比對；兩目錄均為扁平結構；衝突檔名加入角色名稱或 `commissions-`。R2／CDN SHA-256 與中繼資料驗證後已精確清理舊 key。網站來源沒有引用這批舊路徑；`works/zzz-commissions/image-05.jpg` 保留。後續路徑對照見 `maintenance/r2/2026-10-09-aod-reorganization.json`，歷史清單保留當次路徑。

- 2026-10-09 後續依使用者分類重新整理 16 個素材：移至 shapes-of-days、tokoyami-towa、new-year-2024、christmas-2025 與 halloween-2025 的平面目錄，保留既有目的地物件，撞名加來源識別碼。更新兩份作品文件的 8 處 URL，建置與瀏覽器載入通過；8 個未引用來源已清理，new-year-vol-2 與 roar 共 8 個舊來源需等本次部署成功才清理。對照見 `maintenance/r2/2026-10-09-folder-reorganization-02.json`，提交與部署狀態依當次證據判斷。

- 後續資料夾整理已隨提交 `e6cb79f` 推送 main，GitHub Pages run `37894460786` 部署成功，正式網站兩個作品頁、列表與首頁已使用新連結。重新比對後已清理 new-year-vol-2 與 roar 共 8 個舊物件，本批所有 16 個來源均已清理，新物件保留；清理後 R2 為 181 個物件。兩批維護清單已補上提交、部署與清理證據。

### 新素材目錄規劃

以「用途 → 穩定的作品或文章識別碼 → 素材角色」組織，不必沿用舊目錄。下列是遷移時採用的規劃與範例，不代表 R2 已有這些物件：

```text
site/brand/logo-dark.png
site/home/hero-background.webp
site/social/default-preview.jpg
works/winter-fairy/cover.jpg
works/winter-fairy/image-01.jpg
articles/weapon-collection/cover.jpg
models/live2d/mitsuru/v1/mitsuru.model3.json
models/live2d/mitsuru/v1/mitsuru.physics3.json
models/live2d/mitsuru/v1/textures/texture-01.png
models/minecraft/netherite-sword/models/model.json
models/minecraft/netherite-sword/textures/texture.png
downloads/mitsuru/v1/model-package.zip
```

- Minecraft 每個模型保留 `models/model.json` 與 `textures/texture.png` 配對，JSON 的材質值使用 `texture`；這符合現有預覽器以最後一層 `/models/` 推導同層 `/textures/` 的規則。不要只攤平目錄而未同步調整解析器。
- `site` 放全站品牌、首頁與預設社群預覽素材；`works` 放作品素材；`articles` 放文章素材；`models` 放執行時載入的模型；`downloads` 放供訪客下載的套件。
- 作品或文章使用簡短、固定的英文識別碼；同一作品的封面、縮圖、內頁與預覽圖放在一起。
- 角色名稱可使用 `cover`、`thumbnail`、`social-preview`、`image-01`。只有確有多尺寸時才加入 `-640`、`-1280`；模型與下載包可使用 `v1`、`v2` 版本目錄。

### 必須遵守的命名規則

- R2 目錄名稱與檔案主名稱僅使用小寫英文 `a-z`、數字 `0-9` 與連字號 `-`；不使用中文、日文、空格或底線。
- `.` 僅用於副檔名，允許一般與複合副檔名，例如 `.jpg`、`.webp`、`.model3.json`、`.physics3.json`、`.motion3.json`、`.tar.gz`。
- `/` 是物件路徑的層級分隔符，不屬於單一名稱。避免以點號拼接主名稱或在目錄名稱中使用點號。
- 使用者允許為遷移適當重新命名舊素材；範圍是素材目錄與檔名，不因此改寫作品標題、文章內容或公開頁面 permalink。
- 對第三方格式，先確認規格要求。Live2D 的模型 JSON、材質、動作與物理設定，以及 Minecraft 模型引用需一併更新，保留副檔名及解析器所需結構，並實際測試載入。

### 每批遷移流程

1. 盤點本機／R2 來源檔案、所有引用與目標 object key，確認新名稱不碰撞。
2. 維護可追蹤的對照清單，至少記錄來源、目標貯體／object key、CDN URL、檔案類型、引用位置與驗證狀態；遷移工具與內部紀錄需排除於 Jekyll 公開輸出。
3. 先 dry-run，再複製或上傳。既有物件搬移使用 `--metadata`，並核對 Content-Type、Cache-Control 等中繼資料；CORS、自訂網域、生命週期屬於貯體設定，不會跟著複製。
4. 驗證物件內容與 CDN 讀取，再更新網站 Markdown、YAML、HTML、CSS、JavaScript 及模型內部引用；執行 Jekyll 建置與相關頁面測試。
5. 上線切換完成且確認無舊引用後，才將已確認可刪除的來源列入清理。不要在初次搬移時用 `sync`、`move` 或 `purge` 一併刪除來源／目標。
6. 切換貯體時保留來源以便回復；更換相同 URL 的內容要考慮 CDN 快取，不能只靠命中快取的成功回應證明新貯體可用。

唯讀列出目前遷移目標的頂層內容：

```bash
rclone lsf cloudflare-r2:miguo-website-cdn --max-depth 1
```

## CDN 與社群預覽

- 保留已有的 `cdn.miguo.art` 素材網址；不要為本機圖片載入失敗就大量搬回儲存庫或替換網域。
- CDN 有 Cloudflare 防盜連設定。本機預覽若出現 403，先區分來源網址錯誤、WAF 阻擋與 CORS 問題。
- 使用者選擇以公網 IP 例外開放開發存取，不採用 localhost 或 127.0.0.1 Referer 白名單；不要在文件或設定中重新引入後者。
- Cloudflare 規則不在此儲存庫內管理，不能用本機程式碼變更推定遠端防火牆已更新。
- 社群預覽需同時能取得頁面與 `og:image`；相關標籤位於 `_includes/head.html`。保留可對外存取的絕對圖片網址。

## 驗證

- 頁面、資料、模板或樣式變更後執行 `bundle exec jekyll build`，並檢查 `git diff --check`。
- 檢視最終 `git diff` 與 `git status --short`，確認沒有無關內容或產生檔案被納入。
- 視覺變更應檢查桌面與手機寬度，以及受影響的深淺色模式；無法預覽時清楚說明。
- 撤下頁面後，確認 `_site` 不再產生對應頁面，並檢查導覽、`sitemap.xml` 與適用的搜尋索引。
- 目前未見獨立自動化測試套件；不要宣稱 Jekyll 建置成功代表瀏覽器互動、CDN 存取或部署均已驗證。
- 純文字文件變更通常只需檢查差異；若連帶修改建置設定，仍需執行建置。

## Git 與部署

- 遠端：`origin` → `https://github.com/miguotw/MiGuo-Website.git`。
- 專案使用 `pre-release` 整理變更，`main` 供正式部署；開始工作時仍須確認目前分支，不假設一定在 pre-release。
- 提交、推送與合併依本次使用者授權執行；先前任務的部署授權不視為往後每次修改的永久授權。
- 推送前確認遠端差異，只提交本次相關檔案，不強制推送或覆寫使用者歷史。
- `.github/workflows/jekyll.yml` 在 push 到 `main` 或手動觸發時，建置並部署至 GitHub Pages。推送 pre-release 不會自動觸發此正式部署流程。
- 合併 main 前取得最新遠端狀態，處理差異並建置。除非使用者要求，不自行改動部署流程。
- 回報時區分「本機完成」、「已推送」與「已部署成功」；只有取得部署成功的證據，才宣稱網站已更新。
