function initTournamentButton() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'tournament') {
        const button = document.createElement('button');
        button.id = 'tournamentReturn';
        button.className = 'tournament-return-button';

        // Detect language
        const userLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        const isItalian = userLang.startsWith('it');

        button.innerHTML = `
            <span class="btn-icon">🏆</span>
            <span>${isItalian ? 'Assegna punti' : 'Score points'}</span>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .tournament-return-button {
                position: fixed;
                top: 10px;
                right: 10px;
                background-color: rgba(123, 104, 238, 0.2);
                color: white;
                border: none;
                border-radius: 5px;
                padding: 8px 12px;
                cursor: pointer;
                font-size: 14px;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: all 0.3s ease;
            }

            .tournament-return-button:hover {
                background-color: rgba(123, 104, 238, 0.4);
                transform: translateY(-2px);
            }

            .tournament-return-button .btn-icon {
                font-size: 16px;
                line-height: 1;
            }

            /* Tournament confirm dialog */
            .tournament-confirm-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.25s ease, visibility 0.25s ease;
            }

            .tournament-confirm-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .tournament-confirm-dialog {
                background: linear-gradient(145deg, #1a1a2e, #16213e);
                border: 1px solid rgba(123, 104, 238, 0.3);
                border-radius: 16px;
                padding: 30px 25px;
                max-width: 360px;
                width: 90%;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(123, 104, 238, 0.15);
                transform: scale(0.85);
                transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            .tournament-confirm-overlay.active .tournament-confirm-dialog {
                transform: scale(1);
            }

            .tournament-confirm-icon {
                font-size: 2.5em;
                margin-bottom: 12px;
            }

            .tournament-confirm-title {
                color: #fff;
                font-size: 1.2em;
                font-weight: 600;
                margin-bottom: 8px;
            }

            .tournament-confirm-message {
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.9em;
                line-height: 1.5;
                margin-bottom: 24px;
            }

            .tournament-confirm-buttons {
                display: flex;
                gap: 12px;
            }

            .tournament-confirm-btn {
                flex: 1;
                padding: 12px 16px;
                border: none;
                border-radius: 10px;
                font-size: 0.95em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                font-family: inherit;
            }

            .tournament-confirm-btn-cancel {
                background: rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.15);
            }

            .tournament-confirm-btn-cancel:hover {
                background: rgba(255, 255, 255, 0.18);
                color: #fff;
            }

            .tournament-confirm-btn-confirm {
                background: linear-gradient(135deg, #6a5acd, #9370db);
                color: white;
                box-shadow: 0 4px 12px rgba(123, 104, 238, 0.35);
            }

            .tournament-confirm-btn-confirm:hover {
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(123, 104, 238, 0.5);
            }
        `;
        document.head.appendChild(style);

        // Create confirm dialog
        const overlay = document.createElement('div');
        overlay.className = 'tournament-confirm-overlay';
        overlay.innerHTML = `
            <div class="tournament-confirm-dialog">
                <div class="tournament-confirm-icon">🏆</div>
                <div class="tournament-confirm-title">${isItalian ? 'Partita finita?' : 'Game finished?'}</div>
                <div class="tournament-confirm-message">${isItalian ? 'Vai all\'assegnazione dei punti e poi alla prossima partita del torneo.' : 'Go to score assignment and then the next tournament game.'}</div>
                <div class="tournament-confirm-buttons">
                    <button class="tournament-confirm-btn tournament-confirm-btn-cancel" id="tournamentConfirmCancel">
                        ${isItalian ? 'Non ancora' : 'Not yet'}
                    </button>
                    <button class="tournament-confirm-btn tournament-confirm-btn-confirm" id="tournamentConfirmYes">
                        ${isItalian ? 'Assegna punti' : 'Score points'}
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Close dialog on cancel or overlay click
        const closeDialog = () => overlay.classList.remove('active');
        document.getElementById('tournamentConfirmCancel').addEventListener('click', closeDialog);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeDialog();
        });

        // Confirm returns to tournament
        document.getElementById('tournamentConfirmYes').addEventListener('click', () => {
            window.location.href = '../tournament/index.html?return=true';
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closeDialog();
            }
        });

        // Button opens the confirm dialog
        button.onclick = () => {
            overlay.classList.add('active');
        };

        // Add to document
        document.body.appendChild(button);
    }
}

document.addEventListener('DOMContentLoaded', initTournamentButton);
