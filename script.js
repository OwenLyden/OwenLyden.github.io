const words = ["apple", "table", "grape", "horse", "plant", "chair"]; // Predefined smaller list of words
let currentRow = 0;
let currentCol = 0;
const maxGuesses = 6;
let wordsList = {}; // This will hold the words from the JSON file
let fiveLetterWords = [];

// This is for storing the target word, initially picked from the smaller list
let targetWord = words[Math.floor(Math.random() * words.length)];

document.addEventListener("DOMContentLoaded", () => {
    createBoard();
    createKeyboard();

    // Load the JSON data (replace 'Dictionary.json' with the path to your JSON file)
    fetch('Dictionary.json')
        .then(response => response.json())
        .then(data => {
            wordsList = data;
            // Filter out 5-letter words from the loaded data
            fiveLetterWords = Object.keys(wordsList).filter(word => word.length === 5);
            showMessage("Word list loaded. You can start guessing!");
        })
        .catch(error => {
            console.error('Error loading the word list:', error);
            showMessage("Error loading word list. Please try again.");
        });
});

// Function to create the board layout
function createBoard() {
    const board = document.getElementById("game-board");
    for (let i = 0; i < maxGuesses; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

// Function to create the keyboard layout
function createKeyboard() {
    const keyboard = document.getElementById("keyboard");
    const keys = "abcdefghijklmnopqrstuvwxyz".split("");

    keys.forEach(letter => {
        const key = document.createElement("div");
        key.classList.add("key");
        key.innerText = letter;
        key.addEventListener("click", () => handleKeyPress(letter));
        keyboard.appendChild(key);
    });


    const enterKey = document.createElement("div");
    enterKey.classList.add("key", "enter"); // Add "enter" class
    enterKey.innerText = "Enter";
    enterKey.addEventListener("click", submitGuess);
    keyboard.appendChild(enterKey);

    const backspaceKey = document.createElement("div");
    backspaceKey.classList.add("key", "backspace"); // Add "backspace" class
    backspaceKey.innerText = "←";
    backspaceKey.addEventListener("click", deleteLetter);
    keyboard.appendChild(backspaceKey);

}

// Handle keyboard letter press
function handleKeyPress(letter) {
    if (currentCol < 5 && currentRow < maxGuesses) {
        const row = document.getElementsByClassName("row")[currentRow];
        const tile = row.children[currentCol];
        tile.innerText = letter;
        currentCol++;
    }
}

// Delete letter
function deleteLetter() {
    if (currentCol > 0) {
        currentCol--;
        const row = document.getElementsByClassName("row")[currentRow];
        const tile = row.children[currentCol];
        tile.innerText = "";
    }
}

// Submit the guess
function submitGuess() {
    if (currentCol < 5) {
        showMessage("Not enough letters!");
        return;
    }

    const guess = getCurrentWord();

    // First, check if the guess exists in the Dictionary.json
    if (fiveLetterWords.length === 0) {
        showMessage("Word list is still loading, please try again in a moment.");
        return;
    }

    // Check if the guess is a valid word from the loaded dictionary (Dictionary.json)
    if (!fiveLetterWords.includes(guess)) {
        showMessage(`'${guess}' is not a valid word. Try again!`);
        return;
    }

    // Proceed with checking against the target word
    checkGuess(guess);
    currentRow++;
    currentCol = 0;

    if (guess === targetWord) {
        showMessage("You Win!");
        disableKeyboard();
    } else if (currentRow === maxGuesses) {
        showMessage(`Game Over! The word was ${targetWord}`);
        disableKeyboard();
    }
}

// Get the current word from the board
function getCurrentWord() {
    const row = document.getElementsByClassName("row")[currentRow];
    return Array.from(row.children).map(tile => tile.innerText).join("").toLowerCase();
}

// Display a message to the player
function showMessage(msg) {
    document.getElementById("message").innerText = msg;
}

// Disable the keyboard after the game ends
function disableKeyboard() {
    document.getElementById("keyboard").innerHTML = "";
}

// Check the guess against the target word
function checkGuess(guess) {
    const messageElement = document.getElementById("message");
    const row = document.getElementsByClassName("row")[currentRow];

    for (let i = 0; i < 5; i++) {
        const letter = guess[i];
        const tile = row.children[i];

        if (letter === targetWord[i]) {
            tile.classList.add("correct");
        } else if (targetWord.includes(letter)) {
            tile.classList.add("present");
        } else {
            tile.classList.add("absent");
        }
    }
    if (guess === targetWord) {
        messageElement.textContent = `'${guess}' is the correct word!`;
        messageElement.style.color = 'green';
    } else {
        messageElement.textContent = `'${guess}' is not correct. Try again!`;
        messageElement.style.color = 'red';
    }
}


