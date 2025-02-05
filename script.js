const words = ["apple", "table", "grape", "horse", "plant", "chair"]; // Sample words
const targetWord = words[Math.floor(Math.random() * words.length)];
let currentRow = 0;
let currentCol = 0;
const maxGuesses = 6;

document.addEventListener("DOMContentLoaded", () => {
    createBoard();
    createKeyboard();
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
    const keys = "abcdefghijklmnopqrstuvwxyz".split("");

    keys.forEach(letter => {
        const key = document.createElement("div");
        key.classList.add("key");
        key.innerText = letter;
        key.addEventListener("click", () => handleKeyPress(letter));
        keyboard.appendChild(key);
    });

    const enterKey = document.createElement("div");
    enterKey.classList.add("key");
    enterKey.innerText = "Enter";
    enterKey.addEventListener("click", submitGuess);
    keyboard.appendChild(enterKey);

    const backspaceKey = document.createElement("div");
    backspaceKey.classList.add("key");
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
    if (!words.includes(guess)) {
        showMessage("Not in word list!");
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

function checkGuess(guess) {
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
}

function showMessage(msg) {
    document.getElementById("message").innerText = msg;
}

function disableKeyboard() {
    document.getElementById("keyboard").innerHTML = "";
}
