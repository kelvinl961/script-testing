
(function() {
    'use strict';

    
    const SCRIPT_VERSION = '2.3.1-en';
    
    
    const DEFAULT_CONFIG = {
        bannerId: 'pwa-install-banner',
        logoUrl: 'https://cdn.jsdelivr.net/gh/kelvinl961/script-testing@main/favicon-1.png',
        localStorageKey: 'pwa-banner-dismissed',
        checkDomain: false,
        allowedDomains: ['m.mcb777', 'm.mcb177'],
        showIOSInstructions: true,
        autoTriggerInstall: false,
        autoTriggerDelay: 2000,
        // Same-origin manifest required for real Android PWA install (CDN manifest breaks start_url).
        manifestUrl: null,
        injectManifest: true,
        registerServiceWorker: true,
        serviceWorkerUrl: '/sw.js',
        installPromptWaitMs: 8000,
        // Embed sites (m.mcb777): build manifest on current origin — required for Android install.
        useDynamicManifest: true,
    };

    
    const i18n = {
        en: {
            appName: 'MachiBet',
            title: 'Official App',
            description: 'Sports app, Entertainment app<br>Play anytime, anywhere',
            installText: 'Install',
            closeText: '×',
            iosInstructions: 'Tap the share button and select "Add to Home Screen"',
            modalTitle: 'Install MachiBet App',
            modalIOSInstructions: 'Install on iOS:\n\n1. Tap the Share button (square with arrow ↑) at the bottom of Safari\n2. Scroll down in the share menu\n3. Tap "Add to Home Screen"\n4. Tap "Add" to confirm\n\nNote: iOS requires manual installation. Auto-install is not possible due to Apple security restrictions.',
            modalButtonText: 'I Understand',
            modalCloseText: 'Close',
            androidPreparing: 'Preparing…',
            androidInstallText: 'Install',
            androidOpenInChromeTitle: 'Open in Chrome to Install',
            androidOpenInChromeMessage: 'In-app browsers (Facebook, Telegram, etc.) cannot install apps.\n\n1. Tap the menu (⋮) or "..." at the top\n2. Choose "Open in Chrome" or "Open in browser"\n3. Return to this page and tap Install again\n\nChrome will show the official install dialog and add the app to your home screen.',
            androidUnavailableTitle: 'Install Not Ready Yet',
            androidUnavailableMessage: 'The official install prompt is not available on this browser yet.\n\nFor a real app on your home screen (not just a shortcut):\n• Use Chrome browser on Android\n• Make sure you are on HTTPS\n• Tap Install again after the page fully loads\n\nAvoid "Add to Home screen" from the browser menu unless Install does not work — that often creates a shortcut that opens inside the browser instead of as a standalone app.',
            installSuccess: 'App installed! You can open MachiBet from your home screen.',
            installDeclined: 'Install cancelled. You can tap Install again anytime.'
        },
        bn: {
            appName: 'MachiBet',
            title: 'অফিসিয়াল অ্যাপ',
            description: 'স্পোর্টস অ্যাপ, এন্টারটেইনমেন্ট অ্যাপ<br>খেলুন এনি টাইম এনি প্লেস',
            installText: 'ইনস্টল',
            closeText: '×',
            iosInstructions: 'শেয়ার বোতামে ট্যাপ করুন এবং "হোম স্ক্রিনে যোগ করুন" নির্বাচন করুন',
            modalTitle: 'MachiBet অ্যাপ ইনস্টল করুন',
            modalIOSInstructions: 'iOS এ ইনস্টল করুন:\n\n১. Safari এর নিচে শেয়ার বোতামে (তীর সহ বর্গক্ষেত্র ↑) ট্যাপ করুন\n২. শেয়ার মেনুতে নিচে স্ক্রল করুন\n৩. "হোম স্ক্রিনে যোগ করুন" ট্যাপ করুন\n৪. নিশ্চিত করতে "যোগ করুন" ট্যাপ করুন\n\nদ্রষ্টব্য: iOS-এ ম্যানুয়াল ইনস্টলেশন প্রয়োজন। Apple-এর নিরাপত্তা সীমাবদ্ধতার কারণে স্বয়ংক্রিয় ইনস্টল সম্ভব নয়।',
            modalButtonText: 'আমি বুঝেছি',
            modalCloseText: 'বন্ধ করুন',
            androidPreparing: 'প্রস্তুত হচ্ছে…',
            androidInstallText: 'ইনস্টল',
            androidOpenInChromeTitle: 'ইনস্টল করতে Chrome এ খুলুন',
            androidOpenInChromeMessage: 'ইন-অ্যাপ ব্রাউজার (Facebook, Telegram ইত্যাদি) থেকে অ্যাপ ইনস্টল করা যায় না।\n\n১. উপরে মেনু (⋮) বা "..." ট্যাপ করুন\n২. "Open in Chrome" বা "Open in browser" বেছে নিন\n৩. এই পেজে ফিরে আবার ইনস্টল ট্যাপ করুন\n\nChrome অফিসিয়াল ইনস্টল ডায়ালগ দেখাবে এবং হোম স্ক্রিনে অ্যাপ যোগ করবে।',
            androidUnavailableTitle: 'ইনস্টল এখনো প্রস্তুত নয়',
            androidUnavailableMessage: 'এই ব্রাউজারে এখনো অফিসিয়াল ইনস্টল প্রম্পট পাওয়া যায়নি।\n\nহোম স্ক্রিনে সত্যিকারের অ্যাপের জন্য (শুধু শর্টকাট নয়):\n• Android এ Chrome ব্যবহার করুন\n• HTTPS সাইটে থাকুন\n• পেজ পুরো লোড হওয়ার পর আবার ইনস্টল ট্যাপ করুন\n\nইনস্টল কাজ না করলে ব্রাউজার মেনু থেকে "Add to Home screen" ব্যবহার করবেন না — সেটি প্রায়ই ব্রাউজারের ভিতরেই খোলে।',
            installSuccess: 'অ্যাপ ইনস্টল হয়েছে! হোম স্ক্রিন থেকে MachiBet খুলতে পারবেন।',
            installDeclined: 'ইনস্টল বাতিল হয়েছে। যেকোনো সময় আবার ইনস্টল ট্যাপ করতে পারেন।'
        }
    };

    
    
    
    
    
    let currentLang = 'en';
    let CONFIG = Object.assign({}, DEFAULT_CONFIG);
    let isInitialized = false;
    let deferredPrompt = null;
    let installPromptWaiters = [];
    let swRegistrationPromise = null;
    
    
    console.log('PWA Install Banner Script v' + SCRIPT_VERSION + ' loaded');
    
        function getLang() {
        
        if (currentLang !== null) {
            return currentLang;
        }
        
        
        if (currentLang) {
            return currentLang;
        }
        
        
        const docLang = document.documentElement.lang;
        if (docLang && (docLang === 'bn' || docLang.startsWith('bn-'))) {
            return 'bn';
        }
        
        
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('lang') === 'bn') {
            return 'bn';
        }
        
        
        const marketingCampaign = localStorage.getItem('marketing_campaign');
        if (marketingCampaign && marketingCampaign.includes('BD_BN')) {
            return 'bn';
        }
        
        
        return 'en';
    }
    
        function getLocalizedText(key) {
        const lang = getLang();
        const translations = i18n[lang] || i18n.en;
        const text = translations[key];
        
        
        if (text === undefined || text === null) {
            const fallback = i18n.en[key];
            if (fallback !== undefined && fallback !== null) {
                return fallback;
            }
        }
        
        
        return text || '';
    }

        function isStandalone() {
        
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return true;
        }
        
        
        if (window.navigator.standalone === true) {
            return true;
        }
        
        
        if (window.matchMedia('(display-mode: minimal-ui)').matches) {
            return true;
        }
        
        
        
        if (window.matchMedia('(display-mode: fullscreen)').matches) {
            
            return false; 
        }
        
        return false;
    }

        function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

        function isAndroid() {
        return /Android/.test(navigator.userAgent);
    }

        function isInAppBrowser() {
        const ua = navigator.userAgent || '';
        if (/FBAN|FBAV|Instagram|Line\/|MicroMessenger|Twitter|Telegram|Snapchat|TikTok|wv\)/i.test(ua)) {
            return true;
        }
        if (isAndroid() && /\; wv\;/.test(ua)) {
            return true;
        }
        return false;
    }

        function isSecureContext() {
        return window.isSecureContext === true;
    }

        function getManifestUrl() {
        if (CONFIG.manifestUrl) {
            try {
                return new URL(CONFIG.manifestUrl, window.location.origin).href;
            } catch (e) {
                return CONFIG.manifestUrl;
            }
        }
        return window.location.origin + '/manifest.json';
    }

        function notifyInstallPromptWaiters(event) {
        const waiters = installPromptWaiters.slice();
        installPromptWaiters = [];
        waiters.forEach((resolve) => {
            try {
                resolve(event);
            } catch (e) {
                console.warn('PWA Install Banner: install prompt waiter failed', e);
            }
        });
    }

        function waitForInstallPrompt(timeoutMs) {
        if (deferredPrompt) {
            return Promise.resolve(deferredPrompt);
        }
        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                resolve(null);
            }, timeoutMs);
            installPromptWaiters.push((event) => {
                clearTimeout(timer);
                resolve(event);
            });
        });
    }

        function ensureServiceWorker() {
        if (!CONFIG.registerServiceWorker || !('serviceWorker' in navigator)) {
            return Promise.resolve(false);
        }
        if (swRegistrationPromise) {
            return swRegistrationPromise;
        }
        swRegistrationPromise = navigator.serviceWorker.register(CONFIG.serviceWorkerUrl || '/sw.js', { scope: '/' })
            .then((registration) => {
                console.log('PWA Install Banner: Service worker registered', registration.scope);
                return navigator.serviceWorker.ready.then(() => true);
            })
            .catch((error) => {
                console.warn('PWA Install Banner: Service worker registration failed, trying blob fallback', error);
                return registerBlobServiceWorker();
            });
        return swRegistrationPromise;
    }

        function setInstallButtonLoading(isLoading) {
        const installBtn = document.getElementById('pwa-install-button');
        if (!installBtn) {
            return;
        }
        if (isLoading) {
            installBtn.dataset.originalText = installBtn.innerHTML;
            installBtn.innerHTML = getLocalizedText('androidPreparing') || 'Preparing…';
            installBtn.disabled = true;
            installBtn.style.opacity = '0.85';
            installBtn.style.cursor = 'wait';
        } else {
            installBtn.innerHTML = installBtn.dataset.originalText || getLocalizedText('androidInstallText') || getLocalizedText('installText') || 'Install';
            installBtn.disabled = false;
            installBtn.style.opacity = '1';
            installBtn.style.cursor = 'pointer';
        }
    }

        async function runNativeInstallPrompt() {
        if (!deferredPrompt) {
            return null;
        }
        try {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            deferredPrompt = null;
            return choiceResult.outcome;
        } catch (error) {
            console.warn('PWA Install Banner: native install prompt failed', error);
            deferredPrompt = null;
            return null;
        }
    }

        function isBannerDismissed() {
        try {
            return localStorage.getItem(CONFIG.localStorageKey) === 'true';
        } catch (e) {
            return false;
        }
    }

        function dismissBanner() {
        try {
            localStorage.setItem(CONFIG.localStorageKey, 'true');
        } catch (e) {
            
        }
    }

        function isDomainAllowed() {
        if (!CONFIG.checkDomain) {
            return true;
        }
        
        const currentUrl = window.location.href;
        return CONFIG.allowedDomains.some(domain => currentUrl.includes(domain));
    }

        function hasManifest() {
        const manifestLink = document.querySelector('link[rel="manifest"]');
        return manifestLink !== null;
    }

        function buildDynamicManifest() {
        const origin = window.location.origin;
        const icon = CONFIG.logoUrl || (origin + '/favicon.ico');
        return {
            name: getLocalizedText('appName') || 'MachiBet',
            short_name: getLocalizedText('appName') || 'MachiBet',
            description: 'Sports app, Entertainment app. Play anytime, anywhere',
            start_url: origin + '/',
            scope: origin + '/',
            display: 'standalone',
            background_color: '#ffffff',
            theme_color: '#016ecf',
            orientation: 'portrait-primary',
            icons: [
                { src: icon, sizes: '192x192', type: 'image/png', purpose: 'any' },
                { src: icon, sizes: '512x512', type: 'image/png', purpose: 'any' },
                { src: icon, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
            ],
            prefer_related_applications: false
        };
    }

        function registerBlobServiceWorker() {
        const swCode = [
            "self.addEventListener('install', function(e) { self.skipWaiting(); });",
            "self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });",
            "self.addEventListener('fetch', function(e) { e.respondWith(fetch(e.request).catch(function() { return Response.error(); })); });"
        ].join('\n');
        const blob = new Blob([swCode], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        return navigator.serviceWorker.register(url, { scope: '/' }).then(function(reg) {
            console.log('PWA Install Banner: Blob service worker registered (embed fallback)');
            return reg.ready.then(function() { return true; });
        }).catch(function(err) {
            URL.revokeObjectURL(url);
            console.warn('PWA Install Banner: Blob service worker failed', err);
            return false;
        });
    }

        function injectManifest() {
        
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            let content = viewportMeta.getAttribute('content');
            
            if (content.includes('viewport-fit=cover')) {
                viewportMeta.setAttribute('content', content.replace('viewport-fit=cover', 'viewport-fit=auto'));
            }
        }

        
        let appleStatusMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (!appleStatusMeta) {
            appleStatusMeta = document.createElement('meta');
            appleStatusMeta.name = 'apple-mobile-web-app-status-bar-style';
            document.head.appendChild(appleStatusMeta);
        }
        appleStatusMeta.content = 'default';

        
        let manifestLink = document.querySelector('link[rel="manifest"]');
        if (!manifestLink) {
            manifestLink = document.createElement('link');
            manifestLink.rel = 'manifest';
            document.head.appendChild(manifestLink);
        }
        
        if (CONFIG.manifestUrl || CONFIG.injectManifest) {
            if (CONFIG.useDynamicManifest || !CONFIG.manifestUrl) {
                const blob = new Blob([JSON.stringify(buildDynamicManifest())], { type: 'application/manifest+json' });
                manifestLink.href = URL.createObjectURL(blob);
            } else {
                manifestLink.href = getManifestUrl() + '?v=' + SCRIPT_VERSION.replace(/\./g, '');
            }
        }

        
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
        themeColorMeta.content = '#ffffff'; 
    }

        function hasServiceWorker() {
        return 'serviceWorker' in navigator;
    }

        function hasPWACapabilities() {
        return hasManifest() || hasServiceWorker();
    }


        function createBanner() {
        
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
        margin-top: 0; 
    position: relative;     z-index: 9999;
    background: linear-gradient(135deg, #016ecf 0%, #022a6a 100%);
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    font-family: -apple-system, BlinkMacSystemFont, ...;
`;

        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = getLocalizedText('closeText') || '×';
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

        
        const content = document.createElement('div');
        content.style.cssText = `
            display: flex;
            flex: 1;
            align-items: center;
            gap: 12px;
        `;

        
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
            color: white;
            line-height: 1.2;
        `;

        const description = document.createElement('p');
        const descText = getLocalizedText('description') || 'Sports app, Entertainment app<br>Play anytime, anywhere';
        description.innerHTML = descText;
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

        
        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-button';
        const installText = getLocalizedText('installText') || 'Install';
        installBtn.innerHTML = installText;
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

        
        if (document.body) {
            document.body.insertBefore(banner, document.body.firstChild);
        } else {
            
            document.addEventListener('DOMContentLoaded', () => {
                document.body.insertBefore(banner, document.body.firstChild);
            });
        }
    }

        function hideBanner() {
        const banner = document.getElementById(CONFIG.bannerId);
        if (banner) {
            banner.style.display = 'none';
        }
    }

        function showBanner() {
        const banner = document.getElementById(CONFIG.bannerId);
        if (banner) {
            banner.style.display = 'flex';
        }
    }

    async function handleInstallClick() {
        if (isIOS()) {
            if (CONFIG.showIOSInstructions) {
                showIOSInstallGuide();
            }
            return;
        }

        if (isAndroid()) {
            if (isInAppBrowser()) {
                showOpenInChromeGuide();
                return;
            }

            if (!isSecureContext()) {
                showAndroidInstallUnavailable();
                return;
            }

            setInstallButtonLoading(true);
            try {
                if (deferredPrompt) {
                    const outcome = await runNativeInstallPrompt();
                    if (outcome === 'accepted') {
                        hideBanner();
                        dismissBanner();
                        showSuccessMessage(getLocalizedText('installSuccess'));
                    } else if (outcome === 'dismissed') {
                        showSuccessMessage(getLocalizedText('installDeclined'));
                    }
                    return;
                }

                await ensureServiceWorker();

                const promptEvent = await waitForInstallPrompt(CONFIG.installPromptWaitMs || 8000);
                if (promptEvent) {
                    deferredPrompt = promptEvent;
                    const outcome = await runNativeInstallPrompt();
                    if (outcome === 'accepted') {
                        hideBanner();
                        dismissBanner();
                        showSuccessMessage(getLocalizedText('installSuccess'));
                    } else if (outcome === 'dismissed') {
                        showSuccessMessage(getLocalizedText('installDeclined'));
                    }
                    return;
                }

                showAndroidInstallUnavailable();
            } finally {
                setInstallButtonLoading(false);
            }
            return;
        }

        if (deferredPrompt) {
            const outcome = await runNativeInstallPrompt();
            if (outcome === 'accepted') {
                hideBanner();
                dismissBanner();
                showSuccessMessage(getLocalizedText('installSuccess'));
            }
            return;
        }

        if (hasPWACapabilities()) {
            console.log('PWA Install Banner: PWA capable but install prompt not available yet');
            showManualInstallInstructions(true);
        } else if (isTestMode()) {
            showTestInstallPrompt();
        } else {
            showManualInstallInstructions(false);
        }
    }

        function showOpenInChromeGuide() {
        createInstallModal({
            title: getLocalizedText('androidOpenInChromeTitle'),
            message: getLocalizedText('androidOpenInChromeMessage'),
            buttonText: getLocalizedText('modalButtonText'),
            onConfirm: () => {}
        });
    }

        function showAndroidInstallUnavailable() {
        createInstallModal({
            title: getLocalizedText('androidUnavailableTitle'),
            message: getLocalizedText('androidUnavailableMessage'),
            buttonText: getLocalizedText('modalButtonText'),
            onConfirm: () => {}
        });
    }

        function showTestInstallPrompt() {
        if (deferredPrompt) {
            handleInstallClick();
            return;
        }
        
        
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

        function showManualInstallInstructions(hasPWA = false) {
        let title = '';
        let message = '';
        
        if (hasPWA) {
            
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
                
            }
        });
    }

        function showIOSInstallGuide() {
        
        const lang = getLang();
        const modalTitle = getLocalizedText('modalTitle') || 'Install MachiBet App';
        const modalMessage = getLocalizedText('modalIOSInstructions') || 
            `Install on iOS:\n\n` +
            `1. Tap the Share button (square with arrow ↑) at the bottom of Safari\n` +
            `2. Scroll down in the share menu\n` +
            `3. Tap "Add to Home Screen"\n` +
            `4. Tap "Add" to confirm\n\n` +
            `Note: iOS requires manual installation. Auto-install is not possible due to Apple security restrictions.`;
        const modalButtonText = getLocalizedText('modalButtonText') || 'I Understand';
        
        createInstallModal({
            title: modalTitle,
            message: modalMessage,
            buttonText: modalButtonText,
            onConfirm: () => {
                
            }
        });
    }

        function showInstallInstructions(instructions) {
        
        const textOnly = instructions.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
        
        const modalTitle = getLang() === 'bn' ? 'iOS ইনস্টলেশন নির্দেশনা' : 'iOS Installation Instructions';
        const modalButtonText = getLocalizedText('modalButtonText') || 'Got it';
        
        createInstallModal({
            title: modalTitle,
            message: textOnly,
            buttonText: modalButtonText,
            onConfirm: () => {
                
            }
        });
    }

        function createInstallModal({ title, message, buttonText, onConfirm }) {
        
        const existingModal = document.getElementById('pwa-install-modal');
        if (existingModal) {
            existingModal.remove();
        }

        
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

        
        const titleEl = document.createElement('h2');
        titleEl.textContent = title;
        titleEl.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 20px;
            font-weight: 600;
            color: #333;
        `;

        
        const messageEl = document.createElement('p');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            margin: 0 0 24px 0;
            font-size: 14px;
            line-height: 1.6;
            color: #666;
            white-space: pre-line;
        `;

        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        `;

        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = getLocalizedText('modalCloseText') || 'Close';
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

        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                style.remove();
            }
        });

        document.body.appendChild(overlay);
    }

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

        function isTestMode() {
        
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('pwa-test') === 'true') {
            return true;
        }
        
        
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

        function handleBeforeInstallPrompt(e) {
        e.preventDefault();
        deferredPrompt = e;
        notifyInstallPromptWaiters(e);
        console.log('PWA Install Banner: beforeinstallprompt event received - native install available');
        if (isInitialized && isDomainAllowed() && !isStandalone()) {
            createBanner();
            if (CONFIG.autoTriggerInstall) {
                setTimeout(() => {
                    if (deferredPrompt && document.getElementById(CONFIG.bannerId)) {
                        handleInstallClick();
                    }
                }, CONFIG.autoTriggerDelay || 2000);
            }
        }
    }

        function earlySetup() {
        if (CONFIG.injectManifest) {
            injectManifest();
        }
        if (CONFIG.registerServiceWorker && isSecureContext()) {
            ensureServiceWorker();
        }
    }

        function init(opts = {}) {
        
        if (opts.config) {
            CONFIG = Object.assign({}, DEFAULT_CONFIG, opts.config);
        }
        
        
        if (opts.lang && (opts.lang === 'en' || opts.lang === 'bn')) {
            currentLang = opts.lang;
            console.log('PWA Install Banner: Language explicitly set to', currentLang);
        }
        
        
        console.log('PWA Install Banner: Initializing v' + SCRIPT_VERSION);
        console.log('PWA Install Banner: Current language:', getLang());
        console.log('PWA Install Banner: Current URL:', window.location.href);
        
        
        const existingBanner = document.getElementById(CONFIG.bannerId);
        if (existingBanner && opts.lang) {
            console.log('PWA Install Banner: Recreating banner with new language');
            existingBanner.remove();
        }
        
        isInitialized = true;
        
        
        if (CONFIG.injectManifest) {
            injectManifest();
        }

        if (CONFIG.registerServiceWorker && isSecureContext()) {
            ensureServiceWorker();
        }

        
        if (isStandalone() && !isTestMode()) {
            console.log('PWA Install Banner: Running in standalone mode, banner not shown');
            return;
        }

        
        if (isBannerDismissed() && !isTestMode() && !opts.forceShow) {
            console.log('PWA Install Banner: Banner was previously dismissed');
            console.log('PWA Install Banner: To show again, clear localStorage or use init({ forceShow: true })');
            
            if (!opts.forceShow) {
                
                return;
            }
        }

        
        if (!isDomainAllowed()) {
            console.log('PWA Install Banner: Domain not allowed');
            return;
        }

        if (deferredPrompt) {
            console.log('PWA Install Banner: Native install prompt already captured before init');
        }

        
        
        
        const showBannerDelay = isIOS() ? 500 : 1000;
        
        setTimeout(() => {
            if (!document.getElementById(CONFIG.bannerId)) {
                
                const shouldShow = !isStandalone() && (!isBannerDismissed() || opts.forceShow);
                if (shouldShow) {
                    console.log('PWA Install Banner: Showing banner (language:', getLang() + ')');
                    createBanner();
                } else {
                    console.log('PWA Install Banner: Banner not shown - dismissed:', isBannerDismissed(), 'standalone:', isStandalone());
                }
            }
        }, showBannerDelay);

        
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            hideBanner();
            dismissBanner();
        });
    }

    
    const PWAInstallBanner = {
        init: function(opts) {
            console.log('PWA Install Banner: init() called with options:', opts);
            
            if (isInitialized && opts) {
                if (opts.lang) {
                    currentLang = opts.lang;
                    console.log('PWA Install Banner: Language updated to', currentLang);
                }
                
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
                
                const banner = document.getElementById(CONFIG.bannerId);
                if (banner) {
                    banner.remove();
                    createBanner();
                }
            }
        },
        version: SCRIPT_VERSION
    };

    
    window.PWAInstallBanner = PWAInstallBanner;

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    earlySetup();
    
    
    
    setTimeout(function() {
        if (window.__PWA_BANNER_DEFER_AUTO_INIT) {
            return;
        }
        if (!isInitialized) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    if (!isInitialized) {
                        console.log('PWA Install Banner: Auto-initializing (no manual init() called)');
                        init();
                    }
                });
            } else {
                
                if (!isInitialized) {
                    console.log('PWA Install Banner: Auto-initializing (no manual init() called)');
                    init();
                }
            }
        }
    }, 100); 

})();
