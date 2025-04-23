document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Common
    const startMenu = document.getElementById('startMenu');
    const startButton = document.getElementById('startButton');
    
    // DOM Elements - 2 Player Mode
    const gameScreen2p = document.getElementById('gameScreen2p');
    const resetButton2p = document.getElementById('resetButton2p');
    const mainMenuButton2p = document.getElementById('mainMenuButton2p');
    const categoryDisplay2p = document.getElementById('categoryDisplay2p');
    const categoryText2p = document.getElementById('category2p');
    
    const player1Button = document.getElementById('button1');
    const player2Button = document.getElementById('button2');
    const time1Element = document.getElementById('time1');
    const time2Element = document.getElementById('time2');
    const status1 = document.getElementById('status1');
    const status2 = document.getElementById('status2');
    
    // Turn indicators - 2 Player
    const indicator1 = document.getElementById('indicator1');
    const indicator2 = document.getElementById('indicator2');
    
    // Game over messages - 2 Player
    const gameOverPlayer1 = document.getElementById('gameOverPlayer1');
    const gameOverPlayer2 = document.getElementById('gameOverPlayer2');
    
    // DOM Elements - 3 Player Mode
    const gameScreen3p = document.getElementById('gameScreen3p');
    const resetButton3p = document.getElementById('resetButton3p');
    const mainMenuButton3p = document.getElementById('mainMenuButton3p');
    const categoryDisplay3p = document.getElementById('categoryDisplay3p');
    const categoryText3p = document.getElementById('category3p');
    
    const player1Button3p = document.getElementById('button1_3p');
    const player2Button3p = document.getElementById('button2_3p');
    const player3Button3p = document.getElementById('button3_3p');
    const time1Element3p = document.getElementById('time1_3p');
    const time2Element3p = document.getElementById('time2_3p');
    const time3Element3p = document.getElementById('time3_3p');
    const status1_3p = document.getElementById('status1_3p');
    const status2_3p = document.getElementById('status2_3p');
    const status3_3p = document.getElementById('status3_3p');
    
    // Turn indicators - 3 Player
    const indicator1_3p = document.getElementById('indicator1_3p');
    const indicator2_3p = document.getElementById('indicator2_3p');
    const indicator3_3p = document.getElementById('indicator3_3p');
    
    // Game over messages - 3 Player
    const gameOverPlayer1_3p = document.getElementById('gameOverPlayer1_3p');
    const gameOverPlayer2_3p = document.getElementById('gameOverPlayer2_3p');
    const gameOverPlayer3_3p = document.getElementById('gameOverPlayer3_3p');
    
    // DOM Elements - 4 Player Mode
    const gameScreen4p = document.getElementById('gameScreen4p');
    const resetButton4p = document.getElementById('resetButton4p');
    const mainMenuButton4p = document.getElementById('mainMenuButton4p');
    const categoryDisplay4p = document.getElementById('categoryDisplay4p');
    const categoryText4p = document.getElementById('category4p');
    
    const player1Button4p = document.getElementById('button1_4p');
    const player2Button4p = document.getElementById('button2_4p');
    const player3Button4p = document.getElementById('button3_4p');
    const player4Button4p = document.getElementById('button4_4p');
    const time1Element4p = document.getElementById('time1_4p');
    const time2Element4p = document.getElementById('time2_4p');
    const time3Element4p = document.getElementById('time3_4p');
    const time4Element4p = document.getElementById('time4_4p');
    const status1_4p = document.getElementById('status1_4p');
    const status2_4p = document.getElementById('status2_4p');
    const status3_4p = document.getElementById('status3_4p');
    const status4_4p = document.getElementById('status4_4p');
    
    // Turn indicators - 4 Player
    const indicator1_4p = document.getElementById('indicator1_4p');
    const indicator2_4p = document.getElementById('indicator2_4p');
    const indicator3_4p = document.getElementById('indicator3_4p');
    const indicator4_4p = document.getElementById('indicator4_4p');
    
    // Game over messages - 4 Player
    const gameOverPlayer1_4p = document.getElementById('gameOverPlayer1_4p');
    const gameOverPlayer2_4p = document.getElementById('gameOverPlayer2_4p');
    const gameOverPlayer3_4p = document.getElementById('gameOverPlayer3_4p');
    const gameOverPlayer4_4p = document.getElementById('gameOverPlayer4_4p');
    
    // Menu button elements
    const menuButton2p = document.getElementById('menuButton2p');
    const menuButton3p = document.getElementById('menuButton3p');
    const menuButton4p = document.getElementById('menuButton4p');
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');
    
    // Button selections for game settings
    const modeButtons = document.querySelectorAll('[data-mode]');
    const timeButtons = document.querySelectorAll('[data-time]');
    const playerButtons = document.querySelectorAll('[data-players]');
    
    // Game Settings
    let gameSettings = {
        playerCount: 2,
        mode: 'timer',
        initialTime: 60,
        categories: []
    };
    
    // Game State - 2 Player Mode
    let gameState2p = {
        isGameStarted: false,
        isGameOver: false,
        activePlayer: null,
        player1Time: 0,
        player2Time: 0,
        lastUpdateTime: 0
    };
    
    // Game State - 3 Player Mode
    let gameState3p = {
        isGameStarted: false,
        isGameOver: false,
        activePlayer: null,
        player1Time: 0,
        player2Time: 0,
        player3Time: 0,
        lastUpdateTime: 0,
        eliminatedPlayers: [],
        placementOrder: []
    };
    
    // Game State - 4 Player Mode
    let gameState4p = {
        isGameStarted: false,
        isGameOver: false,
        activePlayer: null,
        player1Time: 0,
        player2Time: 0,
        player3Time: 0,
        player4Time: 0,
        lastUpdateTime: 0,
        eliminatedPlayers: [],
        placementOrder: []
    };
    
    // Current active game screen and state references
    let currentGameScreen = null;
    let currentGameState = null;
    
    // Load categories from file
    async function loadCategories() {
        try {
            // Get user language and determine which file to load
            const lang = getUserLanguage();
            const categoryFile = lang === 'en' ? 'categories.txt' : 'categorie.txt';
            
            const response = await fetch(categoryFile);
            const text = await response.text();
            gameSettings.categories = text.split('\n').filter(line => line.trim() !== '');
        } catch (error) {
            console.error('Failed to load categories:', error);
            gameSettings.categories = ['Colors', 'Animals', 'Countries', 'Food', 'Sports'];
        }
    }
    
    // Format time as MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainderSeconds.toString().padStart(2, '0')}`;
    }
    
    // Update time displays
    function updateTimeDisplay() {
        time1Element.textContent = formatTime(gameState2p.player1Time);
        time2Element.textContent = formatTime(gameState2p.player2Time);
        
        time1Element3p.textContent = formatTime(gameState3p.player1Time);
        time2Element3p.textContent = formatTime(gameState3p.player2Time);
        time3Element3p.textContent = formatTime(gameState3p.player3Time);
        
        time1Element4p.textContent = formatTime(gameState4p.player1Time);
        time2Element4p.textContent = formatTime(gameState4p.player2Time);
        time3Element4p.textContent = formatTime(gameState4p.player3Time);
        time4Element4p.textContent = formatTime(gameState4p.player4Time);
    }
    
    // Update turn indicators and button states
    function updateTurnIndicators() {
        // Reset all indicators and button classes
        indicator1.classList.remove('visible');
        indicator2.classList.remove('visible');
        indicator1_3p.classList.remove('visible');
        indicator2_3p.classList.remove('visible');
        indicator3_3p.classList.remove('visible');
        indicator1_4p.classList.remove('visible');
        indicator2_4p.classList.remove('visible');
        indicator3_4p.classList.remove('visible');
        indicator4_4p.classList.remove('visible');
        
        player1Button.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        player2Button.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        player1Button3p.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        player2Button3p.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        player3Button3p.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        player1Button4p.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        player2Button4p.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        player3Button4p.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        player4Button4p.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        
        if (!gameState2p.isGameStarted) {
            // Game hasn't started - both buttons are in "ready" state
            player1Button.classList.add('ready-turn');
            player2Button.classList.add('ready-turn');
        } else if (!gameState2p.isGameOver) {
            // Game is in progress
            if (gameState2p.activePlayer === 1) {
                // Player 1's turn - show active state
                player1Button.classList.add('active-turn');
                player2Button.classList.add('inactive-turn');
                indicator1.classList.add('visible');
            } else {
                // Player 2's turn - show active state
                player1Button.classList.add('inactive-turn');
                player2Button.classList.add('active-turn');
                indicator2.classList.add('visible');
            }
        }
        
        if (!gameState3p.isGameStarted) {
            // Game hasn't started - all buttons are in "ready" state
            player1Button3p.classList.add('ready-turn');
            player2Button3p.classList.add('ready-turn');
            player3Button3p.classList.add('ready-turn');
        } else if (!gameState3p.isGameOver) {
            // Game is in progress - In 3-player mode, the active player's timer is increasing
            if (gameState3p.activePlayer === 1) {
                // Player 1's timer is increasing (button should look inactive actually)
                player1Button3p.classList.add('inactive-turn');
                
                // Players 2 and 3 timers are decreasing (their buttons should look active)
                if (!gameState3p.eliminatedPlayers.includes(2)) {
                    player2Button3p.classList.add('active-turn');
                    indicator2_3p.classList.add('visible');
                }
                if (!gameState3p.eliminatedPlayers.includes(3)) {
                    player3Button3p.classList.add('active-turn');
                    indicator3_3p.classList.add('visible');
                }
            } else if (gameState3p.activePlayer === 2) {
                // Player 2 is active (button should look inactive)
                player2Button3p.classList.add('inactive-turn');
                
                // Players 1 and 3 timers are decreasing (their buttons should look active)
                if (!gameState3p.eliminatedPlayers.includes(1)) {
                    player1Button3p.classList.add('active-turn');
                    indicator1_3p.classList.add('visible');
                }
                if (!gameState3p.eliminatedPlayers.includes(3)) {
                    player3Button3p.classList.add('active-turn');
                    indicator3_3p.classList.add('visible');
                }
            } else if (gameState3p.activePlayer === 3) {
                // Player 3 is active (button should look inactive)
                player3Button3p.classList.add('inactive-turn');
                
                // Players 1 and 2 timers are decreasing (their buttons should look active)
                if (!gameState3p.eliminatedPlayers.includes(1)) {
                    player1Button3p.classList.add('active-turn');
                    indicator1_3p.classList.add('visible');
                }
                if (!gameState3p.eliminatedPlayers.includes(2)) {
                    player2Button3p.classList.add('active-turn');
                    indicator2_3p.classList.add('visible');
                }
            }
        }
        
        if (!gameState4p.isGameStarted) {
            // Game hasn't started - all buttons are in "ready" state
            player1Button4p.classList.add('ready-turn');
            player2Button4p.classList.add('ready-turn');
            player3Button4p.classList.add('ready-turn');
            player4Button4p.classList.add('ready-turn');
        } else if (!gameState4p.isGameOver) {
            // Game is in progress - In 4-player mode, the active player's timer is increasing
            if (gameState4p.activePlayer === 1) {
                // Player 1's timer is increasing (button should look inactive)
                player1Button4p.classList.add('inactive-turn');
                
                // Other players' timers are decreasing (their buttons should look active)
                if (!gameState4p.eliminatedPlayers.includes(2)) {
                    player2Button4p.classList.add('active-turn');
                    indicator2_4p.classList.add('visible');
                }
                if (!gameState4p.eliminatedPlayers.includes(3)) {
                    player3Button4p.classList.add('active-turn');
                    indicator3_4p.classList.add('visible');
                }
                if (!gameState4p.eliminatedPlayers.includes(4)) {
                    player4Button4p.classList.add('active-turn');
                    indicator4_4p.classList.add('visible');
                }
            } else if (gameState4p.activePlayer === 2) {
                // Player 2 is active (button should look inactive)
                player2Button4p.classList.add('inactive-turn');
                
                // Other players' timers are decreasing (their buttons should look active)
                if (!gameState4p.eliminatedPlayers.includes(1)) {
                    player1Button4p.classList.add('active-turn');
                    indicator1_4p.classList.add('visible');
                }
                if (!gameState4p.eliminatedPlayers.includes(3)) {
                    player3Button4p.classList.add('active-turn');
                    indicator3_4p.classList.add('visible');
                }
                if (!gameState4p.eliminatedPlayers.includes(4)) {
                    player4Button4p.classList.add('active-turn');
                    indicator4_4p.classList.add('visible');
                }
            } else if (gameState4p.activePlayer === 3) {
                // Player 3 is active (button should look inactive)
                player3Button4p.classList.add('inactive-turn');
                
                // Other players' timers are decreasing (their buttons should look active)
                if (!gameState4p.eliminatedPlayers.includes(1)) {
                    player1Button4p.classList.add('active-turn');
                    indicator1_4p.classList.add('visible');
                }
                if (!gameState4p.eliminatedPlayers.includes(2)) {
                    player2Button4p.classList.add('active-turn');
                    indicator2_4p.classList.add('visible');
                }
                if (!gameState4p.eliminatedPlayers.includes(4)) {
                    player4Button4p.classList.add('active-turn');
                    indicator4_4p.classList.add('visible');
                }
            } else if (gameState4p.activePlayer === 4) {
                // Player 4 is active (button should look inactive)
                player4Button4p.classList.add('inactive-turn');
                
                // Other players' timers are decreasing (their buttons should look active)
                if (!gameState4p.eliminatedPlayers.includes(1)) {
                    player1Button4p.classList.add('active-turn');
                    indicator1_4p.classList.add('visible');
                }
                if (!gameState4p.eliminatedPlayers.includes(2)) {
                    player2Button4p.classList.add('active-turn');
                    indicator2_4p.classList.add('visible');
                }
                if (!gameState4p.eliminatedPlayers.includes(3)) {
                    player3Button4p.classList.add('active-turn');
                    indicator3_4p.classList.add('visible');
                }
            }
        }
    }
    
    // Game timer logic
    let timerInterval;
    
    function startTimer() {
        if (gameSettings.playerCount === 2) {
            gameState2p.lastUpdateTime = Date.now();
        } else if (gameSettings.playerCount === 3) {
            gameState3p.lastUpdateTime = Date.now();
        } else if (gameSettings.playerCount === 4) {
            gameState4p.lastUpdateTime = Date.now();
        }
        
        timerInterval = setInterval(() => {
            const now = Date.now();
            
            if (gameSettings.playerCount === 2) {
                // 2-Player mode timer logic
                const deltaTime = (now - gameState2p.lastUpdateTime) / 1000;
                gameState2p.lastUpdateTime = now;
                
                if (gameState2p.activePlayer === 1) {
                    // Player 1 is active (losing time), Player 2 is gaining time
                    gameState2p.player1Time = Math.max(0, gameState2p.player1Time - deltaTime);
                    gameState2p.player2Time = Math.min(gameSettings.initialTime * 2, gameState2p.player2Time + deltaTime);
                    
                    // Check if Player 1 lost
                    if (gameState2p.player1Time <= 0) {
                        endGame(2);
                    }
                } else if (gameState2p.activePlayer === 2) {
                    // Player 2 is active (losing time), Player 1 is gaining time
                    gameState2p.player2Time = Math.max(0, gameState2p.player2Time - deltaTime);
                    gameState2p.player1Time = Math.min(gameSettings.initialTime * 2, gameState2p.player1Time + deltaTime);
                    
                    // Check if Player 2 lost
                    if (gameState2p.player2Time <= 0) {
                        endGame(1);
                    }
                }
            } else if (gameSettings.playerCount === 3) {
                // 3-Player mode timer logic
                const deltaTime = (now - gameState3p.lastUpdateTime) / 1000;
                gameState3p.lastUpdateTime = now;
                
                if (gameState3p.isGameOver) return;
                
                // In 3-player mode:
                // - The active player's timer is INCREASING
                // - The other players' timers are DECREASING
                
                const activePlayers = [1, 2, 3].filter(p => !gameState3p.eliminatedPlayers.includes(p));
                
                if (gameState3p.activePlayer === 1) {
                    // Player 1 is active (GAINING time)
                    gameState3p.player1Time = Math.min(gameSettings.initialTime * 2, gameState3p.player1Time + deltaTime);
                    
                    // Players 2 and 3 are LOSING time
                    if (!gameState3p.eliminatedPlayers.includes(2)) {
                        gameState3p.player2Time = Math.max(0, gameState3p.player2Time - deltaTime);
                        // Check if Player 2 is eliminated
                        if (gameState3p.player2Time <= 0) {
                            eliminatePlayer3p(2);
                        }
                    }
                    
                    if (!gameState3p.eliminatedPlayers.includes(3)) {
                        gameState3p.player3Time = Math.max(0, gameState3p.player3Time - deltaTime);
                        // Check if Player 3 is eliminated
                        if (gameState3p.player3Time <= 0) {
                            eliminatePlayer3p(3);
                        }
                    }
                } else if (gameState3p.activePlayer === 2) {
                    // Player 2 is active (GAINING time)
                    gameState3p.player2Time = Math.min(gameSettings.initialTime * 2, gameState3p.player2Time + deltaTime);
                    
                    // Players 1 and 3 timers are decreasing (their buttons should look active)
                    if (!gameState3p.eliminatedPlayers.includes(1)) {
                        gameState3p.player1Time = Math.max(0, gameState3p.player1Time - deltaTime);
                        // Check if Player 1 is eliminated
                        if (gameState3p.player1Time <= 0) {
                            eliminatePlayer3p(1);
                        }
                    }
                    
                    if (!gameState3p.eliminatedPlayers.includes(3)) {
                        gameState3p.player3Time = Math.max(0, gameState3p.player3Time - deltaTime);
                        // Check if Player 3 is eliminated
                        if (gameState3p.player3Time <= 0) {
                            eliminatePlayer3p(3);
                        }
                    }
                } else if (gameState3p.activePlayer === 3) {
                    // Player 3 is active (GAINING time)
                    gameState3p.player3Time = Math.min(gameSettings.initialTime * 2, gameState3p.player3Time + deltaTime);
                    
                    // Players 1 and 2 timers are decreasing (their buttons should look active)
                    if (!gameState3p.eliminatedPlayers.includes(1)) {
                        gameState3p.player1Time = Math.max(0, gameState3p.player1Time - deltaTime);
                        // Check if Player 1 is eliminated
                        if (gameState3p.player1Time <= 0) {
                            eliminatePlayer3p(1);
                        }
                    }
                    
                    if (!gameState3p.eliminatedPlayers.includes(2)) {
                        gameState3p.player2Time = Math.max(0, gameState3p.player2Time - deltaTime);
                        // Check if Player 2 is eliminated
                        if (gameState3p.player2Time <= 0) {
                            eliminatePlayer3p(2);
                        }
                    }
                }
            } else if (gameSettings.playerCount === 4) {
                // 4-Player mode timer logic
                const deltaTime = (now - gameState4p.lastUpdateTime) / 1000;
                gameState4p.lastUpdateTime = now;
                
                if (gameState4p.isGameOver) return;
                
                // In 4-player mode:
                // - The active player's timer is INCREASING
                // - The other players' timers are DECREASING
                
                const activePlayers = [1, 2, 3, 4].filter(p => !gameState4p.eliminatedPlayers.includes(p));
                
                if (gameState4p.activePlayer === 1) {
                    // Player 1 is active (GAINING time)
                    gameState4p.player1Time = Math.min(gameSettings.initialTime * 2, gameState4p.player1Time + deltaTime);
                    
                    // Check other players
                    if (!gameState4p.eliminatedPlayers.includes(2)) {
                        gameState4p.player2Time = Math.max(0, gameState4p.player2Time - deltaTime);
                        if (gameState4p.player2Time <= 0) {
                            eliminatePlayer4p(2);
                        }
                    }
                    
                    if (!gameState4p.eliminatedPlayers.includes(3)) {
                        gameState4p.player3Time = Math.max(0, gameState4p.player3Time - deltaTime);
                        if (gameState4p.player3Time <= 0) {
                            eliminatePlayer4p(3);
                        }
                    }
                    
                    if (!gameState4p.eliminatedPlayers.includes(4)) {
                        gameState4p.player4Time = Math.max(0, gameState4p.player4Time - deltaTime);
                        if (gameState4p.player4Time <= 0) {
                            eliminatePlayer4p(4);
                        }
                    }
                } else if (gameState4p.activePlayer === 2) {
                    // Player 2 is active (GAINING time)
                    gameState4p.player2Time = Math.min(gameSettings.initialTime * 2, gameState4p.player2Time + deltaTime);
                    
                    // Check other players
                    if (!gameState4p.eliminatedPlayers.includes(1)) {
                        gameState4p.player1Time = Math.max(0, gameState4p.player1Time - deltaTime);
                        if (gameState4p.player1Time <= 0) {
                            eliminatePlayer4p(1);
                        }
                    }
                    
                    if (!gameState4p.eliminatedPlayers.includes(3)) {
                        gameState4p.player3Time = Math.max(0, gameState4p.player3Time - deltaTime);
                        if (gameState4p.player3Time <= 0) {
                            eliminatePlayer4p(3);
                        }
                    }
                    
                    if (!gameState4p.eliminatedPlayers.includes(4)) {
                        gameState4p.player4Time = Math.max(0, gameState4p.player4Time - deltaTime);
                        if (gameState4p.player4Time <= 0) {
                            eliminatePlayer4p(4);
                        }
                    }
                } else if (gameState4p.activePlayer === 3) {
                    // Player 3 is active (GAINING time)
                    gameState4p.player3Time = Math.min(gameSettings.initialTime * 2, gameState4p.player3Time + deltaTime);
                    
                    // Check other players
                    if (!gameState4p.eliminatedPlayers.includes(1)) {
                        gameState4p.player1Time = Math.max(0, gameState4p.player1Time - deltaTime);
                        if (gameState4p.player1Time <= 0) {
                            eliminatePlayer4p(1);
                        }
                    }
                    
                    if (!gameState4p.eliminatedPlayers.includes(2)) {
                        gameState4p.player2Time = Math.max(0, gameState4p.player2Time - deltaTime);
                        if (gameState4p.player2Time <= 0) {
                            eliminatePlayer4p(2);
                        }
                    }
                    
                    if (!gameState4p.eliminatedPlayers.includes(4)) {
                        gameState4p.player4Time = Math.max(0, gameState4p.player4Time - deltaTime);
                        if (gameState4p.player4Time <= 0) {
                            eliminatePlayer4p(4);
                        }
                    }
                } else if (gameState4p.activePlayer === 4) {
                    // Player 4 is active (GAINING time)
                    gameState4p.player4Time = Math.min(gameSettings.initialTime * 2, gameState4p.player4Time + deltaTime);
                    
                    // Check other players
                    if (!gameState4p.eliminatedPlayers.includes(1)) {
                        gameState4p.player1Time = Math.max(0, gameState4p.player1Time - deltaTime);
                        if (gameState4p.player1Time <= 0) {
                            eliminatePlayer4p(1);
                        }
                    }
                    
                    if (!gameState4p.eliminatedPlayers.includes(2)) {
                        gameState4p.player2Time = Math.max(0, gameState4p.player2Time - deltaTime);
                        if (gameState4p.player2Time <= 0) {
                            eliminatePlayer4p(2);
                        }
                    }
                    
                    if (!gameState4p.eliminatedPlayers.includes(3)) {
                        gameState4p.player3Time = Math.max(0, gameState4p.player3Time - deltaTime);
                        if (gameState4p.player3Time <= 0) {
                            eliminatePlayer4p(3);
                        }
                    }
                }
            }
            
            updateTimeDisplay();
            
        }, 50); // Update frequently for smooth countdown
    }
    
    function stopTimer() {
        clearInterval(timerInterval);
    }
    
    // Player elimination for 3-player mode
    function eliminatePlayer3p(playerNumber) {
        // Add to eliminated players list
        gameState3p.eliminatedPlayers.push(playerNumber);
        
        // Add to placement order (3rd place first, then 2nd)
        gameState3p.placementOrder.push(playerNumber);
        
        // Get player's section element
        const playerSection = document.getElementById(`player${playerNumber}_3p`);
        
        // Add eliminated class to hide controls and show placement
        playerSection.classList.add('eliminated');
        
        // Show placement display within the player section
        const placementDisplay = document.getElementById(`placement${playerNumber}_3p`);
        
        if (gameState3p.eliminatedPlayers.length === 1) {
            // First player eliminated (3rd place)
            placementDisplay.textContent = '3° POSTO';
            placementDisplay.style.color = 'var(--bronze-color)';
            placementDisplay.style.textShadow = '0 0 20px rgba(205, 97, 51, 0.6)';
            
            // Only switch active player if the eliminated player was the active one
            if (gameState3p.activePlayer === playerNumber) {
                const remainingPlayers = [1, 2, 3].filter(p => !gameState3p.eliminatedPlayers.includes(p));
                gameState3p.activePlayer = remainingPlayers[0];
            }
            updateTurnIndicators();
            
        } else if (gameState3p.eliminatedPlayers.length === 2) {
            // Second player eliminated (2nd place)
            placementDisplay.textContent = '2° POSTO';
            placementDisplay.style.color = 'var(--silver-color)';
            placementDisplay.style.textShadow = '0 0 20px rgba(178, 190, 195, 0.6)';
            
            // Last player wins (1st place)
            const winner = [1, 2, 3].find(p => !gameState3p.eliminatedPlayers.includes(p));
            endGame3Player(winner);
        }
    }
    
    // End game for 3-player mode
    function endGame3Player(winnerPlayer) {
        gameState3p.isGameOver = true;
        stopTimer();
        
        // Get winner's section element
        const winnerSection = document.getElementById(`player${winnerPlayer}_3p`);
        
        // Add eliminated class to the winner too, to show their placement
        winnerSection.classList.add('eliminated');
        
        // Show 1st place message
        const winnerPlacementDisplay = document.getElementById(`placement${winnerPlayer}_3p`);
        winnerPlacementDisplay.textContent = '1° POSTO';
        winnerPlacementDisplay.style.color = 'var(--gold-color)';
        winnerPlacementDisplay.style.textShadow = '0 0 20px rgba(255, 195, 18, 0.6)';
        
        // Hide the menu button
        menuButton3p.style.display = 'none';
        
        // Show reset button and main menu button
        resetButton3p.classList.remove('hidden');
        mainMenuButton3p.classList.remove('hidden');
    }
    
    // Player elimination for 4-player mode
    function eliminatePlayer4p(playerNumber) {
        // Add to eliminated players list
        gameState4p.eliminatedPlayers.push(playerNumber);
        
        // Add to placement order (4th place first, then 3rd, then 2nd)
        gameState4p.placementOrder.push(playerNumber);
        
        // Get player's section element
        const playerSection = document.getElementById(`player${playerNumber}_4p`);
        
        // Add eliminated class to hide controls and show placement
        playerSection.classList.add('eliminated');
        
        // Show placement display within the player section
        const placementDisplay = document.getElementById(`placement${playerNumber}_4p`);
        
        if (gameState4p.eliminatedPlayers.length === 1) {
            // First player eliminated (4th place)
            placementDisplay.textContent = '4° POSTO';
            placementDisplay.style.color = 'var(--pewter-color)';
            placementDisplay.style.textShadow = '0 0 20px rgba(113, 128, 147, 0.6)';
            
            // Only switch active player if the eliminated player was the active one
            if (gameState4p.activePlayer === playerNumber) {
                const remainingPlayers = [1, 2, 3, 4].filter(p => !gameState4p.eliminatedPlayers.includes(p));
                gameState4p.activePlayer = remainingPlayers[0];
            }
            updateTurnIndicators();
            
        } else if (gameState4p.eliminatedPlayers.length === 2) {
            // Second player eliminated (3rd place)
            placementDisplay.textContent = '3° POSTO';
            placementDisplay.style.color = 'var(--bronze-color)';
            placementDisplay.style.textShadow = '0 0 20px rgba(205, 97, 51, 0.6)';
            
            // Only switch active player if the eliminated player was the active one
            if (gameState4p.activePlayer === playerNumber) {
                const remainingPlayers = [1, 2, 3, 4].filter(p => !gameState4p.eliminatedPlayers.includes(p));
                gameState4p.activePlayer = remainingPlayers[0];
            }
            updateTurnIndicators();
            
        } else if (gameState4p.eliminatedPlayers.length === 3) {
            // Third player eliminated (2nd place)
            placementDisplay.textContent = '2° POSTO';
            placementDisplay.style.color = 'var(--silver-color)';
            placementDisplay.style.textShadow = '0 0 20px rgba(178, 190, 195, 0.6)';
            
            // Last player wins (1st place)
            const winner = [1, 2, 3, 4].find(p => !gameState4p.eliminatedPlayers.includes(p));
            endGame4Player(winner);
        }
    }
    
    // End game for 4-player mode
    function endGame4Player(winnerPlayer) {
        gameState4p.isGameOver = true;
        stopTimer();
        
        // Get winner's section element
        const winnerSection = document.getElementById(`player${winnerPlayer}_4p`);
        
        // Add eliminated class to the winner too, to show their placement
        winnerSection.classList.add('eliminated');
        
        // Show 1st place message
        const winnerPlacementDisplay = document.getElementById(`placement${winnerPlayer}_4p`);
        winnerPlacementDisplay.textContent = '1° POSTO';
        winnerPlacementDisplay.style.color = 'var(--gold-color)';
        winnerPlacementDisplay.style.textShadow = '0 0 20px rgba(255, 195, 18, 0.6)';
        
        // Hide the menu button
        menuButton4p.style.display = 'none';
        
        // Show reset button and main menu button
        resetButton4p.classList.remove('hidden');
        mainMenuButton4p.classList.remove('hidden');
    }
    
    // Game start/end functions
    function initGame() {
        if (gameSettings.playerCount === 2) {
            // 2-Player mode initialization
            // Initialize game state
            gameState2p.isGameStarted = false;
            gameState2p.isGameOver = false;
            gameState2p.activePlayer = null;
            gameState2p.player1Time = gameSettings.initialTime;
            gameState2p.player2Time = gameSettings.initialTime;
            
            // Update UI
            updateTimeDisplay();
            updateTurnIndicators();
            
            // Reset status displays
            status1.textContent = '';
            status2.textContent = '';
            
            // Reset game over messages
            gameOverPlayer1.classList.add('hidden');
            gameOverPlayer1.classList.remove('loser');
            gameOverPlayer2.classList.add('hidden');
            gameOverPlayer2.classList.remove('loser');
            gameOverPlayer1.textContent = 'HAI VINTO!';
            gameOverPlayer2.textContent = 'HAI VINTO!';
            
            // Enable player buttons
            player1Button.classList.remove('disabled');
            player2Button.classList.remove('disabled');
            
            // Show menu button, hide reset button
            menuButton2p.style.display = 'block';
            resetButton2p.classList.add('hidden');
            
            // Remove game over effect
            gameScreen2p.classList.remove('game-over');
            
            // Handle category display
            if (gameSettings.mode === 'category') {
                const randomCategory = gameSettings.categories[Math.floor(Math.random() * gameSettings.categories.length)];
                categoryText2p.textContent = randomCategory;
                categoryDisplay2p.classList.remove('hidden');
            } else {
                categoryDisplay2p.classList.add('hidden');
            }
            
            // Hide main menu button
            mainMenuButton2p.classList.add('hidden');
        } else if (gameSettings.playerCount === 3) {
            // 3-Player mode initialization
            // Initialize game state
            gameState3p.isGameStarted = false;
            gameState3p.isGameOver = false;
            gameState3p.activePlayer = null;
            gameState3p.player1Time = gameSettings.initialTime;
            gameState3p.player2Time = gameSettings.initialTime;
            gameState3p.player3Time = gameSettings.initialTime;
            gameState3p.eliminatedPlayers = [];
            gameState3p.placementOrder = [];
            
            // Update UI
            updateTimeDisplay();
            updateTurnIndicators();
            
            // Reset status displays
            status1_3p.textContent = '';
            status2_3p.textContent = '';
            status3_3p.textContent = '';
            
            // Reset eliminated classes and placemant messages
            document.getElementById('player1_3p').classList.remove('eliminated');
            document.getElementById('player2_3p').classList.remove('eliminated');
            document.getElementById('player3_3p').classList.remove('eliminated');
            
            // Reset placement displays
            document.getElementById('placement1_3p').textContent = '1° POSTO';
            document.getElementById('placement2_3p').textContent = '2° POSTO';
            document.getElementById('placement3_3p').textContent = '3° POSTO';
            
            // Reset game over messages
            gameOverPlayer1_3p.classList.add('hidden');
            gameOverPlayer1_3p.classList.remove('first-place', 'second-place', 'third-place');
            gameOverPlayer2_3p.classList.add('hidden');
            gameOverPlayer2_3p.classList.remove('first-place', 'second-place', 'third-place');
            gameOverPlayer3_3p.classList.add('hidden');
            gameOverPlayer3_3p.classList.remove('first-place', 'second-place', 'third-place');
            
            // Enable player buttons
            player1Button3p.classList.remove('disabled');
            player2Button3p.classList.remove('disabled');
            player3Button3p.classList.remove('disabled');
            
            // Show menu button, hide reset button
            menuButton3p.style.display = 'block';
            resetButton3p.classList.add('hidden');
            
            // Remove game over effect
            gameScreen3p.classList.remove('game-over');
            
            // Handle category display
            if (gameSettings.mode === 'category') {
                const randomCategory = gameSettings.categories[Math.floor(Math.random() * gameSettings.categories.length)];
                categoryText3p.textContent = randomCategory;
                categoryDisplay3p.classList.remove('hidden');
            } else {
                categoryDisplay3p.classList.add('hidden');
            }
            
            // Hide main menu button
            mainMenuButton3p.classList.add('hidden');
        } else {
            // 4-Player mode initialization
            // Initialize game state
            gameState4p.isGameStarted = false;
            gameState4p.isGameOver = false;
            gameState4p.activePlayer = null;
            gameState4p.player1Time = gameSettings.initialTime;
            gameState4p.player2Time = gameSettings.initialTime;
            gameState4p.player3Time = gameSettings.initialTime;
            gameState4p.player4Time = gameSettings.initialTime;
            gameState4p.eliminatedPlayers = [];
            gameState4p.placementOrder = [];
            
            // Update UI
            updateTimeDisplay();
            updateTurnIndicators();
            
            // Reset status displays
            status1_4p.textContent = '';
            status2_4p.textContent = '';
            status3_4p.textContent = '';
            status4_4p.textContent = '';
            
            // Reset eliminated classes and placement messages
            document.getElementById('player1_4p').classList.remove('eliminated');
            document.getElementById('player2_4p').classList.remove('eliminated');
            document.getElementById('player3_4p').classList.remove('eliminated');
            document.getElementById('player4_4p').classList.remove('eliminated');
            
            // Reset placement displays
            document.getElementById('placement1_4p').textContent = '1° POSTO';
            document.getElementById('placement2_4p').textContent = '2° POSTO';
            document.getElementById('placement3_4p').textContent = '3° POSTO';
            document.getElementById('placement4_4p').textContent = '4° POSTO';
            
            // Reset game over messages
            gameOverPlayer1_4p.classList.add('hidden');
            gameOverPlayer1_4p.classList.remove('first-place', 'second-place', 'third-place', 'fourth-place');
            gameOverPlayer2_4p.classList.add('hidden');
            gameOverPlayer2_4p.classList.remove('first-place', 'second-place', 'third-place', 'fourth-place');
            gameOverPlayer3_4p.classList.add('hidden');
            gameOverPlayer3_4p.classList.remove('first-place', 'second-place', 'third-place', 'fourth-place');
            gameOverPlayer4_4p.classList.add('hidden');
            gameOverPlayer4_4p.classList.remove('first-place', 'second-place', 'third-place', 'fourth-place');
            
            // Enable player buttons
            player1Button4p.classList.remove('disabled');
            player2Button4p.classList.remove('disabled');
            player3Button4p.classList.remove('disabled');
            player4Button4p.classList.remove('disabled');
            
            // Show menu button, hide reset button
            menuButton4p.style.display = 'block';
            resetButton4p.classList.add('hidden');
            
            // Remove game over effect
            gameScreen4p.classList.remove('game-over');
            
            // Handle category display
            if (gameSettings.mode === 'category') {
                const randomCategory = gameSettings.categories[Math.floor(Math.random() * gameSettings.categories.length)];
                categoryText4p.textContent = randomCategory;
                categoryDisplay4p.classList.remove('hidden');
            } else {
                categoryDisplay4p.classList.add('hidden');
            }
            
            // Hide main menu button
            mainMenuButton4p.classList.add('hidden');
        }
    }
    
    function startGame(playerNumber) {
        if (gameSettings.playerCount === 2) {
            if (gameState2p.isGameStarted || gameState2p.isGameOver) return;
            
            gameState2p.isGameStarted = true;
            
            // Fix: Set the active player to the opponent of the player who started
            gameState2p.activePlayer = playerNumber === 1 ? 2 : 1;
            
            gameState2p.lastUpdateTime = Date.now();
            
            // Update visual indicators
            updateTurnIndicators();
            
            startTimer();
        } else if (gameSettings.playerCount === 3) {
            if (gameState3p.isGameStarted || gameState3p.isGameOver) return;
            
            gameState3p.isGameStarted = true;
            
            // For 3-player mode, set the active player to the player who pressed the button
            gameState3p.activePlayer = playerNumber;
            
            gameState3p.lastUpdateTime = Date.now();
            
            // Update visual indicators
            updateTurnIndicators();
            
            startTimer();
        } else if (gameSettings.playerCount === 4) {
            if (gameState4p.isGameStarted || gameState4p.isGameOver) return;
            
            gameState4p.isGameStarted = true;
            
            // For 4-player mode, set the active player to the player who pressed the button
            gameState4p.activePlayer = playerNumber;
            
            gameState4p.lastUpdateTime = Date.now();
            
            // Update visual indicators
            updateTurnIndicators();
            
            startTimer();
        }
    }
    
    function endGame(winnerPlayer) {
        if (gameSettings.playerCount === 3) {
            // For 3-player mode, we use endGame3Player instead
            return;
        }
        
        gameState2p.isGameOver = true;
        stopTimer();
        
        // Add game over effect to darken everything
        gameScreen2p.classList.add('game-over');
        
        // Reset button states and indicators
        player1Button.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        player2Button.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        indicator1.classList.remove('visible');
        indicator2.classList.remove('visible');
        
        // Show appropriate game over messages
        if (winnerPlayer === 1) {
            // Player 1 won
            gameOverPlayer1.textContent = 'HAI VINTO!';
            gameOverPlayer1.classList.remove('loser');
            gameOverPlayer1.classList.remove('hidden');
            
            gameOverPlayer2.textContent = 'HAI PERSO!';
            gameOverPlayer2.classList.add('loser');
            gameOverPlayer2.classList.remove('hidden');
        } else {
            // Player 2 won
            gameOverPlayer1.textContent = 'HAI PERSO!';
            gameOverPlayer1.classList.add('loser');
            gameOverPlayer1.classList.remove('hidden');
            
            gameOverPlayer2.textContent = 'HAI VINTO!';
            gameOverPlayer2.classList.remove('loser');
            gameOverPlayer2.classList.remove('hidden');
        }
        
        // Disable player buttons
        player1Button.classList.add('disabled');
        player2Button.classList.add('disabled');
        
        // Hide menu button
        menuButton2p.style.display = 'none';
        
        // Show reset button and main menu button
        resetButton2p.classList.remove('hidden');
        mainMenuButton2p.classList.remove('hidden');
    }
    
    // Switch active player
    function switchActivePlayer(playerNumber) {
        if (gameSettings.playerCount === 2) {
            if (gameState2p.activePlayer === 1) {
                gameState2p.activePlayer = 2;
            } else {
                gameState2p.activePlayer = 1;
            }
        } else if (gameSettings.playerCount === 3) {
            // In 3-player mode, if there are eliminated players, we need to handle that
            if (gameState3p.eliminatedPlayers.length > 0) {
                // Get all active players
                const activePlayers = [1, 2, 3].filter(p => !gameState3p.eliminatedPlayers.includes(p));
                
                // Find the next player in the sequence
                const currentIndex = activePlayers.indexOf(gameState3p.activePlayer);
                const nextIndex = (currentIndex + 1) % activePlayers.length;
                
                gameState3p.activePlayer = activePlayers[nextIndex];
            } else {
                // No eliminated players, simple rotation 1->2->3->1
                if (gameState3p.activePlayer === 1) {
                    gameState3p.activePlayer = 2;
                } else if (gameState3p.activePlayer === 2) {
                    gameState3p.activePlayer = 3;
                } else {
                    gameState3p.activePlayer = 1;
                }
            }
        } else if (gameSettings.playerCount === 4) {
            // In 4-player mode, if there are eliminated players, we need to handle that
            if (gameState4p.eliminatedPlayers.length > 0) {
                // Get all active players
                const activePlayers = [1, 2, 3, 4].filter(p => !gameState4p.eliminatedPlayers.includes(p));
                
                // Find the next player in the sequence
                const currentIndex = activePlayers.indexOf(gameState4p.activePlayer);
                const nextIndex = (currentIndex + 1) % activePlayers.length;
                
                gameState4p.activePlayer = activePlayers[nextIndex];
            } else {
                // No eliminated players, simple rotation 1->2->3->4->1
                if (gameState4p.activePlayer === 1) {
                    gameState4p.activePlayer = 2;
                } else if (gameState4p.activePlayer === 2) {
                    gameState4p.activePlayer = 3;
                } else if (gameState4p.activePlayer === 3) {
                    gameState4p.activePlayer = 4;
                } else {
                    gameState4p.activePlayer = 1;
                }
            }
        }
        
        // Update visual indicators
        updateTurnIndicators();
    }
    
    // Return to main menu
    function returnToMenu() {
        // Stop the game timer
        stopTimer();
        
        // Reset game state and UI
        gameState2p.isGameStarted = false;
        gameState2p.isGameOver = false;
        gameState3p.isGameStarted = false;
        gameState3p.isGameOver = false;
        gameState4p.isGameStarted = false;
        gameState4p.isGameOver = false;
        
        // Remove game over effects
        gameScreen2p.classList.remove('game-over');
        gameScreen3p.classList.remove('game-over');
        gameScreen4p.classList.remove('game-over');
        
        // Hide game over messages - 2 player
        gameOverPlayer1.classList.add('hidden');
        gameOverPlayer2.classList.add('hidden');
        
        // Hide game over messages - 3 player
        gameOverPlayer1_3p.classList.add('hidden');
        gameOverPlayer2_3p.classList.add('hidden');
        gameOverPlayer3_3p.classList.add('hidden');
        
        // Hide game over messages - 4 player
        gameOverPlayer1_4p.classList.add('hidden');
        gameOverPlayer2_4p.classList.add('hidden');
        gameOverPlayer3_4p.classList.add('hidden');
        gameOverPlayer4_4p.classList.add('hidden');
        
        // Switch screens
        gameScreen2p.classList.remove('active');
        gameScreen3p.classList.remove('active');
        gameScreen4p.classList.remove('active');
        startMenu.classList.add('active');
    }
    
    // Show confirmation dialog
    function showConfirmDialog() {
        // Pause the game timer
        if ((gameSettings.playerCount === 2 && gameState2p.isGameStarted && !gameState2p.isGameOver) ||
            (gameSettings.playerCount === 3 && gameState3p.isGameStarted && !gameState3p.isGameOver) ||
            (gameSettings.playerCount === 4 && gameState4p.isGameStarted && !gameState4p.isGameOver)) {
            stopTimer();
        }
        
        // Show the dialog
        confirmDialog.classList.remove('hidden');
    }
    
    // Hide confirmation dialog
    function hideConfirmDialog(shouldReturnToMenu) {
        // Hide the dialog
        confirmDialog.classList.add('hidden');
        
        if (shouldReturnToMenu) {
            returnToMenu();
        } else if ((gameSettings.playerCount === 2 && gameState2p.isGameStarted && !gameState2p.isGameOver) ||
                   (gameSettings.playerCount === 3 && gameState3p.isGameStarted && !gameState3p.isGameOver) ||
                   (gameSettings.playerCount === 4 && gameState4p.isGameStarted && !gameState4p.isGameOver)) {
            // Resume the game timer
            startTimer();
        }
    }
    
    // Event Listeners
    
    // Mode Selection
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            gameSettings.mode = button.dataset.mode;
        });
    });
    
    // Time Selection
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            gameSettings.initialTime = parseInt(button.dataset.time);
        });
    });
    
    // Player Count Selection
    playerButtons.forEach(button => {
        button.addEventListener('click', () => {
            playerButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            gameSettings.playerCount = parseInt(button.dataset.players);
        });
    });
    
    // Start Button
    startButton.addEventListener('click', async () => {
        if (gameSettings.mode === 'category' && gameSettings.categories.length === 0) {
            await loadCategories();
        }
        
        startMenu.classList.remove('active');
        
        // Show the appropriate game screen based on player count
        if (gameSettings.playerCount === 2) {
            gameScreen2p.classList.add('active');
            currentGameScreen = gameScreen2p;
            currentGameState = gameState2p;
        } else if (gameSettings.playerCount === 3) {
            gameScreen3p.classList.add('active');
            currentGameScreen = gameScreen3p;
            currentGameState = gameState3p;
        } else {
            gameScreen4p.classList.add('active');
            currentGameScreen = gameScreen4p;
            currentGameState = gameState4p;
        }
        
        initGame();
    });
    
    // Event Listeners - 2 Player Game
    
    // Player Buttons - 2 Player
    player1Button.addEventListener('click', () => {
        if (gameState2p.isGameOver) return;
        
        if (!gameState2p.isGameStarted) {
            startGame(1);
        } else if (gameState2p.activePlayer === 1) {
            // Switch to player 2
            switchActivePlayer(1);
        }
    });
    
    player2Button.addEventListener('click', () => {
        if (gameState2p.isGameOver) return;
        
        if (!gameState2p.isGameStarted) {
            startGame(2);
        } else if (gameState2p.activePlayer === 2) {
            // Switch to player 1
            switchActivePlayer(2);
        }
    });
    
    // Event Listeners - 3 Player Game
    
    // Player Buttons - 3 Player
    player1Button3p.addEventListener('click', () => {
        if (gameState3p.isGameOver || gameState3p.eliminatedPlayers.includes(1)) return;
        
        if (!gameState3p.isGameStarted) {
            // Start the game with player 1 as active (their timer will increase)
            startGame(1);
        } else if (gameState3p.activePlayer !== 1) {
            // Only allow player 1 to press if they're NOT the active player
            // (i.e., their timer is currently decreasing)
            gameState3p.activePlayer = 1;
            updateTurnIndicators();
        }
    });
    
    player2Button3p.addEventListener('click', () => {
        if (gameState3p.isGameOver || gameState3p.eliminatedPlayers.includes(2)) return;
        
        if (!gameState3p.isGameStarted) {
            // Start the game with player 2 as active (their timer will increase)
            startGame(2);
        } else if (gameState3p.activePlayer !== 2) {
            // Only allow player 2 to press if they're NOT the active player
            // (i.e., their timer is currently decreasing)
            gameState3p.activePlayer = 2;
            updateTurnIndicators();
        }
    });
    
    player3Button3p.addEventListener('click', () => {
        if (gameState3p.isGameOver || gameState3p.eliminatedPlayers.includes(3)) return;
        
        if (!gameState3p.isGameStarted) {
            // Start the game with player 3 as active (their timer will increase)
            startGame(3);
        } else if (gameState3p.activePlayer !== 3) {
            // Only allow player 3 to press if they're NOT the active player
            // (i.e., their timer is currently decreasing)
            gameState3p.activePlayer = 3;
            updateTurnIndicators();
        }
    });
    
    // Reset Buttons
    resetButton2p.addEventListener('click', () => {
        initGame();
    });
    
    resetButton3p.addEventListener('click', () => {
        initGame();
    });
    
    resetButton4p.addEventListener('click', () => {
        initGame();
    });
    
    // Menu Buttons
    menuButton2p.addEventListener('click', () => {
        showConfirmDialog();
    });
    
    menuButton3p.addEventListener('click', () => {
        showConfirmDialog();
    });
    
    menuButton4p.addEventListener('click', () => {
        showConfirmDialog();
    });
    
    // Confirmation Dialog Buttons
    confirmButton.addEventListener('click', () => {
        hideConfirmDialog(true); // true = return to menu
    });
    
    cancelButton.addEventListener('click', () => {
        hideConfirmDialog(false); // false = stay in game
    });
    
    // Main Menu Buttons
    mainMenuButton2p.addEventListener('click', () => {
        returnToMenu();
    });
    
    mainMenuButton3p.addEventListener('click', () => {
        returnToMenu();
    });
    
    mainMenuButton4p.addEventListener('click', () => {
        returnToMenu();
    });
    
    // Player Buttons - 4 Player
    player1Button4p.addEventListener('click', () => {
        if (gameState4p.isGameOver || gameState4p.eliminatedPlayers.includes(1)) return;
        
        if (!gameState4p.isGameStarted) {
            // Start the game with player 1 as active (their timer will increase)
            startGame(1);
        } else if (gameState4p.activePlayer !== 1) {
            // Only allow player 1 to press if they're NOT the active player
            // (i.e., their timer is currently decreasing)
            gameState4p.activePlayer = 1;
            updateTurnIndicators();
        }
    });
    
    player2Button4p.addEventListener('click', () => {
        if (gameState4p.isGameOver || gameState4p.eliminatedPlayers.includes(2)) return;
        
        if (!gameState4p.isGameStarted) {
            // Start the game with player 2 as active (their timer will increase)
            startGame(2);
        } else if (gameState4p.activePlayer !== 2) {
            // Only allow player 2 to press if they're NOT the active player
            // (i.e., their timer is currently decreasing)
            gameState4p.activePlayer = 2;
            updateTurnIndicators();
        }
    });
    
    player3Button4p.addEventListener('click', () => {
        if (gameState4p.isGameOver || gameState4p.eliminatedPlayers.includes(3)) return;
        
        if (!gameState4p.isGameStarted) {
            // Start the game with player 3 as active (their timer will increase)
            startGame(3);
        } else if (gameState4p.activePlayer !== 3) {
            // Only allow player 3 to press if they're NOT the active player
            // (i.e., their timer is currently decreasing)
            gameState4p.activePlayer = 3;
            updateTurnIndicators();
        }
    });
    
    player4Button4p.addEventListener('click', () => {
        if (gameState4p.isGameOver || gameState4p.eliminatedPlayers.includes(4)) return;
        
        if (!gameState4p.isGameStarted) {
            // Start the game with player 4 as active (their timer will increase)
            startGame(4);
        } else if (gameState4p.activePlayer !== 4) {
            // Only allow player 4 to press if they're NOT the active player
            // (i.e., their timer is currently decreasing)
            gameState4p.activePlayer = 4;
            updateTurnIndicators();
        }
    });
}); 