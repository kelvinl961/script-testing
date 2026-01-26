# PWA Install Banner - Language Switching Guide

## How to Display Bengali (bn) or English (en) Version

### Method 1: Using init() with lang parameter (RECOMMENDED)

```html
<!-- Load the script -->
<script src="https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/pwa-install-banner.2.1.2.js"></script>

<!-- Force Bengali -->
<script>
  window.PWAInstallBanner.init({
    lang: 'bn'
  });
</script>

<!-- OR Force English -->
<script>
  window.PWAInstallBanner.init({
    lang: 'en'
  });
</script>
```

### Method 2: Auto-detect from HTML lang attribute

```html
<!-- Set language in HTML -->
<html lang="bn">
  <!-- Banner will automatically detect and show Bengali -->
</html>

<!-- OR -->
<html lang="en">
  <!-- Banner will automatically detect and show English -->
</html>
```

### Method 3: Auto-detect from URL parameter

```html
<!-- URL with lang parameter -->
https://mcb777.com/?lang=bn  <!-- Shows Bengali -->
https://mcb777.com/?lang=en  <!-- Shows English -->
```

### Method 4: Auto-detect from localStorage

```javascript
// Set marketing campaign in localStorage
localStorage.setItem('marketing_campaign', 'BD_BN'); // Shows Bengali
localStorage.removeItem('marketing_campaign'); // Shows English (default)
```

### Method 5: Change language dynamically after init

```html
<script src="https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/pwa-install-banner.2.1.2.js"></script>
<script>
  // Initialize (auto-detects language)
  window.PWAInstallBanner.init();
  
  // Later, change to Bengali
  window.PWAInstallBanner.setLang('bn');
  
  // Or change to English
  window.PWAInstallBanner.setLang('en');
  
  // Check current language
  console.log(window.PWAInstallBanner.getLang()); // 'en' or 'bn'
</script>
```

## Language Detection Priority

The script detects language in this order:

1. **init({ lang: 'bn' })** - Explicitly set via init()
2. **document.documentElement.lang** - HTML lang attribute
3. **URL parameter** - `?lang=bn`
4. **localStorage** - `marketing_campaign` with 'BD_BN'
5. **Default** - English ('en')

## Complete Example

```html
<!DOCTYPE html>
<html lang="bn"> <!-- This will auto-detect Bengali -->
<head>
  <meta charset="UTF-8">
  <title>MachiBet</title>
</head>
<body>
  <!-- Load PWA Install Banner -->
  <script src="https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/pwa-install-banner.2.1.2.js"></script>
  
  <!-- Option 1: Let it auto-detect from HTML lang attribute -->
  <!-- Banner will show Bengali automatically -->
  
  <!-- Option 2: Force a specific language -->
  <script>
    window.PWAInstallBanner.init({
      lang: 'bn' // Force Bengali, or 'en' for English
    });
  </script>
</body>
</html>
```

## Bengali Translations

Current Bengali translations:
- **appName**: MachiBet
- **title**: অফিসিয়াল অ্যাপ
- **description**: স্পোর্টস অ্যাপ, এন্টারটেইনমেন্ট অ্যাপ<br>খেলুন এনি টাইম এনি প্লেস
- **installText**: ইনস্টল
- **closeText**: ×
- **iosInstructions**: শেয়ার বোতামে ট্যাপ করুন এবং "হোম স্ক্রিনে যোগ করুন" নির্বাচন করুন

## Testing

To test language switching:

```javascript
// Check current language
console.log(window.PWAInstallBanner.getLang());

// Switch to Bengali
window.PWAInstallBanner.setLang('bn');
// Banner will recreate with Bengali text

// Switch to English
window.PWAInstallBanner.setLang('en');
// Banner will recreate with English text
```
