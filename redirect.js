// Language redirect script
(function() {
    // Only run if there's no language parameter already in the URL
    if (!window.location.search.includes('lang=')) {
        // Get browser language
        const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        const isItalian = browserLang === 'it' || browserLang === 'it-it' || browserLang.startsWith('it-');
        const isEnglish = browserLang.startsWith('en');
        
        // Check if we have a stored language preference
        const storedLang = localStorage.getItem('lang');
        
        // If we have a stored preference, use that
        if (storedLang === 'en' || storedLang === 'it') {
            // Add lang parameter to current URL and redirect
            const separator = window.location.search ? '&' : '?';
            window.location.href = window.location.href + separator + 'lang=' + storedLang;
            return;
        }
        
        // No stored preference, use browser language
        if (isEnglish) {
            // Redirect to English version
            const separator = window.location.search ? '&' : '?';
            window.location.href = window.location.href + separator + 'lang=en';
            // Store preference
            localStorage.setItem('lang', 'en');
        } else if (isItalian) {
            // Redirect to Italian version
            const separator = window.location.search ? '&' : '?';
            window.location.href = window.location.href + separator + 'lang=it';
            // Store preference
            localStorage.setItem('lang', 'it');
        }
        // For other languages, don't redirect (falls back to default)
    }
})(); 