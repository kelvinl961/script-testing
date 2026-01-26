# Separate Language Scripts Usage

## Two Separate Scripts Available

### English Version
```html
<script src="https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/pwa-install-banner.en.js"></script>
```
- **Always shows English text**
- No need to call `init()` - auto-initializes
- Simple and straightforward

### Bengali Version
```html
<script src="https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/pwa-install-banner.bn.js"></script>
```
- **Always shows Bengali text**
- No need to call `init()` - auto-initializes
- Simple and straightforward

## Usage Examples

### For English Site
```html
<!-- Just load the English script -->
<script src="https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/pwa-install-banner.en.js"></script>
<!-- That's it! Banner will show in English automatically -->
```

### For Bengali Site
```html
<!-- Just load the Bengali script -->
<script src="https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/pwa-install-banner.bn.js"></script>
<!-- That's it! Banner will show in Bengali automatically -->
```

### If Banner Was Dismissed
```html
<script src="https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/pwa-install-banner.bn.js"></script>
<script>
  // Clear dismissal if needed
  if (window.PWAInstallBanner) {
    window.PWAInstallBanner.clearDismissal();
    window.PWAInstallBanner.init({ forceShow: true });
  }
</script>
```

## Benefits of Separate Scripts

1. **Simpler** - No need to call `init({ lang: 'bn' })`
2. **Smaller** - Each script is optimized for one language
3. **Faster** - No language detection logic needed
4. **Clearer** - Filename tells you which language it uses
5. **No cache issues** - Different filenames = different cache keys

## Which Script to Use?

- **Use `.en.js`** for English sites
- **Use `.bn.js`** for Bengali sites
- **Use main script** if you need dynamic language switching

## Files Available

1. `pwa-install-banner.en.js` - English only
2. `pwa-install-banner.bn.js` - Bengali only
3. `pwa-install-banner.js` - Main script (auto-detects or use init())
