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
