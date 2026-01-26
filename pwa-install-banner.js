
(function() {
    'use strict';

    const CONFIG = {
        bannerId: 'pwa-install-banner',
        logoUrl: 'https://mcb777.com/favicon.ico', // ICO files may not work - browsers prefer PNG
        // Alternative: Use PNG if available: 'https://mcb777.com/icon-192x192.png'
        appName: 'MachiBet',
        appNameBn: 'MachiBet',
        title: 'Official App',
        titleBn: 'অফিসিয়াল অ্যাপ',
        description: 'Sports app, Entertainment app<br>Play anytime, anywhere',
        descriptionBn: 'স্পোর্টস অ্যাপ, এন্টারটেইনমেন্ট অ্যাপ<br>খেলুন এনি টাইম এনি প্লেস',
        installText: 'Install',
        installTextBn: 'ইনস্টল',
        closeText: '×',
        localStorageKey: 'pwa-banner-dismissed',
        checkDomain: false,
        allowedDomains: ['m.mcb777', 'm.mcb177'],
        showIOSInstructions: true,
        iosInstructions: 'Tap the share button <img src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23000\' d=\'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z\'/%3E%3C/svg%3E" style="width:16px;height:16px;vertical-align:middle;"> and select "Add to Home Screen"',
        autoTriggerInstall: false, // Set to true to auto-show install prompt after banner appears
        autoTriggerDelay: 2000, // Delay in milliseconds before auto-triggering (2000 = 2 seconds)
        manifestUrl: 'https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/manifest.json', // Hosted manifest URL
        injectManifest: true, // Set to true to inject manifest for third-party sites
    };

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
                theme_color: '#016ecf',
                orientation: 'portrait-primary',
                icons: [
                    {
                        src: CONFIG.logoUrl,
                        sizes: 'any',
                        type: 'image/x-icon',
                        purpose: 'any'
                    },
                    {
                        src: CONFIG.logoUrl,
                        sizes: '192x192',
                        type: 'image/x-icon'
                    },
                    {
                        src: CONFIG.logoUrl,
                        sizes: '512x512',
                        type: 'image/x-icon'
                    }
                ],
                categories: ['entertainment', 'sports', 'games']
            };
            
            const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: 'application/json' });
            const blobUrl = URL.createObjectURL(blob);
            manifestLink.href = blobUrl;
            console.log('PWA Install Banner: Created dynamic manifest with blob URL');
        }
        
        // Also add theme color meta tag
        if (!document.querySelector('meta[name="theme-color"]')) {
            const themeColor = document.createElement('meta');
            themeColor.name = 'theme-color';
            themeColor.content = '#016ecf';
            document.head.appendChild(themeColor);
            console.log('PWA Install Banner: Added theme-color meta tag');
        }
        
        // Verify icon is accessible
        const iconImg = new Image();
        iconImg.onload = function() {
            console.log('PWA Install Banner: Icon is accessible:', CONFIG.logoUrl);
        };
        iconImg.onerror = function() {
            console.warn('PWA Install Banner: Icon failed to load:', CONFIG.logoUrl);
            console.warn('PWA Install Banner: Browser may show default icon. ICO files may not work for PWA - consider using PNG.');
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
     * Check if Bengali language is enabled
     * Checks: URL param (?lang=bn), localStorage marketing_campaign, or script data attribute
     */
    function isBengali() {
        // Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('lang') === 'bn') {
            return true;
        }
        
        // Check localStorage marketing campaign
        if (localStorage.getItem('marketing_campaign')?.includes('BD_BN')) {
            return true;
        }
        
        // Check script data attribute
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            if (script.src && script.src.includes('pwa-install-banner.js')) {
                if (script.getAttribute('data-lang') === 'bn' || script.getAttribute('data-bengali') === 'true') {
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * Get localized text based on language detection
     */
    function getLocalizedText(key) {
        const bnKey = key + 'Bn';
        
        if (isBengali() && CONFIG[bnKey]) {
            return CONFIG[bnKey];
        }
        
        return CONFIG[key];
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
            background: linear-gradient(135deg, #016ecf 0%, #022a6a 100%);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        `;

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = CONFIG.closeText;
        closeBtn.style.cssText = `
            background: transparent;
            border: none;
            color: white;
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
        logo.alt = getLocalizedText('appName');
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
        title.innerHTML = `${getLocalizedText('appName')} | ${getLocalizedText('title')}`;
        title.style.cssText = `
            font-size: 13px;
            font-weight: 600;
            margin: 0 0 4px 0;
            color: white;
            line-height: 1.2;
        `;

        const description = document.createElement('p');
        description.innerHTML = getLocalizedText('description');
        description.style.cssText = `
            font-size: 11px;
            font-weight: 400;
            margin: 0;
            color: rgba(255,255,255,0.9);
            line-height: 1.3;
        `;

        textContainer.appendChild(title);
        textContainer.appendChild(description);

        content.appendChild(logo);
        content.appendChild(textContainer);

        // Install button
        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-button';
        installBtn.innerHTML = getLocalizedText('installText');
        installBtn.style.cssText = `
            font-size: 13px;
            font-weight: 600;
            background: white;
            color: #016ecf;
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
            title: '🧪 Test Mode - Install Simulation',
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
                showSuccessMessage('✅ Installation simulated! In production, the PWA would now be installed.');
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
            message = `📱 Install on iOS:\n\n` +
                     `1. Tap the Share button (square with arrow ↑) at the bottom of Safari\n` +
                     `2. Scroll down in the share menu\n` +
                     `3. Tap "Add to Home Screen"\n` +
                     `4. Tap "Add" to confirm\n\n` +
                     `⚠️ Note: iOS requires manual installation. Auto-install is not possible due to Apple security restrictions.`;
        }
        
        createInstallModal({
            title: '📱 Install MachiBet App',
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
            title: '📱 iOS Installation Instructions',
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
     */
    function init() {
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

        // Check if banner was dismissed (unless test mode)
        if (isBannerDismissed() && !isTestMode()) {
            console.log('PWA Install Banner: Banner was previously dismissed');
            return;
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
                // Only show if not in standalone mode and not dismissed
                if (!isStandalone() && !isBannerDismissed()) {
                    console.log('PWA Install Banner: Showing banner');
                    createBanner();
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

    // Auto-initialize when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        init();
    }

    // Export functions for manual control if needed
    window.PWAInstallBanner = {
        show: showBanner,
        hide: hideBanner,
        init: init,
        isStandalone: isStandalone,
        create: createBanner, // Export createBanner for manual creation
        isTestMode: isTestMode,
        hasManifest: hasManifest, // Check if third-party site has manifest
        hasServiceWorker: hasServiceWorker, // Check if third-party site has service worker
        hasPWACapabilities: hasPWACapabilities, // Check if third-party site has PWA setup
    };

})();
