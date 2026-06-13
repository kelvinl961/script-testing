# Cache Purge Instructions

## If Banner Still Shows White (Cached Version)

### Step 1: Purge CDN Cache

Visit these URLs to purge jsDelivr cache:

**Bengali Script:**
```
https://purge.jsdelivr.net/gh/kelvinl961/script-testing@main/pwa-install-banner.bn.js
```

**English Script:**
```
https://purge.jsdelivr.net/gh/kelvinl961/script-testing@main/pwa-install-banner.en.js
```

**Main Script:**
```
https://purge.jsdelivr.net/gh/kelvinl961/script-testing@main/pwa-install-banner.js
```

### Step 2: Use Versioned Filename (RECOMMENDED)

Use the latest versioned filename to bypass cache:

```html
<!-- Bengali - Latest version -->
<script src="https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/pwa-install-banner.bn.js"></script>

<!-- English - Latest version -->
<script src="https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/pwa-install-banner.en.js"></script>
```

### Step 3: Add Cache-Busting Query String

```html
<script src="https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/pwa-install-banner.bn.js?v=2.3.0"></script>
```

### Step 4: Clear Browser Cache

1. **Chrome/Edge:**
   - Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Select "Cached images and files"
   - Click "Clear data"

2. **Hard Refresh:**
   - `Ctrl+Shift+R` (Windows/Linux)
   - `Cmd+Shift+R` (Mac)

### Step 5: Verify

Open browser console and check:
```javascript
// Should see version 2.3.0 (or 2.3.0-en / 2.3.0-bn for language scripts)
console.log(window.PWAInstallBanner.version);
```

## Current Version: 2.3.0

- Native Android install via `beforeinstallprompt` ✅
- Dynamic manifest for embed sites (m.mcb777) ✅
- Service worker registration + blob fallback ✅
- In-app browser → Open in Chrome guide ✅
