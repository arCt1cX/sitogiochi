/**
 * Game Overview Module
 * Displays a SEO-friendly overview page before the game starts
 * This ensures users arriving from search engines see game descriptions
 */

// Global state
let overviewVisible = true;

/**
 * Initialize the game overview
 * Call this after DOM is loaded
 */
function initGameOverview() {
    const overview = document.getElementById('gameOverview');
    if (!overview) return;

    // Show overview by default
    showOverview();

    // Update content based on language
    updateOverviewLanguage();

    // Listen for language changes
    if (typeof window.addEventListener === 'function') {
        window.addEventListener('languageChanged', updateOverviewLanguage);
    }
}

/**
 * Show the overview screen
 */
function showOverview() {
    const overview = document.getElementById('gameOverview');
    if (!overview) return;

    overview.classList.add('active');
    document.body.classList.add('overview-active');
    overviewVisible = true;

    // Push state to handle back button
    if (window.history && window.history.pushState) {
        window.history.pushState({ overview: true }, '', window.location.href);
    }
}

/**
 * Hide the overview and start the game
 */
function startGame() {
    const overview = document.getElementById('gameOverview');
    if (!overview) return;

    overview.classList.remove('active');
    document.body.classList.remove('overview-active');
    overviewVisible = false;

    // Replace state so back goes to home, not overview
    if (window.history && window.history.replaceState) {
        window.history.replaceState({ overview: false }, '', window.location.href);
    }
}

/**
 * Update overview text based on current language
 */
function updateOverviewLanguage() {
    const isItalian = getUserLanguage() === 'it';

    // Update all elements with data-it and data-en attributes
    document.querySelectorAll('[data-it][data-en]').forEach(el => {
        el.textContent = isItalian ? el.getAttribute('data-it') : el.getAttribute('data-en');
    });

    // Update section labels
    const sectionLabels = document.querySelectorAll('.section-label');
    sectionLabels.forEach(label => {
        if (label.hasAttribute('data-it') && label.hasAttribute('data-en')) {
            label.textContent = isItalian ? label.getAttribute('data-it') : label.getAttribute('data-en');
        }
    });
}

/**
 * Get current user language
 * Falls back to checking various sources
 */
function getUserLanguage() {
    // Check if getUserLanguage exists in lang.js
    if (typeof window.getUserLanguage === 'function') {
        return window.getUserLanguage();
    }

    // Check localStorage
    const storedLang = localStorage.getItem('lang');
    if (storedLang) return storedLang;

    // Check document lang attribute
    const docLang = document.documentElement.lang;
    if (docLang === 'it' || docLang === 'en') return docLang;

    // Check browser language
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return browserLang.startsWith('it') ? 'it' : 'en';
}

/**
 * Handle back button - go to home instead of showing overview again
 */
window.addEventListener('popstate', function (e) {
    if (overviewVisible) {
        // User pressed back while on overview, go to home
        window.location.href = '../';
    } else if (e.state && e.state.overview === true) {
        // User pressed back after starting game, show overview
        showOverview();
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGameOverview);
} else {
    initGameOverview();
}
