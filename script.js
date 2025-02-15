let words = [];
let targetWord = "";

let currentRow = 0;
let currentCol = 0;
const maxGuesses = 6;
let wordsList = {};
let fiveLetterWords = [];

document.addEventListener("DOMContentLoaded", () => {
    createBoard();
    createKeyboard();

    fetch('Dictionary.json')
        .then(response => response.json())
        .then(data => {
            wordsList = data;
            fiveLetterWords = Object.keys(wordsList).filter(word => word.length === 5);
            showMessage("Word list loaded. You can start guessing!");
        })
        .catch(error => {
            console.error('Error loading the word list:', error);
            showMessage("Error loading word list. Please try again.");
        });

    fetch('words.json')
        .then(response => response.json())
        .then(data => {
            words = data.words;
            targetWord = words[Math.floor(Math.random() * words.length)];
            console.log(targetWord);
            alert("Start Guessing");
        })
        .catch(error => console.error('Error loading JSON:', error));
});

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

function createKeyboard() {
    const keyboard = document.getElementById("keyboard");
    const keys = "qwertyuiopasdfghjklzxcvbnm".split("");

    keys.forEach(letter => {
        const key = document.createElement("div");
        key.classList.add("key");
        key.innerText = letter;
        key.setAttribute("data-letter", letter); // Add data attribute
        key.addEventListener("click", () => handleKeyPress(letter));
        keyboard.appendChild(key);
    });

    const enterKey = document.createElement("div");
    enterKey.classList.add("key", "enter");
    enterKey.innerText = "Enter";
    enterKey.addEventListener("click", submitGuess);
    keyboard.appendChild(enterKey);

    const backspaceKey = document.createElement("div");
    backspaceKey.classList.add("key", "backspace");
    backspaceKey.innerText = "←";
    backspaceKey.addEventListener("click", deleteLetter);
    keyboard.appendChild(backspaceKey);
}

function handleKeyPress(letter) {
    if (currentCol < 5 && currentRow < maxGuesses) {
        const row = document.getElementsByClassName("row")[currentRow];
        const tile = row.children[currentCol];
        tile.innerText = letter;
        currentCol++;
    }
}

function deleteLetter() {
    if (currentCol > 0) {
        currentCol--;
        const row = document.getElementsByClassName("row")[currentRow];
        const tile = row.children[currentCol];
        tile.innerText = "";
    }
}

function submitGuess() {
    if (currentCol < 5) {
        showMessage("Not enough letters!");
        return;
    }

    const guess = getCurrentWord();

    if (fiveLetterWords.length === 0) {
        showMessage("Word list is still loading, please try again in a moment.");
        return;
    }

    if (!fiveLetterWords.includes(guess)) {
        showMessage(`'${guess}' is not a valid word. Try again!`);
        return;
    }

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

function getCurrentWord() {
    const row = document.getElementsByClassName("row")[currentRow];
    return Array.from(row.children).map(tile => tile.innerText).join("").toLowerCase();
}

function showMessage(msg) {
    document.getElementById("message").innerText = msg;
}

function disableKeyboard() {
    document.getElementById("keyboard").innerHTML = "";
}

function checkGuess(guess) {
    const row = document.getElementsByClassName("row")[currentRow];

    let letterCount = {}; // Track letter occurrences in target word

    // Count occurrences of each letter in the target word
    for (let i = 0; i < 5; i++) {
        letterCount[targetWord[i]] = (letterCount[targetWord[i]] || 0) + 1;
    }

    // First pass: Mark correct letters (green) and set key font color
    for (let i = 0; i < 5; i++) {
        const letter = guess[i];
        const tile = row.children[i];
        const key = document.querySelector(`.key[data-letter="${letter}"]`);

        if (letter === targetWord[i]) {
            tile.classList.add("correct"); // Green for correct position
            if (key) key.classList.add("correct"); // Apply 'correct' class to the key
            letterCount[letter]--; // Decrease count for correct letters
        }
    }

    // Second pass: Mark misplaced letters (yellow) and incorrect letters (black) and set key font color
    for (let i = 0; i < 5; i++) {
        const letter = guess[i];
        const tile = row.children[i];
        const key = document.querySelector(`.key[data-letter="${letter}"]`);

        if (letter !== targetWord[i]) {
            if (targetWord.includes(letter) && letterCount[letter] > 0) {
                tile.classList.add("present"); // Yellow for misplaced
                if (key) key.classList.add("present"); // Apply 'present' class to the key
                letterCount[letter]--; // Reduce count for misplaced letters
            } else {
                tile.classList.add("absent"); // Black for not in the word
                if (key) key.classList.add("absent"); // Apply 'absent' class to the key
            }
        }
    }
}

