document.addEventListener('DOMContentLoaded', () => {
    // Apply initial language based on user preference
    applyTranslations();
    
    // Language toggle is now handled in applyTranslations() function in lang.js
    
    // Update page content with current language
    document.getElementById('tagline').textContent = getTranslation('tagline');
    document.getElementById('subtitle').textContent = getTranslation('subtitle');
    document.getElementById('copyright').textContent = getTranslation('copyright');
    
    // Update page title and description
    document.title = getTranslation('pageTitle');
    const metaDesc = document.getElementById('pageDescription');
    if (metaDesc) {
        metaDesc.setAttribute('content', getTranslation('pageDescription'));
    }
    
    // Games array with additional catchphrase information and display names
    const games = [
        {
            id: "impostor",
            displayName: getTranslation('impostor', 'title'),
            catchphrase: getTranslation('impostor', 'catchphrase'),
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2">
                               <!-- Shadow element -->
                <ellipse cx="40" cy="72" rx="30" ry="3" fill="rgba(0,0,0,0.2)" />

                                <!-- Group of silhouettes -->
                <!-- Left character (suspicious) -->
                <g class="suspicious-character">

                    <!-- Body with connected head -->
                                        <path d="M16,65 C16,50 20,45 24,45 C28,45 32,50 32,65" stroke="white" stroke-linecap="round" />
                    <path d="M18.5,39 C18,36 19,33 24,33 C29,33 30,36 29.5,39 C29,42 28,45 24,45 C20,45 19,42 18.5,39Z" fill="rgba(255,0,0,0.2)" stroke="white" stroke-width="1.2" />
                    <circle cx="24" cy="25" r="9" fill="rgba(255,0,0,0.2)" stroke="white" stroke-width="1.2" />

                                        <!-- Suspicious elements -->
                    <path d="M21,24 L23,22 M25,22 L27,24" stroke="white" stroke-width="1.2" />
                    <path d="M24,31 C22,29 26,29 24,31" stroke="white" stroke-width="1" />
                    <path d="M22,55 L26,55" stroke="rgba(255,0,0,0.5)" stroke-width="1.2" stroke-dasharray="1 1" />

                </g>
                
                                <!-- Middle character -->

                <g>
                    <!-- Body with connected head -->
                                      <path d="M33,65 C33,50 37,45 40,45 C43,45 47,50 47,65" stroke="white" stroke-linecap="round" />
                    <path d="M35.5,38 C35,35 36,32 40,32 C44,32 45,35 44.5,38 C44,41 43,45 40,45 C37,45 36,41 35.5,38Z" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="1.2" />
                    <circle cx="40" cy="22" r="8" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="1.2" />

                    <path d="M37,21 L39,21 M41,21 L43,21" stroke="white" stroke-width="1.2" />
                    <path d="M40,27 C38,25 42,25 40,27" stroke="white" stroke-width="1" />
                </g>
                
                <!-- Right character -->
                <g>
                    <!-- Body with connected head -->
                    <path d="M49,65 C49,50 53,45 56,45 C59,45 63,50 63,65" stroke="white" stroke-linecap="round" />
                    <path d="M51.5,39 C51,36 52,33 56,33 C60,33 61,36 60.5,39 C60,42 59,45 56,45 C53,45 52,42 51.5,39Z" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="1.2" />
                    <circle cx="56" cy="25" r="8" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="1.2" />
                    
                    <path d="M53,24 L55,24 M57,24 L59,24" stroke="white" stroke-width="1.2" />
                    <path d="M56,30 C54,28 58,28 56,30" stroke="white" stroke-width="1" />
                </g>
                
                <!-- Investigation elements -->
                <circle cx="24" cy="25" r="14" fill="none" stroke="rgba(255,0,0,0.3)" stroke-width="1" stroke-dasharray="2 2" />
                <path d="M12,33 L14,33.5 L13,35" stroke="rgba(255,0,0,0.6)" stroke-width="1" />
                <path d="M36,12 L34,15 L38,14" stroke="rgba(255,0,0,0.6)" stroke-width="1" />
                
                <!-- Connection lines suggesting discussion -->
                <path d="M32,25 L37,23" stroke="rgba(255,255,255,0.5)" stroke-width="0.8" stroke-dasharray="1 1" />
                <path d="M48,24 L54,24" stroke="rgba(255,255,255,0.5)" stroke-width="0.8" stroke-dasharray="1 1" />
                
                <!-- Question mark hovering over the group -->
                <text x="40" y="12" font-size="14" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">?</text>
                <circle cx="40" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" stroke-dasharray="1 2" />
                
                <!-- Pointing gesture -->
                <path d="M60,35 C63,38 65,40 63,35" stroke="white" stroke-width="1" />
                <path d="M63,35 L55,30" stroke="white" stroke-width="1" stroke-linecap="round" />
                <path d="M45,38 C42,42 39,39 40,36" stroke="white" stroke-width="1" />
                <path d="M40,36 L32,28" stroke="white" stroke-width="1" stroke-linecap="round" />
            </svg>`
        },
        {
            id: "colorgrid",
            displayName: getTranslation('colorgrid', 'title'),
            catchphrase: getTranslation('colorgrid', 'catchphrase'),
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="1.5">
                <!-- Grid shadow -->
                <rect x="17" y="17" width="50" height="50" rx="4" fill="rgba(0,0,0,0.2)" />
                
                <!-- Main grid -->
                <rect x="15" y="15" width="50" height="50" rx="4" stroke-width="1.5" />
                
                <!-- Grid cells with improved colors and inner details -->
                <rect x="15" y="15" width="16.6" height="16.6" fill="rgba(255,0,0,0.7)" stroke="white" />
                <rect x="16.5" y="16.5" width="13.6" height="13.6" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                
                <rect x="31.6" y="15" width="16.6" height="16.6" fill="rgba(0,255,0,0.7)" stroke="white" />
                <rect x="33.1" y="16.5" width="13.6" height="13.6" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                <path d="M39.9,21 L39.9,25 M37.9,23 L41.9,23" stroke="rgba(255,255,255,0.7)" stroke-width="0.8" />
                
                <rect x="48.2" y="15" width="16.6" height="16.6" fill="rgba(255,255,0,0.7)" stroke="white" />
                <rect x="49.7" y="16.5" width="13.6" height="13.6" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                
                <rect x="15" y="31.6" width="16.6" height="16.6" fill="rgba(0,0,255,0.7)" stroke="white" />
                <rect x="16.5" y="33.1" width="13.6" height="13.6" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                
                <!-- Highlighted cell with special effects -->
                <rect x="31.6" y="31.6" width="16.6" height="16.6" fill="rgba(255,0,255,0.7)" stroke="white" stroke-width="3" />
                <rect x="33.1" y="33.1" width="13.6" height="13.6" fill="none" stroke="white" stroke-width="0.5" />
                <circle cx="39.9" cy="39.9" r="5" fill="none" stroke="white" stroke-width="1" />
                <path d="M35.9,35.9 L43.9,43.9 M43.9,35.9 L35.9,43.9" stroke="white" stroke-width="0.5" />
                
                <rect x="48.2" y="31.6" width="16.6" height="16.6" fill="rgba(0,255,255,0.7)" stroke="white" />
                <rect x="49.7" y="33.1" width="13.6" height="13.6" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                
                <rect x="15" y="48.2" width="16.6" height="16.6" fill="rgba(255,165,0,0.7)" stroke="white" />
                <rect x="16.5" y="49.7" width="13.6" height="13.6" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                
                <rect x="31.6" y="48.2" width="16.6" height="16.6" fill="rgba(128,0,128,0.7)" stroke="white" />
                <rect x="33.1" y="49.7" width="13.6" height="13.6" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                
                <rect x="48.2" y="48.2" width="16.6" height="16.6" fill="rgba(0,128,0,0.7)" stroke="white" />
                <rect x="49.7" y="49.7" width="13.6" height="13.6" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                
                <!-- Selection cursor -->
                <path d="M31.6,31.6 L28,28" stroke="white" stroke-width="1" stroke-linecap="round" />
                <path d="M26,26 L22,22" stroke="white" stroke-width="1" stroke-linecap="round" stroke-dasharray="2 2" />
                <circle cx="20" cy="20" r="3" stroke="white" fill="none" />
                <path d="M22,18 L18,22 M18,18 L22,22" stroke="white" stroke-width="0.8" />
            </svg>`
        },
        {
            id: "chainreaction",
            displayName: getTranslation('chainreaction', 'title'),
            catchphrase: getTranslation('chainreaction', 'catchphrase'),
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2">
                <!-- Shadow -->
                <ellipse cx="40" cy="72" rx="30" ry="3" fill="rgba(0,0,0,0.2)" />
                
                <!-- Two clue givers and guesser -->
                <!-- Left clue giver -->
                <g>
                    <circle cx="25" cy="30" r="10" fill="rgba(123,104,238,0.3)" stroke="white" stroke-width="1.5" />
                    <circle cx="22" cy="28" r="1.5" fill="white" />
                    <circle cx="28" cy="28" r="1.5" fill="white" />
                    <path d="M22,35 C24,37 26,37 28,35" stroke="white" stroke-width="1" fill="none" />
                    <path d="M21,45 C21,40 20,38 25,38 C30,38 29,40 29,45" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                </g>
                
                <!-- Right clue giver -->
                <g>
                    <circle cx="55" cy="30" r="10" fill="rgba(123,104,238,0.3)" stroke="white" stroke-width="1.5" />
                    <circle cx="52" cy="28" r="1.5" fill="white" />
                    <circle cx="58" cy="28" r="1.5" fill="white" />
                    <path d="M52,35 C54,37 56,37 58,35" stroke="white" stroke-width="1" fill="none" />
                    <path d="M51,45 C51,40 50,38 55,38 C60,38 59,40 59,45" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                </g>
                
                <!-- The word -->
                <rect x="30" y="15" width="20" height="10" rx="2" fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="1" />
                <path d="M33,20 L47,20" stroke="white" stroke-width="1" stroke-dasharray="1 1" />
                
                <!-- Guesser (blindfolded) -->
                <g>
                    <circle cx="40" cy="55" r="12" fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="1.5" />
                    <path d="M34,52 L46,52" stroke="white" stroke-width="1.5" />
                    <path d="M34,52 C34,48 46,48 46,52" stroke="white" stroke-width="2" fill="rgba(0,0,0,0.2)" />
                    <path d="M35,60 C37,62 43,62 45,60" stroke="white" stroke-width="1" stroke-linecap="round" />
                </g>
                
                <!-- Speech bubbles connecting people -->
                <path d="M30,25 L35,20" stroke="white" stroke-width="0.8" stroke-dasharray="2 1" />
                <path d="M50,25 L45,20" stroke="white" stroke-width="0.8" stroke-dasharray="2 1" />
                <path d="M37,40 L40,49" stroke="white" stroke-width="0.8" stroke-dasharray="2 1" />
                <path d="M43,40 L40,49" stroke="white" stroke-width="0.8" stroke-dasharray="2 1" />
                
                <!-- Timer -->
                <circle cx="65" cy="55" r="6" fill="none" stroke="white" stroke-width="1" />
                <path d="M65,52 L65,55 L68,55" stroke="white" stroke-width="1" />
                
                <!-- Game controls -->
                <path d="M15,55 L20,50 L25,55 L20,60 Z" fill="rgba(76,175,80,0.5)" stroke="white" stroke-width="0.8" />
                <path d="M18,55 L22,55 M20,53 L20,57" stroke="white" stroke-width="0.8" />
                
                <path d="M15,65 L20,60 L25,65 L20,70 Z" fill="rgba(244,67,54,0.5)" stroke="white" stroke-width="0.8" />
                <path d="M18,65 L22,65" stroke="white" stroke-width="0.8" />
                
                <path d="M60,65 C60,62 70,62 70,65 C70,68 60,68 60,65 Z" fill="rgba(255,152,0,0.5)" stroke="white" stroke-width="0.8" />
                <path d="M62,65 C62,64 68,64 68,65" stroke="white" stroke-width="0.8" />
                <path d="M62,65 C62,66 68,66 68,65" stroke="white" stroke-width="0.8" />
            </svg>`
        },
        {
            id: "timergame",
            displayName: getTranslation('timergame', 'title'),
            catchphrase: getTranslation('timergame', 'catchphrase'),
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2">
                <!-- Shadow -->
                <ellipse cx="40" cy="45" rx="28" ry="5" fill="rgba(0,0,0,0.15)" />
                
                <!-- Clock body with enhanced details -->
                <circle cx="40" cy="40" r="25" fill="rgba(255,255,255,0.05)" />
                <circle cx="40" cy="40" r="24" fill="none" stroke="white" stroke-width="1.5" />
                <circle cx="40" cy="40" r="22" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                
                <!-- Clock face details -->
                <circle cx="40" cy="40" r="2" fill="white" />
                <circle cx="40" cy="40" r="1" fill="rgba(0,0,0,0.3)" />
                
                <!-- Hour markers -->
                <line x1="40" y1="18" x2="40" y2="20" stroke="white" stroke-width="2" stroke-linecap="round" />
                <line x1="40" y1="60" x2="40" y2="62" stroke="white" stroke-width="2" stroke-linecap="round" />
                <line x1="18" y1="40" x2="20" y2="40" stroke="white" stroke-width="2" stroke-linecap="round" />
                <line x1="60" y1="40" x2="62" y2="40" stroke="white" stroke-width="2" stroke-linecap="round" />
                
                <!-- Secondary hour markers -->
                <line x1="29" y1="20" x2="30" y2="22" stroke="white" stroke-width="1" stroke-linecap="round" />
                <line x1="20" y1="29" x2="22" y2="30" stroke="white" stroke-width="1" stroke-linecap="round" />
                <line x1="29" y1="60" x2="30" y2="58" stroke="white" stroke-width="1" stroke-linecap="round" />
                <line x1="20" y1="51" x2="22" y2="50" stroke="white" stroke-width="1" stroke-linecap="round" />
                <line x1="51" y1="20" x2="50" y2="22" stroke="white" stroke-width="1" stroke-linecap="round" />
                <line x1="60" y1="29" x2="58" y2="30" stroke="white" stroke-width="1" stroke-linecap="round" />
                <line x1="51" y1="60" x2="50" y2="58" stroke="white" stroke-width="1" stroke-linecap="round" />
                <line x1="60" y1="51" x2="58" y2="50" stroke="white" stroke-width="1" stroke-linecap="round" />
                
                <!-- Clock hands with detailed styling -->
                <line x1="40" y1="40" x2="40" y2="22" stroke="white" stroke-width="2.5" stroke-linecap="round" />
                <line x1="40" y1="40" x2="52" y2="52" stroke="white" stroke-width="2" stroke-linecap="round" />
                <path d="M40,40 L33,30" stroke="rgba(255,255,255,0.5)" stroke-width="1" stroke-linecap="round" stroke-dasharray="1 1" />
                
                <!-- Clock top -->
                <path d="M36,15 A1,1 0 0,1 44,15" stroke="white" stroke-width="1.5" fill="none" />
                <rect x="39" y="14" width="2" height="3" fill="white" />
                
                <!-- Word bubbles for racing concept -->
                <path d="M15,20 A10,8 0 0,1 10,12 A10,8 0 0,1 20,8 A10,8 0 0,1 25,12 L22,18 L15,20Z" fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="0.8" />
                <path d="M65,27 A7,5 0 0,0 70,22 A7,5 0 0,0 63,18 A7,5 0 0,0 60,22 L61,25 L65,27Z" fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="0.8" />
                
                <!-- Small text representing words -->
                <path d="M14,12 L18,12 M12,14 L17,14" stroke="rgba(255,255,255,0.9)" stroke-width="0.8" stroke-linecap="round" />
                <path d="M64,20 L69,20 M66,23 L68,23" stroke="rgba(255,255,255,0.9)" stroke-width="0.8" stroke-linecap="round" />
                
                <!-- Increment button -->
                <circle cx="65" cy="52" r="8" fill="rgba(105, 177, 110, 0.3)" stroke="white" stroke-width="1.2" />
                <line x1="65" y1="48" x2="65" y2="56" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                <line x1="61" y1="52" x2="69" y2="52" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                
                <!-- Players -->
                <circle cx="25" cy="55" r="5" fill="rgba(255, 107, 136, 0.3)" stroke="white" stroke-width="1" />
                <text x="25" y="57" font-size="6" fill="white" text-anchor="middle" font-family="Arial, sans-serif">P1</text>
                
                <circle cx="15" cy="55" r="5" fill="rgba(255, 107, 136, 0.3)" stroke="white" stroke-width="1" />
                <text x="15" y="57" font-size="6" fill="white" text-anchor="middle" font-family="Arial, sans-serif">P2</text>
                
                <!-- Speech bubble -->
                <path d="M21,45 C17,44 18,38 22,38 C26,38 27,44 23,45 L22,49 Z" fill="rgba(255,255,255,0.1)" stroke="white" stroke-width="0.8" />
                <text x="22" y="42" font-size="4" fill="white" text-anchor="middle" font-family="Arial, sans-serif">Dubito!</text>
            </svg>`
        },
        {
            id: "alphabetgame",
            displayName: getTranslation('alphabetgame', 'title'),
            catchphrase: getTranslation('alphabetgame', 'catchphrase'),
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2">
                <!-- Shadow -->
                <rect x="10" y="69" width="60" height="4" rx="2" fill="rgba(0,0,0,0.2)" />
                
                <!-- Letter blocks with enhanced 3D effect -->
                <g transform="rotate(-5, 15, 15)">
                    <rect x="11" y="12" width="15" height="15" rx="2" fill="rgba(255,255,255,0.25)" stroke="white" />
                    <rect x="12" y="13" width="13" height="13" rx="1" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                    <text x="18.5" y="24" font-size="13" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">A</text>
                </g>
                
                <g transform="rotate(3, 32.5, 15)">
                    <rect x="28.5" y="12" width="15" height="15" rx="2" fill="rgba(255,255,255,0.3)" stroke="white" />
                    <rect x="29.5" y="13" width="13" height="13" rx="1" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                    <text x="36" y="24" font-size="13" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">B</text>
                </g>
                
                <g transform="rotate(-2, 50, 15)">
                    <rect x="46" y="12" width="15" height="15" rx="2" fill="rgba(255,255,255,0.35)" stroke="white" />
                    <rect x="47" y="13" width="13" height="13" rx="1" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                    <text x="53.5" y="24" font-size="13" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">C</text>
                </g>
                
                <g transform="rotate(4, 15, 32.5)">
                    <rect x="11" y="29.5" width="15" height="15" rx="2" fill="rgba(255,255,255,0.4)" stroke="white" />
                    <rect x="12" y="30.5" width="13" height="13" rx="1" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                    <text x="18.5" y="41.5" font-size="12" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">X</text>
                </g>
                
                <g transform="rotate(-3, 32.5, 32.5)">
                    <rect x="28.5" y="29.5" width="15" height="15" rx="2" fill="rgba(255,255,255,0.45)" stroke="white" />
                    <rect x="29.5" y="30.5" width="13" height="13" rx="1" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                    <text x="36" y="41.5" font-size="12" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">Y</text>
                </g>
                
                <g transform="rotate(5, 50, 32.5)">
                    <rect x="46" y="29.5" width="15" height="15" rx="2" fill="rgba(255,255,255,0.5)" stroke="white" />
                    <rect x="47" y="30.5" width="13" height="13" rx="1" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                    <text x="53.5" y="41.5" font-size="12" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">Z</text>
                </g>
                
                <!-- Category connection elements -->
                <path d="M25,65 L55,65" stroke="white" stroke-linecap="round" stroke-width="3" stroke-dasharray="2 4" />
                
                <!-- Word connections to letters -->
                <path d="M18.5,27 C18.5,47 25,50 20,60" stroke="rgba(255,255,255,0.4)" stroke-width="0.6" stroke-dasharray="2 1" />
                <path d="M36,27 C36,37 40,45 40,60" stroke="rgba(255,255,255,0.4)" stroke-width="0.6" stroke-dasharray="2 1" />
                <path d="M53.5,27 C53.5,47 45,50 50,60" stroke="rgba(255,255,255,0.4)" stroke-width="0.6" stroke-dasharray="2 1" />
                <path d="M18.5,44.5 C18.5,52 25,55 25,65" stroke="rgba(255,255,255,0.4)" stroke-width="0.6" stroke-dasharray="2 1" />
                <path d="M36,44.5 C36,55 40,60 40,65" stroke="rgba(255,255,255,0.4)" stroke-width="0.6" stroke-dasharray="2 1" />
                <path d="M53.5,44.5 C53.5,52 45,55 45,65" stroke="rgba(255,255,255,0.4)" stroke-width="0.6" stroke-dasharray="2 1" />
                
                <!-- Category label -->
                <path d="M30,57 L50,57" stroke="rgba(255,255,255,0.8)" stroke-width="0.8" stroke-linecap="round" />
                <text x="40" y="55" font-size="6" fill="white" text-anchor="middle" font-family="Arial, sans-serif">CATEGORIA</text>
            </svg>`
        },
        {
            id: "bluffme",
            displayName: getTranslation('bluffme', 'title'),
            catchphrase: getTranslation('bluffme', 'catchphrase'),
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2">
                <!-- Shadow -->
                <ellipse cx="40" cy="72" rx="30" ry="3" fill="rgba(0,0,0,0.2)" />
                
                <!-- Clock/timer for time element -->
                <circle cx="15" cy="30" r="10" fill="rgba(255,255,255,0.1)" stroke="white" stroke-width="1.5" />
                <circle cx="15" cy="30" r="8" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" />
                <line x1="15" y1="30" x2="15" y2="23" stroke="white" stroke-width="1.2" stroke-linecap="round" />
                <line x1="15" y1="30" x2="19" y2="32" stroke="white" stroke-width="1.2" stroke-linecap="round" />
                
                <!-- Main category card -->
                <rect x="25" y="15" width="40" height="25" rx="2" fill="rgba(106, 90, 205, 0.2)" stroke="white" stroke-width="1.5" />
                <line x1="30" y1="25" x2="60" y2="25" stroke="white" stroke-width="0.8" stroke-dasharray="1 1" />
                <text x="45" y="22" font-size="5" fill="white" text-anchor="middle" font-family="Arial, sans-serif">CATEGORIA</text>
                <text x="45" y="32" font-size="7" fill="white" text-anchor="middle" font-family="Arial, sans-serif">Animali</text>
                
                <!-- Counter box -->
                <rect x="35" y="45" width="25" height="15" rx="2" fill="rgba(78, 216, 224, 0.2)" stroke="white" stroke-width="1.5" />
                <text x="48" y="55" font-size="10" fill="white" text-anchor="middle" font-family="Arial, sans-serif">12</text>
                
                <!-- Increment button -->
                <circle cx="65" cy="52" r="8" fill="rgba(105, 177, 110, 0.3)" stroke="white" stroke-width="1.2" />
                <line x1="65" y1="48" x2="65" y2="56" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                <line x1="61" y1="52" x2="69" y2="52" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                
                <!-- Players -->
                <circle cx="25" cy="55" r="5" fill="rgba(255, 107, 136, 0.3)" stroke="white" stroke-width="1" />
                <text x="25" y="57" font-size="6" fill="white" text-anchor="middle" font-family="Arial, sans-serif">P1</text>
                
                <circle cx="15" cy="55" r="5" fill="rgba(255, 107, 136, 0.3)" stroke="white" stroke-width="1" />
                <text x="15" y="57" font-size="6" fill="white" text-anchor="middle" font-family="Arial, sans-serif">P2</text>
                
                <!-- Speech bubble -->
                <path d="M21,45 C17,44 18,38 22,38 C26,38 27,44 23,45 L22,49 Z" fill="rgba(255,255,255,0.1)" stroke="white" stroke-width="0.8" />
                <text x="22" y="42" font-size="4" fill="white" text-anchor="middle" font-family="Arial, sans-serif">Dubito!</text>
            </svg>`
        },
        {
            id: "quizzy",
            displayName: getTranslation('quizzy', 'title'),
            catchphrase: getTranslation('quizzy', 'catchphrase'),
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2">
                <!-- Shadow -->
                <ellipse cx="40" cy="72" rx="30" ry="3" fill="rgba(0,0,0,0.2)" />
                
                <!-- Quiz card main background -->
                <rect x="15" y="15" width="50" height="35" rx="3" fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="1.2" />
                <rect x="17" y="17" width="46" height="31" rx="2" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" />
                
                <!-- Question area -->
                <rect x="20" y="20" width="40" height="12" rx="2" fill="rgba(106, 90, 205, 0.2)" stroke="white" stroke-width="0.8" />
                <text x="40" y="28" font-size="6" fill="white" text-anchor="middle" font-family="Arial, sans-serif">DOMANDA</text>
                
                <!-- Answer options -->
                <rect x="20" y="36" width="18" height="8" rx="2" fill="rgba(255, 107, 136, 0.3)" stroke="white" stroke-width="0.8" />
                <text x="29" y="41" font-size="5" fill="white" text-anchor="middle" font-family="Arial, sans-serif">A</text>
                
                <rect x="42" y="36" width="18" height="8" rx="2" fill="rgba(105, 177, 110, 0.3)" stroke="white" stroke-width="0.8" />
                <text x="51" y="41" font-size="5" fill="white" text-anchor="middle" font-family="Arial, sans-serif">B</text>
                
                <!-- Timer circle -->
                <circle cx="65" cy="25" r="8" fill="rgba(255,255,255,0.1)" stroke="white" stroke-width="1" />
                <path d="M65,20 L65,25 L68,27" stroke="white" stroke-width="1" stroke-linecap="round" />
                <circle cx="65" cy="25" r="6" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" />
                
                <!-- Category element -->
                <rect x="20" y="55" width="30" height="10" rx="2" fill="rgba(78, 216, 224, 0.2)" stroke="white" stroke-width="1" />
                <text x="35" y="61" font-size="5" fill="white" text-anchor="middle" font-family="Arial, sans-serif">CATEGORIA</text>
                
                <!-- Score display -->
                <rect x="55" y="55" width="15" height="10" rx="2" fill="rgba(255, 193, 7, 0.3)" stroke="white" stroke-width="1" />
                <text x="62.5" y="61.5" font-size="6" fill="white" text-anchor="middle" font-family="Arial, sans-serif">10</text>
                
                <!-- Players indicator -->
                <circle cx="15" cy="60" r="4" fill="rgba(255, 107, 136, 0.3)" stroke="white" stroke-width="0.8" />
                <text x="15" y="62" font-size="5" fill="white" text-anchor="middle" font-family="Arial, sans-serif">1</text>
                
                <!-- Question mark decorative elements -->
                <text x="68" cy="45" y="45" font-size="10" fill="rgba(255,255,255,0.2)" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">?</text>
                <text x="75" cy="55" y="55" font-size="8" fill="rgba(255,255,255,0.15)" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">?</text>
                <text x="60" cy="52" y="52" font-size="12" fill="rgba(255,255,255,0.1)" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">?</text>
            </svg>`
        },
        {
            id: "guessthepic",
            displayName: getTranslation('guessthepic', 'title'),
            catchphrase: getTranslation('guessthepic', 'catchphrase'),
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2">
                <!-- Shadow -->
                <rect x="17" y="17" width="38" height="38" rx="2" fill="rgba(0,0,0,0.2)" />
                
                <!-- Photo frame -->
                <rect x="15" y="15" width="38" height="38" rx="2" fill="rgba(255,255,255,0.15)" />
                <rect x="17" y="17" width="34" height="34" rx="1" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" />
                
                <!-- Photos stack effect -->
                <path d="M53,19 L58,19 L58,53 L19,53" stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="2 1" />
                <path d="M55,17 L60,17 L60,51 L21,51" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" stroke-dasharray="1 1" />
                
                <!-- Photo content -->
                <path d="M20,42 L30,32 L40,42" stroke="white" stroke-linecap="round" />
                <path d="M27,47 L37,38 L45,46" stroke="rgba(255,255,255,0.6)" stroke-linecap="round" />
                <circle cx="24" cy="25" r="3" fill="rgba(255,255,255,0.5)" />
                <circle cx="24" cy="25" r="1.5" fill="rgba(255,255,255,0.8)" />
                
                <!-- Magnifying glass with detailed handle -->
                <circle cx="57" cy="50" r="8" fill="rgba(0,0,0,0.1)" stroke="white" stroke-width="2" />
                <circle cx="57" cy="50" r="6" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
                <line x1="63" y1="56" x2="68" y2="61" stroke="white" stroke-width="3" stroke-linecap="round" />
                <line x1="63" y1="56" x2="68" y2="61" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round" />
                <path d="M69,62 C70,63 72,65 74,63 C76,61 74,60 73,61" stroke="rgba(255,255,255,0.8)" stroke-width="1" />
                
                <!-- Question marks to represent mystery -->
                <text x="33" y="32" font-size="8" fill="rgba(255,255,255,0.7)" text-anchor="middle" font-family="Arial, sans-serif">?</text>
                <text x="28" y="38" font-size="5" fill="rgba(255,255,255,0.5)" text-anchor="middle" font-family="Arial, sans-serif">?</text>
                <text x="39" y="28" font-size="6" fill="rgba(255,255,255,0.6)" text-anchor="middle" font-family="Arial, sans-serif">?</text>
            </svg>`
        },
        {
            id: "tiktakemoji",
            displayName: getTranslation('tiktakemoji', 'title'),
            catchphrase: getTranslation('tiktakemoji', 'catchphrase'),
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="1.5">
                <!-- Light background glow -->
                <circle cx="40" cy="40" r="30" fill="rgba(123,104,238,0.1)" />
                
                <!-- Game board with emoji labels -->
                <rect x="15" y="15" width="50" height="50" rx="3" fill="none" stroke="white" stroke-width="1.5" />
                
                <!-- Grid lines -->
                <line x1="32" y1="15" x2="32" y2="65" stroke="white" stroke-width="1" />
                <line x1="48" y1="15" x2="48" y2="65" stroke="white" stroke-width="1" />
                <line x1="15" y1="32" x2="65" y2="32" stroke="white" stroke-width="1" />
                <line x1="15" y1="48" x2="65" y2="48" stroke="white" stroke-width="1" />
                
                <!-- Emoji labels for rows and columns -->
                <circle cx="10" cy="24" r="3" fill="none" stroke="white" stroke-width="0.8" />
                <text x="10" y="26" font-size="4" text-anchor="middle" fill="white">🍕</text>
                
                <circle cx="10" cy="40" r="3" fill="none" stroke="white" stroke-width="0.8" />
                <text x="10" y="42" font-size="4" text-anchor="middle" fill="white">🐶</text>
                
                <circle cx="10" cy="56" r="3" fill="none" stroke="white" stroke-width="0.8" />
                <text x="10" y="58" font-size="4" text-anchor="middle" fill="white">👻</text>
                
                <circle cx="24" cy="10" r="3" fill="none" stroke="white" stroke-width="0.8" />
                <text x="24" y="12" font-size="4" text-anchor="middle" fill="white">❤️</text>
                
                <circle cx="40" cy="10" r="3" fill="none" stroke="white" stroke-width="0.8" />
                <text x="40" y="12" font-size="4" text-anchor="middle" fill="white">🦴</text>
                
                <circle cx="56" cy="10" r="3" fill="none" stroke="white" stroke-width="0.8" />
                <text x="56" y="12" font-size="4" text-anchor="middle" fill="white">🎉</text>
                
                <!-- Player tokens and emojis -->
                <circle cx="24" cy="24" r="6" fill="none" stroke="rgba(255,0,0,0.7)" stroke-width="2" />
                <text x="24" y="26" font-size="6" text-anchor="middle" fill="white">😍</text>
                
                <circle cx="40" cy="24" r="6" fill="none" stroke="rgba(0,0,255,0.7)" stroke-width="2" />
                <text x="40" y="26" font-size="6" text-anchor="middle" fill="white">🦮</text>
                
                <circle cx="56" cy="40" r="6" fill="none" stroke="rgba(255,0,0,0.7)" stroke-width="2" />
                <text x="56" y="42" font-size="6" text-anchor="middle" fill="white">🎃</text>
                
                <circle cx="40" cy="56" r="6" fill="none" stroke="rgba(0,0,255,0.7)" stroke-width="2" />
                <text x="40" y="58" font-size="6" text-anchor="middle" fill="white">😱</text>
                
                <!-- Diagonal win line -->
                <line x1="18" y1="18" x2="62" y2="62" stroke="rgba(255,215,0,0.6)" stroke-width="2" stroke-dasharray="3 2" />
                
                <!-- Selection area at empty spot -->
                <rect x="48" y="48" width="16" height="16" fill="rgba(255,255,255,0.1)" stroke="white" stroke-dasharray="2 1" />
                <circle cx="56" cy="56" r="2" fill="rgba(255,255,255,0.5)" />
                <path d="M54,54 L58,58 M58,54 L54,58" stroke="rgba(255,255,255,0.5)" stroke-width="0.5" />
                
                <!-- Emoji selection popup -->
                <rect x="50" y="70" width="20" height="8" rx="2" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="0.8" />
                <text x="55" y="74" font-size="4" fill="white">💀 👻 😱</text>
                <path d="M56,65 L56,70" stroke="white" stroke-width="0.5" stroke-dasharray="1 1" />
            </svg>`
        }
    ];
    
    // Select the container element
    const gamesContainer = document.getElementById('gamesContainer');
    
    // Function to capitalize first letter and handle formatting
    const formatGameName = (name) => {
        // Convert camelCase or snake_case to space-separated words
        const formatted = name
            .replace(/([A-Z])/g, ' $1') // Handle camelCase
            .replace(/_/g, ' '); // Handle snake_case
        
        // Capitalize the first letter of each word
        return formatted
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    
    // Gradient classes for variety
    const gradientClasses = [
        'gradient-1', 'gradient-2', 'gradient-3', 'gradient-4',
        'gradient-5', 'gradient-6', 'gradient-7', 'gradient-8'
    ];
    
    // Add CSS for icon styling
    const style = document.createElement('style');
    style.textContent = `
        /* Create a flexbox layout for content and icon */
        .game-card {
            display: flex;
            flex-direction: row;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
        }
        
        /* Content container for title, catchphrase and button */
        .card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-right: 15px;
            z-index: 2;
        }
        
        /* Icon container styles */
        .game-icon-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            z-index: 1;
            position: relative;
        }
        
        .game-icon {
            width: 110px;
            height: 110px;
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
            transition: transform 0.3s ease, filter 0.3s ease;
            margin-bottom: 8px;
        }
        
        .game-card:hover .game-icon {
            transform: scale(1.1);
            filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.6));
        }
        
        /* Adjust title margins */
        .game-card h3 {
            margin-bottom: 0.5rem;
        }
        
        /* Special case for coming soon card */
        .coming-soon-card {
            justify-content: center;
            align-items: center;
        }
        
        .coming-soon-card .card-content {
            text-align: center;
            margin-right: 0;
        }
        
        .coming-soon-card .game-icon-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.2;
        }
        
        .coming-soon-card .game-icon {
            width: 150px;
            height: 150px;
        }
        
        /* Make sure the play button stays at the bottom */
        .play-button {
            margin-top: 1rem;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 480px) {
            .game-icon {
                width: 90px;
                height: 90px;
                margin-bottom: 6px;
            }
            
            .card-content {
                margin-right: 10px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Create and append game cards
    games.forEach((game, index) => {
        // Create card element
        const card = document.createElement('div');
        card.className = `game-card ${gradientClasses[index % gradientClasses.length]}`;
        
        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'card-content';
        
        // Create game title using the display name if available, otherwise format the ID
        const title = document.createElement('h3');
        title.textContent = game.displayName || formatGameName(game.id);
        
        // Create catchphrase
        const catchphrase = document.createElement('p');
        catchphrase.className = 'game-catchphrase';
        catchphrase.textContent = game.catchphrase;
        
        // Create play button as a button element
        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.textContent = getTranslation('play');
        
        // Folder name mapping for case sensitivity issues
        const folderNameMap = {
            'bluffme': 'BluffMe',
            // Add any other case-sensitive folder mappings here if needed
        };
        
        // Add click event for navigation
        playButton.addEventListener('click', () => {
            // Use folder name mapping if available, otherwise use game.id
            const folderName = folderNameMap[game.id] || game.id;
            window.location.href = `${folderName}/index.html`;
        });
        
        // Add title, catchphrase and button to content container
        contentContainer.appendChild(title);
        contentContainer.appendChild(catchphrase);
        contentContainer.appendChild(playButton);
        
        // Create icon container and add SVG
        const iconContainer = document.createElement('div');
        iconContainer.className = 'game-icon-container';
        iconContainer.innerHTML = game.iconSvg;
        const iconElement = iconContainer.querySelector('svg');
        iconElement.classList.add('game-icon');
        
        // Add "Italian only" text for guessthepic game
        if (game.id === "guessthepic") {
            const italianOnlyText = document.createElement('div');
            italianOnlyText.className = 'italian-only-text';
            italianOnlyText.textContent = getTranslation('italianOnly');
            iconContainer.appendChild(italianOnlyText);
        }
        
        // Append content and icon containers to card
        card.appendChild(contentContainer);
        card.appendChild(iconContainer);
        
        // Append card to container
        gamesContainer.appendChild(card);
    });
    
    // Add "Coming Soon" card
    const comingSoonCard = document.createElement('div');
    comingSoonCard.className = 'game-card coming-soon-card';
    
    // Create content container
    const comingSoonContentContainer = document.createElement('div');
    comingSoonContentContainer.className = 'card-content';
    
    const comingSoonTitle = document.createElement('h3');
    comingSoonTitle.textContent = getTranslation('comingSoon');
    
    const comingSoonCatchphrase = document.createElement('p');
    comingSoonCatchphrase.className = 'game-catchphrase';
    comingSoonCatchphrase.textContent = getTranslation('newGamesComingSoon');
    
    // Create icon for Coming Soon card
    const comingSoonIconContainer = document.createElement('div');
    comingSoonIconContainer.className = 'game-icon-container';
    
    // Append elements to containers
    comingSoonContentContainer.appendChild(comingSoonTitle);
    comingSoonContentContainer.appendChild(comingSoonCatchphrase);
    comingSoonCard.appendChild(comingSoonContentContainer);
    comingSoonCard.appendChild(comingSoonIconContainer);
    
    // Append Coming Soon card to container
    gamesContainer.appendChild(comingSoonCard);

    // Add CSS for Italian only text
    const styleElement = document.querySelector('style');
    styleElement.textContent += `
        .game-icon-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            z-index: 1;
            position: relative;
        }
        
        .italian-only-text {
            font-size: 11px;
            color: white;
            text-align: center;
            font-weight: 600;
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
            transition: all 0.3s ease;
            padding: 3px 8px;
            border: 1px solid rgba(255, 255, 255, 0.4);
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            letter-spacing: 0.5px;
        }
        
        .game-card:hover .italian-only-text {
            filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.6));
            background-color: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
        }
        
        @media (max-width: 480px) {
            .game-icon {
                width: 90px;
                height: 90px;
                margin-bottom: 6px;
            }
            
            .italian-only-text {
                font-size: 9px;
                padding: 2px 6px;
            }
        }
    `;
}); 