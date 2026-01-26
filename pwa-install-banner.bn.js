
(function() {
    'use strict';

    // Script version - increment this when making changes to force cache refresh
    const SCRIPT_VERSION = '2.1.6';
    
    // Default configuration
    const DEFAULT_CONFIG = {
        bannerId: 'pwa-install-banner',
        logoUrl: 'https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/favicon-1.png',
        localStorageKey: 'pwa-banner-dismissed',
        checkDomain: false,
        allowedDomains: ['m.mcb777', 'm.mcb177'],
        showIOSInstructions: true,
        autoTriggerInstall: false,
        autoTriggerDelay: 2000,
        manifestUrl: 'https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/manifest.json',
        injectManifest: true,
    };

    // i18n translations
    const i18n = {
        en: {
            appName: 'MachiBet',
            title: 'Official App',
            description: 'Sports app, Entertainment app<br>Play anytime, anywhere',
            installText: 'Install',
            closeText: '×',
            iosInstructions: 'Tap the share button and select "Add to Home Screen"'
        },
        bn: {
            appName: 'MachiBet',
            title: 'অফিসিয়াল অ্যাপ',
            description: 'স্পোর্টস অ্যাপ, এন্টারটেইনমেন্ট অ্যাপ<br>খেলুন এনি টাইম এনি প্লেস',
            installText: 'ইনস্টল',
            closeText: '×',
            iosInstructions: 'শেয়ার বোতামে ট্যাপ করুন এবং "হোম স্ক্রিনে যোগ করুন" নির্বাচন করুন'
        }
    };

    // Current language - set based on script filename
    // This will be overridden in the separate .en.js and .bn.js files
    // For main script: null (auto-detect)
    // For .en.js: "en" (hardcoded)
    // For .bn.js: "bn" (hardcoded)
    let currentLang = null;
    let CONFIG = Object.assign({}, DEFAULT_CONFIG);
    let isInitialized = false;
    
    // Log script version for debugging
    console.log('PWA Install Banner Script v' + SCRIPT_VERSION + ' loaded');
    
    /**
     * Get current language
     * For separate scripts: returns hardcoded language
     * For main script: auto-detects
     */
    function getLang() {
        // If language was hardcoded (in .en.js or .bn.js), use it
        if (currentLang !== null) {
            return currentLang;
        }
        
        // If language was set via init(), use it
        if (currentLang) {
            return currentLang;
        }
        
        // Check document lang attribute
        const docLang = document.documentElement.lang;
        if (docLang && (docLang === 'bn' || docLang.startsWith('bn-'))) {
            return 'bn';
        }
        
        // Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('lang') === 'bn') {
            return 'bn';
        }
        
        // Check localStorage marketing campaign
        const marketingCampaign = localStorage.getItem('marketing_campaign');
        if (marketingCampaign && marketingCampaign.includes('BD_BN')) {
            return 'bn';
        }
        
        // Default to English
        return 'en';
    }
    
    /**
     * Get localized text
     */
    function getLocalizedText(key) {
        const lang = getLang();
        const translations = i18n[lang] || i18n.en;
        const text = translations[key];
        
        // If key doesn't exist in current language, try English fallback
        if (text === undefined || text === null) {
            const fallback = i18n.en[key];
            if (fallback !== undefined && fallback !== null) {
                return fallback;
            }
        }
        
        // Return text or empty string (never undefined)
        return text || '';
    }

    /**
     * Check if app is running in standalone mode (installed PWA)
     */
    function isStandalone() {
        // Standard way to detect standalone mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return true;
        }
        
        // iOS Safari detection
        if (window.navigator.standalone === true) {
            return true;
        }
        
        // Check for minimal-ui (some browsers)
        if (window.matchMedia('(display-mode: minimal-ui)').matches) {
            return true;
        }
        
        // Additional check: if window size matches typical standalone behavior
        // This is a fallback for older browsers
        if (window.matchMedia('(display-mode: fullscreen)').matches) {
            // Could be standalone, but less reliable
            return false; // Conservative approach
        }
        
        return false;
    }

    /**
     * Check if user is on iOS
     */
    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * Check if user is on Android
     */
    function isAndroid() {
        return /Android/.test(navigator.userAgent);
    }

    /**
     * Check if banner was previously dismissed
     */
    function isBannerDismissed() {
        try {
            return localStorage.getItem(CONFIG.localStorageKey) === 'true';
        } catch (e) {
            return false;
        }
    }

    /**
     * Mark banner as dismissed
     */
    function dismissBanner() {
        try {
            localStorage.setItem(CONFIG.localStorageKey, 'true');
        } catch (e) {
            // Ignore localStorage errors
        }
    }

    /**
     * Check if domain is allowed (if domain checking is enabled)
     */
    function isDomainAllowed() {
        if (!CONFIG.checkDomain) {
            return true;
        }
        
        const currentUrl = window.location.href;
        return CONFIG.allowedDomains.some(domain => currentUrl.includes(domain));
    }

    /**
     * Check if the third-party site has manifest.json linked
     */
    function hasManifest() {
        const manifestLink = document.querySelector('link[rel="manifest"]');
        return manifestLink !== null;
    }

    /**
     * Inject or update manifest for third-party site
     * This ensures the PWA has proper icon and name when installed
     */
    function injectManifest() {
        // Check if manifest already exists
        let manifestLink = document.querySelector('link[rel="manifest"]');
        
        if (!manifestLink) {
            // Create manifest link
            manifestLink = document.createElement('link');
            manifestLink.rel = 'manifest';
            document.head.appendChild(manifestLink);
            console.log('PWA Install Banner: Created manifest link element');
        } else {
            console.log('PWA Install Banner: Manifest link already exists:', manifestLink.href);
        }
        
        // Always use hosted manifest URL (more reliable than blob URLs)
        if (CONFIG.manifestUrl) {
            manifestLink.href = CONFIG.manifestUrl + '?v=' + Date.now(); // Cache bust
            console.log('PWA Install Banner: Set manifest URL to:', manifestLink.href);
        } else {
            // Fallback: Create dynamic manifest
            const manifestData = {
                name: getLocalizedText('appName'),
                short_name: getLocalizedText('appName'),
                description: getLocalizedText('description').replace(/<br>/g, ' '),
                start_url: window.location.origin + '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#ffffff',
                orientation: 'portrait-primary',
                icons: [
                    {
                        src: CONFIG.logoUrl,
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: CONFIG.logoUrl,
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    }
                ],
                categories: ['entertainment', 'sports', 'games']
            };
            
            const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: 'application/json' });
            const blobUrl = URL.createObjectURL(blob);
            manifestLink.href = blobUrl;
            console.log('PWA Install Banner: Created dynamic manifest with blob URL');
        }
        
        // Also add theme color meta tag (white to match banner)
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
        themeColorMeta.content = '#ffffff'; // White to match banner background
        console.log('PWA Install Banner: Set theme-color to white');
        
        // Verify icon is accessible
        const iconImg = new Image();
        iconImg.onload = function() {
            console.log('PWA Install Banner: Icon loaded successfully:', CONFIG.logoUrl);
            console.log('PWA Install Banner: Icon dimensions:', iconImg.width + 'x' + iconImg.height);
        };
        iconImg.onerror = function() {
            console.error('PWA Install Banner: Icon FAILED to load:', CONFIG.logoUrl);
            console.error('PWA Install Banner: Check if URL is accessible and CORS is enabled');
            console.error('PWA Install Banner: Browser will show default icon');
        };
        iconImg.src = CONFIG.logoUrl;
        
        // Force browser to re-read manifest
        setTimeout(() => {
            const currentManifest = document.querySelector('link[rel="manifest"]');
            if (currentManifest && currentManifest.href) {
                console.log('PWA Install Banner: Manifest link confirmed:', currentManifest.href);
                
                // Try to fetch manifest to verify it's accessible
                fetch(currentManifest.href)
                    .then(res => res.json())
                    .then(data => {
                        console.log('PWA Install Banner: Manifest loaded successfully:', data);
                        console.log('PWA Install Banner: Icons in manifest:', data.icons);
                    })
                    .catch(err => {
                        console.error('PWA Install Banner: Failed to load manifest:', err);
                    });
            }
        }, 100);
    }

    /**
     * Check if the third-party site has service worker registered
     */
    function hasServiceWorker() {
        return 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null;
    }

    /**
     * Check if the third-party site has PWA capabilities
     */
    function hasPWACapabilities() {
        return hasManifest() || hasServiceWorker();
    }


    /**
     * Create and inject the banner HTML
     */
    function createBanner() {
        // Don't create if already exists
        if (document.getElementById(CONFIG.bannerId)) {
            return;
        }

        const banner = document.createElement('div');
        banner.id = CONFIG.bannerId;
        banner.style.cssText = `
            display: flex;
            align-items: center;
            height: auto;
            min-height: 50px;
            padding: 10px 15px;
            overflow: hidden;
            position: sticky;
            top: 0;
            z-index: 9999;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        `;

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = getLocalizedText('closeText') || '×';
        closeBtn.style.cssText = `
            background: transparent;
            border: none;
            color: #333;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            flex-shrink: 0;
            transition: opacity 0.2s;
        `;
        closeBtn.addEventListener('click', () => {
            hideBanner();
            dismissBanner();
        });
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.opacity = '0.7';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.opacity = '1';
        });

        // Content container
        const content = document.createElement('div');
        content.style.cssText = `
            display: flex;
            flex: 1;
            align-items: center;
            gap: 12px;
        `;

        // Logo
        const logo = document.createElement('img');
        logo.src = CONFIG.logoUrl;
        logo.alt = getLocalizedText('appName') || 'MachiBet';
        logo.style.cssText = `
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 8px;
            flex-shrink: 0;
            width: 40px;
            height: 40px;
            object-fit: cover;
            background: white;
        `;

        // Text content
        const textContainer = document.createElement('div');
        textContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            min-width: 0;
        `;

        const title = document.createElement('h2');
        const appName = getLocalizedText('appName') || 'MachiBet';
        const titleText = getLocalizedText('title') || 'Official App';
        title.innerHTML = `${appName} | ${titleText}`;
        title.style.cssText = `
            font-size: 13px;
            font-weight: 600;
            margin: 0 0 4px 0;
            color: #333;
            line-height: 1.2;
        `;

        const description = document.createElement('p');
        const descText = getLocalizedText('description') || 'Sports app, Entertainment app<br>Play anytime, anywhere';
        description.innerHTML = descText;
        description.style.cssText = `
            font-size: 11px;
            font-weight: 400;
            margin: 0;
            color: #666;
            line-height: 1.3;
        `;

        textContainer.appendChild(title);
        textContainer.appendChild(description);

        content.appendChild(logo);
        content.appendChild(textContainer);

        // Install button
        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-button';
        const installText = getLocalizedText('installText') || 'Install';
        installBtn.innerHTML = installText;
        installBtn.style.cssText = `
            font-size: 13px;
            font-weight: 600;
            background: linear-gradient(135deg, #016ecf 0%, #022a6a 100%);
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            flex-shrink: 0;
            transition: transform 0.2s, box-shadow 0.2s;
            white-space: nowrap;
        `;
        installBtn.addEventListener('mouseenter', () => {
            installBtn.style.transform = 'scale(1.05)';
            installBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
        installBtn.addEventListener('mouseleave', () => {
            installBtn.style.transform = 'scale(1)';
            installBtn.style.boxShadow = 'none';
        });
        installBtn.addEventListener('click', handleInstallClick);

        banner.appendChild(closeBtn);
        banner.appendChild(content);
        banner.appendChild(installBtn);

        // Insert at the top of body
        if (document.body) {
            document.body.insertBefore(banner, document.body.firstChild);
        } else {
            // If body doesn't exist yet, wait for DOM
            document.addEventListener('DOMContentLoaded', () => {
                document.body.insertBefore(banner, document.body.firstChild);
            });
        }
    }

    /**
     * Hide the banner
     */
    function hideBanner() {
        const banner = document.getElementById(CONFIG.bannerId);
        if (banner) {
            banner.style.display = 'none';
        }
    }

    /**
     * Show the banner
     */
    function showBanner() {
        const banner = document.getElementById(CONFIG.bannerId);
        if (banner) {
            banner.style.display = 'flex';
        }
    }

    /**
     * Handle install button click
     */
    let deferredPrompt = null;

    function handleInstallClick() {
        if (deferredPrompt) {
            // Chrome/Edge Android/Desktop - Real install prompt
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    hideBanner();
                    dismissBanner();
                }
                deferredPrompt = null;
            });
        } else if (isIOS()) {
            // iOS Safari - Note: Auto-install is NOT possible on iOS due to Apple security restrictions
            // iOS requires manual user action: Share button → Add to Home Screen
            // We can only guide the user through the process
            if (CONFIG.showIOSInstructions) {
                // Try to detect if we can do anything programmatically (we can't, but check anyway)
                // On iOS, we can only show instructions - no programmatic install possible
                showIOSInstallGuide();
            }
        } else {
            // No prompt available - check if third-party site has PWA setup
            if (hasPWACapabilities()) {
                // Site has PWA setup but prompt not available yet (might appear later)
                // Show banner anyway - the beforeinstallprompt event might fire later
                console.log('PWA Install Banner: Site has PWA capabilities but prompt not available yet');
                showManualInstallInstructions(true); // Pass true to indicate site has PWA
            } else if (isTestMode()) {
                showTestInstallPrompt();
            } else {
                // Site doesn't have PWA setup - show instructions
                showManualInstallInstructions(false);
            }
        }
    }

    /**
     * Show test/demo install prompt (for testing purposes)
     */
    function showTestInstallPrompt() {
        // Try to trigger install if somehow we have the prompt
        if (deferredPrompt) {
            handleInstallClick();
            return;
        }
        
        // Create a visual modal instead of alert for better UX
        createInstallModal({
            title: 'Test Mode - Install Simulation',
            message: `In production (HTTPS with PWA manifest), clicking "Install Now" would automatically trigger the native browser install prompt.\n\n` +
                    `To enable real installation:\n` +
                    `• Deploy to HTTPS server\n` +
                    `• Configure manifest.json\n` +
                    `• Register service worker\n` +
                    `• Meet PWA installability criteria`,
            buttonText: 'Simulate Install',
            onConfirm: () => {
                console.log('Test: User accepted install (simulated)');
                hideBanner();
                dismissBanner();
                showSuccessMessage('Installation simulated! In production, the PWA would now be installed.');
            }
        });
    }

    /**
     * Show manual install instructions with visual guide
     * @param {boolean} hasPWA - Whether the third-party site has PWA setup
     */
    function showManualInstallInstructions(hasPWA = false) {
        let title = '';
        let message = '';
        
        if (hasPWA) {
            // Site has PWA setup - install should be possible
            if (isAndroid()) {
                title = 'Android Installation';
                message = `This site supports PWA installation!\n\n` +
                    `To install:\n` +
                    `1. Tap the menu (⋮) in your browser\n` +
                    `2. Select "Add to Home screen" or "Install app"\n` +
                    `3. Confirm the installation\n\n` +
                    `The install icon (➕) should also appear in the address bar.`;
            } else {
                title = 'Desktop Installation';
                message = `This site supports PWA installation!\n\n` +
                    `Chrome/Edge:\n` +
                    `• Look for the install icon (➕) in the address bar\n` +
                    `• Or go to Menu → "Install [App Name]"\n\n` +
                    `The install option should appear automatically.`;
            }
        } else {
            // Site doesn't have PWA setup
            if (isAndroid()) {
                title = 'Installation Instructions';
                message = `To add this site to your home screen:\n\n` +
                    `1. Tap the menu (⋮) in your browser\n` +
                    `2. Select "Add to Home screen"\n` +
                    `3. Confirm to add the shortcut\n\n` +
                    `Note: This creates a shortcut, not a full PWA installation.`;
            } else {
                title = 'Installation Instructions';
                message = `To install this site as an app:\n\n` +
                    `Chrome/Edge:\n` +
                    `• Look for the install icon (➕) in the address bar\n` +
                    `• Or go to Menu → "Install [Site Name]"\n\n` +
                    `Note: The install option only appears if the site has PWA support configured.`;
            }
        }
        
        createInstallModal({
            title: title,
            message: message,
            buttonText: 'Got it',
            onConfirm: () => {
                // Just close the modal
            }
        });
    }

    /**
     * Show iOS install guide (Note: Auto-install is NOT possible on iOS due to Apple restrictions)
     * iOS requires manual user action: Share button → Add to Home Screen
     */
    function showIOSInstallGuide() {
        // Check if we're in a webview that might support programmatic install (unlikely but check)
        const isInWebView = window.navigator.standalone === false && 
                           (window.navigator.userAgent.includes('wv') || 
                            window.navigator.userAgent.includes('WebView'));
        
        let message = '';
        if (isInWebView) {
            // In webview - might have different capabilities, but still unlikely
            message = `To install this app on iOS:\n\n` +
                     `1. Tap the Share button (square with arrow) at the bottom\n` +
                     `2. Scroll down and tap "Add to Home Screen"\n` +
                     `3. Tap "Add" to confirm\n\n` +
                     `Note: iOS requires manual installation for security.`;
        } else {
            // Standard Safari - must use share button
            message = `Install on iOS:\n\n` +
                     `1. Tap the Share button (square with arrow ↑) at the bottom of Safari\n` +
                     `2. Scroll down in the share menu\n` +
                     `3. Tap "Add to Home Screen"\n` +
                     `4. Tap "Add" to confirm\n\n` +
                     `Note: iOS requires manual installation. Auto-install is not possible due to Apple security restrictions.`;
        }
        
        createInstallModal({
            title: 'Install MachiBet App',
            message: message,
            buttonText: 'I Understand',
            onConfirm: () => {
                // Close modal
            }
        });
    }

    /**
     * Show iOS install instructions in a styled modal (legacy function)
     */
    function showInstallInstructions(instructions) {
        // Remove HTML tags for cleaner display
        const textOnly = instructions.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
        
        createInstallModal({
            title: 'iOS Installation Instructions',
            message: textOnly,
            buttonText: 'Got it',
            onConfirm: () => {
                // Just close the modal
            }
        });
    }

    /**
     * Create a styled modal for install instructions/prompts
     */
    function createInstallModal({ title, message, buttonText, onConfirm }) {
        // Remove existing modal if any
        const existingModal = document.getElementById('pwa-install-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'pwa-install-modal';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        `;

        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);

        // Title
        const titleEl = document.createElement('h2');
        titleEl.textContent = title;
        titleEl.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 20px;
            font-weight: 600;
            color: #333;
        `;

        // Message
        const messageEl = document.createElement('p');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            margin: 0 0 24px 0;
            font-size: 14px;
            line-height: 1.6;
            color: #666;
            white-space: pre-line;
        `;

        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        `;

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            padding: 10px 20px;
            border: 1px solid #ddd;
            background: white;
            color: #333;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        `;
        closeBtn.addEventListener('click', () => {
            overlay.remove();
            style.remove();
        });

        // Confirm button
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = buttonText;
        confirmBtn.style.cssText = `
            padding: 10px 20px;
            border: none;
            background: linear-gradient(135deg, #016ecf 0%, #022a6a 100%);
            color: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
        `;
        confirmBtn.addEventListener('click', () => {
            if (onConfirm) onConfirm();
            overlay.remove();
            style.remove();
        });

        buttonContainer.appendChild(closeBtn);
        buttonContainer.appendChild(confirmBtn);

        modal.appendChild(titleEl);
        modal.appendChild(messageEl);
        modal.appendChild(buttonContainer);
        overlay.appendChild(modal);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                style.remove();
            }
        });

        document.body.appendChild(overlay);
    }

    /**
     * Show success message
     */
    function showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10001;
            animation: slideUp 0.3s ease-out;
            max-width: 300px;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                toast.remove();
                style.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Check if test mode is enabled (via URL parameter or data attribute)
     */
    function isTestMode() {
        // Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('pwa-test') === 'true') {
            return true;
        }
        
        // Check data attribute on script tag
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            if (script.src && script.src.includes('pwa-install-banner.js')) {
                if (script.getAttribute('data-test-mode') === 'true') {
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * Initialize the PWA install banner
     * @param {Object} opts - Configuration options
     * @param {string} opts.lang - Language code ('en' or 'bn')
     * @param {Object} opts.config - Additional config overrides
     */
    function init(opts = {}) {
        // Merge user config with defaults
        if (opts.config) {
            CONFIG = Object.assign({}, DEFAULT_CONFIG, opts.config);
        }
        
        // Set language if provided (MUST be set before banner creation)
        if (opts.lang && (opts.lang === 'en' || opts.lang === 'bn')) {
            currentLang = opts.lang;
            console.log('PWA Install Banner: Language explicitly set to', currentLang);
        }
        
        // Log initialization with version
        console.log('PWA Install Banner: Initializing v' + SCRIPT_VERSION);
        console.log('PWA Install Banner: Current language:', getLang());
        console.log('PWA Install Banner: Current URL:', window.location.href);
        
        // If banner already exists and language changed, recreate it
        const existingBanner = document.getElementById(CONFIG.bannerId);
        if (existingBanner && opts.lang) {
            console.log('PWA Install Banner: Recreating banner with new language');
            existingBanner.remove();
        }
        
        isInitialized = true;
        
        // Inject manifest for third-party sites if enabled (do this FIRST, before anything else)
        if (CONFIG.injectManifest) {
            // Always inject/update manifest to ensure it's using our hosted version
            injectManifest();
        }

        // Don't show if already in standalone mode (unless test mode)
        if (isStandalone() && !isTestMode()) {
            console.log('PWA Install Banner: Running in standalone mode, banner not shown');
            return;
        }

        // Check if banner was dismissed (unless test mode or force show)
        if (isBannerDismissed() && !isTestMode() && !opts.forceShow) {
            console.log('PWA Install Banner: Banner was previously dismissed');
            console.log('PWA Install Banner: To show again, clear localStorage or use init({ forceShow: true })');
            // Don't return - still show banner on PC if explicitly requested
            if (!opts.forceShow) {
                // Only skip if not forcing show
                return;
            }
        }

        // Check domain if enabled
        if (!isDomainAllowed()) {
            console.log('PWA Install Banner: Domain not allowed');
            return;
        }

        // Listen for beforeinstallprompt event (Chrome/Edge)
        // This event fires when the THIRD-PARTY site has PWA setup and is installable
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            console.log('PWA Install Banner: beforeinstallprompt event received - third-party site has PWA capabilities!');
            
            // Create and show banner
            createBanner();
            
            // Auto-trigger install prompt after a short delay (optional - can be disabled)
            // This makes it more "automated" - user sees banner and prompt appears
            if (CONFIG.autoTriggerInstall) {
                setTimeout(() => {
                    if (deferredPrompt && document.getElementById(CONFIG.bannerId)) {
                        // Auto-trigger the install prompt
                        handleInstallClick();
                    }
                }, CONFIG.autoTriggerDelay || 2000);
            }
        });

        // Show banner on all platforms (iOS, Android, Desktop)
        // iOS: Show immediately (no beforeinstallprompt event)
        // Desktop/Android: Show after short delay if beforeinstallprompt doesn't fire
        const showBannerDelay = isIOS() ? 500 : 1000;
        
        setTimeout(() => {
            if (!document.getElementById(CONFIG.bannerId)) {
                // Show if not in standalone mode (and not dismissed unless forceShow)
                const shouldShow = !isStandalone() && (!isBannerDismissed() || opts.forceShow);
                if (shouldShow) {
                    console.log('PWA Install Banner: Showing banner (language:', getLang() + ')');
                    createBanner();
                } else {
                    console.log('PWA Install Banner: Banner not shown - dismissed:', isBannerDismissed(), 'standalone:', isStandalone());
                }
            }
        }, showBannerDelay);

        // Also listen for appinstalled event
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            hideBanner();
            dismissBanner();
        });
    }

    // Create and expose PWAInstallBanner API
    const PWAInstallBanner = {
        init: function(opts) {
            console.log('PWA Install Banner: init() called with options:', opts);
            // If already initialized, recreate banner with new settings
            if (isInitialized && opts) {
                if (opts.lang) {
                    currentLang = opts.lang;
                    console.log('PWA Install Banner: Language updated to', currentLang);
                }
                // Remove existing banner to recreate with new language
                const existingBanner = document.getElementById(CONFIG.bannerId);
                if (existingBanner) {
                    existingBanner.remove();
                }
            }
            init(opts);
        },
        clearDismissal: function() {
            try {
                localStorage.removeItem(CONFIG.localStorageKey);
                console.log('PWA Install Banner: Dismissal cleared');
            } catch (e) {
                console.error('PWA Install Banner: Failed to clear dismissal:', e);
            }
        },
        show: showBanner,
        hide: hideBanner,
        isStandalone: isStandalone,
        create: createBanner,
        isTestMode: isTestMode,
        hasManifest: hasManifest,
        hasServiceWorker: hasServiceWorker,
        hasPWACapabilities: hasPWACapabilities,
        getLang: getLang,
        setLang: function(lang) {
            if (lang === 'en' || lang === 'bn') {
                currentLang = lang;
                console.log('PWA Install Banner: Language changed to', lang);
                // Recreate banner with new language if it exists
                const banner = document.getElementById(CONFIG.bannerId);
                if (banner) {
                    banner.remove();
                    createBanner();
                }
            }
        },
        version: SCRIPT_VERSION
    };

    // Explicitly attach to window - MUST exist before auto-init
    window.PWAInstallBanner = PWAInstallBanner;
    
    // Auto-initialize when script loads (only if not already initialized)
    // Delay auto-init slightly to allow manual init() to run first
    setTimeout(function() {
        if (!isInitialized) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    if (!isInitialized) {
                        console.log('PWA Install Banner: Auto-initializing (no manual init() called)');
                        init();
                    }
                });
            } else {
                // DOM already loaded
                if (!isInitialized) {
                    console.log('PWA Install Banner: Auto-initializing (no manual init() called)');
                    init();
                }
            }
        }
    }, 100); // Small delay to allow manual init() to run first

})();
