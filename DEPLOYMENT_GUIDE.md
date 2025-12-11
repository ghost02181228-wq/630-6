# Deployment Guide: Firebase & GitHub Pages

這個指南將協助您將此 React 應用程式連接到 Firebase 並部署到 GitHub Pages。

## 1. Firebase 設定 (Database & Backend)

由於目前的應用程式為了演示方便使用 `localStorage` (`FinanceContext.tsx`)，若要改用 Firebase，請執行以下步驟：

1.  登入 [Firebase Console](https://console.firebase.google.com/)。
2.  建立新專案。
3.  **啟用 Firestore Database**:
    *   在左側選單選擇 "Firestore Database"。
    *   點擊 "Create database"。
    *   選擇起始模式 (建議測試時選 Test mode，生產環境需設定 Rules)。
4.  **獲取 Config**:
    *   點擊專案總覽旁的齒輪圖示 -> Project settings。
    *   在 "Your apps" 區塊，點擊 Web icon (`</>`)。
    *   註冊應用程式名稱，複製 `firebaseConfig` 物件。

### 修改程式碼以連接 Firebase

您需要安裝 firebase SDK:
```bash
npm install firebase
```

建立 `src/services/firebase.ts` 並初始化：
```typescript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // 貼上您的 Config
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "...",
  projectId: "...",
  // ...
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

然後修改 `FinanceContext.tsx`，將 `localStorage` 的讀寫操作替換為 Firestore 的 `getDocs`, `addDoc`, `deleteDoc` 等函數。

---

## 2. GitHub Pages 部署流程

### 前置準備
1.  在 GitHub 上建立一個新的 Repository。
2.  將此專案推送到該 Repository。

### 修改 `package.json`
在 `package.json` 中添加 `homepage` 欄位：

```json
{
  "name": "wealthflow-ai",
  "version": "0.1.0",
  "homepage": "https://<您的GitHub帳號>.github.io/<Repo名稱>",
  ...
}
```

### 安裝 `gh-pages` 套件
```bash
npm install --save-dev gh-pages
```

### 設定 Scripts
在 `package.json` 的 `scripts` 區塊加入：

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build",
  ...
}
```

### 執行部署
在終端機執行：
```bash
npm run deploy
```

這將會編譯您的 React 應用程式並將 `build` 資料夾的內容推送到 GitHub 的 `gh-pages` 分支，幾分鐘後即可在設定的網址看到您的網站。

## 3. 環境變數 (API Keys)

為了安全性，不要將 Gemini API Key 或 Firebase Config 直接寫死在程式碼中上傳到 GitHub。

1.  在專案根目錄建立 `.env` 檔案。
2.  加入：`REACT_APP_GEMINI_API_KEY=your_key_here`。
3.  確保 `.gitignore` 包含 `.env`。
4.  若使用 GitHub Actions 自動部署，請在 GitHub Repo Settings -> Secrets and variables -> Actions 中設定這些變數。
