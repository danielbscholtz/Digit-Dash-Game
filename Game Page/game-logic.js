// Game initialization variables
let currentLevel = 1;
let lives = 6;
let maxLevel = 6;

// Check if the game has already been initialized to avoid re-initialization
if (!window.gameInitialized) {
    // Add event listener for when the DOM content is fully loaded
    document.addEventListener('DOMContentLoaded', initializeGame);
    // Mark the game as initialized
    window.gameInitialized = true;
}

// Function to set up the game environment
function initializeGame() {
    // Get the start button and game area elements from the document
    const startButton = document.getElementById('startButton');
    const gameArea = document.getElementById('gameArea');
    if (startButton && gameArea) {
        // Add event listener to the start button to begin countdown on click
        startButton.addEventListener('click', startCountdown);
        // Add a status display area before the game area
        gameArea.insertAdjacentHTML('beforebegin', '<div id="gameStatus"></div>');
        // Set up a cancel button for the game
        setupCancelButton();
    }
}

// Function to start the countdown before the game starts
function startCountdown() {
    // Hide the start button and display the countdown
    document.getElementById('startButton').style.display = 'none';
    let countdownElement = document.getElementById('countdown');
    countdownElement.style.display = 'block';
    let countdownValue = 5; // Countdown starts from 5
    countdownElement.innerText = countdownValue;

    // Set an interval to update the countdown every second
    let interval = setInterval(() => {
        countdownValue--;
        countdownElement.innerText = countdownValue;
        if (countdownValue <= 0) {
            // Once countdown reaches 0, clear the interval and start the game
            clearInterval(interval);
            countdownElement.style.display = 'none';
            startGame();
        }
    }, 1000);
}

// Function to create and set up the cancel button
function setupCancelButton() {
    const cancelButton = document.createElement('button');
    cancelButton.id = 'cancelButton';
    cancelButton.textContent = 'Cancel Game';
    cancelButton.className = 'btn';
    cancelButton.style.display = 'none';
    cancelButton.onclick = cancelGame; // Event handler for cancelling the game

    const gameArea = document.getElementById('gameArea');
    gameArea.parentNode.insertBefore(cancelButton, gameArea.nextSibling);

    return cancelButton;
}

// Function to handle game cancellation
function cancelGame() {
    if (confirm('Are you sure you want to cancel the game?')) {
        saveGameResult("incomplete", calculateLivesUsed());
        resetGame();
    }
}

// Function to start the game
function startGame() {
    // Reset game variables
    currentLevel = 1;
    lives = 6;

    // Update and show lives display
    updateLivesDisplay();
    const livesContainer = document.getElementById('livesContainer');
    if (livesContainer) {
        livesContainer.style.display = 'flex';
    }

    loadGameLevel(currentLevel);
    document.getElementById('cancelButton').style.display = 'block';
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('startButton').style.display = 'none';
}

// Function to load a specific game level
function loadGameLevel(level) {
    const gameArea = document.getElementById('gameArea');
    gameArea.style.display = 'block';
    gameArea.innerHTML = '';

    let items, type;
    // Determine the content of the game level based on current level
    switch (level) {
        case 1:
        case 2:
            items = generateRandomLetters(6);
            type = 'letters';
            break;
        case 3:
        case 4:
            items = generateRandomNumbers(6);
            type = 'numbers';
            break;
        case 5:
        case 6:
            items = level === 5 ? generateRandomLetters(6) : generateRandomNumbers(6);
            type = level === 5 ? 'letters' : 'numbers';
            break;
        default:
            console.error('Invalid level');
            return;
    }

    let order = (level % 2 === 0) ? 'descending' : 'ascending';
    let mode = (level <= 4) ? 'sort' : 'identify';
    gameArea.appendChild(createLevelForm(level, items, type, order, mode));
}

// Function to create the form for each level of the game
function createLevelForm(level, items, type, order, mode) {
    // Create the form element with instructions and submit button
    const form = document.createElement('form');
    form.className = 'game-form';
    form.innerHTML = `<p>Level ${level}: ${getInstruction(level, type, order, mode)}</p><p>${items.join(' ')}</p>`;
    form.appendChild(generateInputFields(level, mode));

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    submitButton.className = 'btn';
    form.appendChild(submitButton);

    form.onsubmit = function(event) {
        event.preventDefault();
        checkAnswer(items, type, order, mode, Array.from(form.querySelectorAll('input')).map(input => input.value));
    };

    return form;
}

// Function to get the instruction text for each level
function getInstruction(level, type, order, mode) {
    if (mode === 'sort') {
        return `Order the ${type} in ${order} order.`;
    } else {
        return `Identify the smallest and largest ${type}.`;
    }
}

// Function to generate input fields for the form based on the game mode
function generateInputFields(level, mode) {
    const container = document.createElement('div');
    container.className = 'game-input-container';
    const inputCount = mode === 'sort' ? 6 : 2;

    for (let i = 0; i < inputCount; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        container.appendChild(input);
    }

    return container;
}

// Function to check the answer submitted by the player
function checkAnswer(items, type, order, mode, answers) {
    let correctAnswer;

    // Determine the correct answer based on the game mode and type
    if (mode === 'sort') {
        if (type === 'letters') {
            correctAnswer = (order === 'ascending') 
                ? items.slice().sort()
                : items.slice().sort().reverse();
        } else if (type === 'numbers') {
            correctAnswer = (order === 'ascending') 
                ? items.map(Number).sort((a, b) => a - b)
                : items.map(Number).sort((a, b) => b - a);
        }
    } else if (mode === 'identify') {
        if (type === 'letters') {
            correctAnswer = [items.reduce((a, b) => a < b ? a : b), items.reduce((a, b) => a > b ? a : b)];
        } else if (type === 'numbers') {
            correctAnswer = [Math.min(...items.map(Number)), Math.max(...items.map(Number))];
        }
    }

    const handleIncorrectAnswer = (customMessage) => {
        const message = customMessage || 'Incorrect – Try again.';
        updateGameStatus(message, true);
        setTimeout(() => {
            updateGameStatus('', true);
        }, 4000);
        updateLivesAndCheckGameOver();
    };

    if (answers.length !== correctAnswer.length) {
        handleIncorrectAnswer();
        return;
    }

    for (let i = 0; i < answers.length; i++) {
        if (type === 'letters') {
            // Check if items are in uppercase
            let isItemUppercase = items[i] === items[i].toUpperCase();

            // Check for case sensitivity errors
            if (isItemUppercase && answers[i] !== answers[i].toUpperCase()) {
                handleIncorrectAnswer('Case sensitivity error: Please use uppercase letters.');
                return;
            }
            // Check for correct letters
            if (answers[i] !== correctAnswer[i]) {
                handleIncorrectAnswer();
                return;
            }
        } else if (type === 'numbers' && answers[i] != correctAnswer[i].toString()) {
            handleIncorrectAnswer();
            return;
        }
    }

    // Advance to the next level or end the game based on the current level
    currentLevel++;
    if (currentLevel > maxLevel) {
        showAlertAndResetGame("Congratulations – You have completed the game!");
    } else {
        loadGameLevel(currentLevel);
    }
}

// Function to display a message when the game is completed or reset
function showAlertAndResetGame(message) {
    alert(message);
    saveGameResult("win", calculateLivesUsed());
    resetGame();
}

// Function to update the number of lives and check for game over condition
function updateLivesAndCheckGameOver() {
    lives--;
    updateLivesDisplay();

    if (lives <= 0) {
        alert("Game Over – You have exhausted all your lives.");
        saveGameResult("gameover", calculateLivesUsed());
        resetGame();
    }
}

// Function to update the game status message
function updateGameStatus(message, isError = false) {
    const statusDiv = document.getElementById('gameStatus');

    if (isError) {
        statusDiv.style.color = 'red';
    }

    statusDiv.textContent = message;

    updateLivesDisplay();
}

// Function to update the visual display of lives
function updateLivesDisplay() {
    const livesContainer = document.getElementById('livesContainer');
    if (!livesContainer) return;

    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const heartImg = document.createElement('img');
        heartImg.src = 'Heart.png';
        heartImg.alt = 'Life';
        livesContainer.appendChild(heartImg);
    }
}

// Function to generate random letters for the game
function generateRandomLetters(count) {
    const isLowercase = Math.random() < 0.5;
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const letters = isLowercase ? lowercaseLetters : uppercaseLetters;

    let result = new Set();
    while (result.size < count) {
        const char = letters[Math.floor(Math.random() * letters.length)];
        result.add(char);
    }
    return Array.from(result);
}

// Function to generate a set of unique random numbers for the game
function generateRandomNumbers(count) {
    let numbers = new Set();
    while (numbers.size < count) {
        numbers.add(Math.floor(Math.random() * 101)); // Add random numbers between 0 to 100
    }
    return Array.from(numbers); // Convert the set to an array
}

// Add a game status display area before the game area
document.getElementById('gameArea').insertAdjacentHTML('beforebegin', '<div id="gameStatus"></div>');

// Function to sort items in ascending or descending order
function sortItems(items, order) {
    return items.sort((a, b) => {
        // Sort based on the specified order
        if (order === 'ascending') {
            return a > b ? 1 : -1;
        } else {
            return a < b ? 1 : -1;
        }
    });
}

// Function to check if two arrays are equal
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true; // Return true if all elements are equal
}

// Function to update the number of lives and check if the game is over
function updateLivesAndCheckGameOver() {
    lives--;
    updateLivesDisplay();

    // Check if all lives are used
    if (lives <= 0) {
        alert("Game Over – You have exhausted all your lives.");
        saveGameResult("gameover", calculateLivesUsed());
        resetGame(); // Reset the game if game over
    }
}

// Function to show a message with a button
function showMessageAndButton(message, buttonText, onClickFunction) {
    const statusDiv = document.getElementById('gameStatus');
    statusDiv.innerHTML = `<p>${message}</p><button onclick="${onClickFunction}">${buttonText}</button>`;
}

// Function to reset the game to its initial state
function resetGame() {
    currentLevel = 1;
    lives = 6;
    updateLivesDisplay();

    // Reset the display of various game elements
    const gameArea = document.getElementById('gameArea');
    const cancelButton = document.getElementById('cancelButton');
    const startButton = document.getElementById('startButton');
    const countdown = document.getElementById('countdown');
    const gameStatus = document.getElementById('gameStatus');

    gameArea.style.display = 'none';
    gameArea.innerHTML = '';
    cancelButton.style.display = 'none';
    startButton.style.display = 'block';
    countdown.style.display = 'none';
    gameStatus.textContent = '';

    // Hide the lives container
    const livesContainer = document.getElementById('livesContainer');
    if (livesContainer) {
        livesContainer.style.display = 'none';
    }
}

// Event listener to initialize the game when it starts
document.addEventListener('gameStart', initializeGame);

// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a game status display area before the game area
    const gameArea = document.getElementById('gameArea');
    gameArea.insertAdjacentHTML('beforebegin', '<div id="gameStatus"></div>');
});