/**
 * MachiBet PWA bootstrap (m.mcb777 / m.mcb177)
 * Loads pwa-install-banner.js and uses native Android install prompt (beforeinstallprompt).
 * Replaces legacy grey banner + api.mhubconnect.com manifest (broken start_url).
 */
(function() {
    'use strict';

    var ALLOWED_DOMAINS = ['m.mcb777', 'm.mcb177'];
    var BANNER_VERSION = '2.3.3';

    var href = window.location.href;
    if (!ALLOWED_DOMAINS.some(function(domain) { return href.indexOf(domain) !== -1; })) {
        return;
    }

    window.__PWA_BANNER_DEFER_AUTO_INIT = true;

    function getScriptBase() {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].src || '';
            if (src.indexOf('pwa.js') !== -1) {
                return src.replace(/pwa\.js(\?.*)?$/, '');
            }
        }
        return 'https://api.mhubconnect.com/js/';
    }

    function getLang() {
        try {
            var campaign = localStorage.getItem('marketing_campaign');
            if (campaign && campaign.indexOf('BD_BN') !== -1) {
                return 'bn';
            }
        } catch (e) {}
        if (document.documentElement.lang && document.documentElement.lang.indexOf('bn') === 0) {
            return 'bn';
        }
        return 'en';
    }

    function initBanner() {
        if (!window.PWAInstallBanner) {
            console.warn('PWA: pwa-install-banner.js failed to load');
            return;
        }

        var base = getScriptBase();
        window.PWAInstallBanner.init({
            lang: getLang(),
            config: {
                checkDomain: true,
                allowedDomains: ALLOWED_DOMAINS,
                logoUrl: base + 'machi.png',
                manifestUrl: null,
                useDynamicManifest: true,
                injectManifest: true,
                registerServiceWorker: true,
                serviceWorkerUrl: '/sw.js',
                installPromptWaitMs: 20000,
                localStorageKey: 'pwa-banner-dismissed'
            }
        });
    }

    function loadBannerScript() {
        if (window.PWAInstallBanner) {
            initBanner();
            return;
        }

        var script = document.createElement('script');
        script.src = getScriptBase() + 'pwa-install-banner.js?v=' + BANNER_VERSION;
        script.async = true;
        script.onload = initBanner;
        script.onerror = function() {
            console.error('PWA: could not load pwa-install-banner.js');
        };
        document.head.appendChild(script);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadBannerScript);
    } else {
        loadBannerScript();
    }
})();
