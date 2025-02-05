const words = [
    "apple", "table", "grape", "horse", "plant", "chair", "house", "river", "light", "brick",
    "piano", "cloud", "storm", "music", "dream", "ocean", "tower", "sunny", "bread",
    "flame", "lunar", "crown", "pearl", "metal", "globe", "candy", "robot", "daisy", "whale",
    "zebra", "spoon", "latch", "beach", "chess", "spine", "glide", "drain", "froze", "sweep",
    "maple", "bloom", "climb", "grind", "shine", "smoke", "brave", "swift", "tiger", "comet",
    "swarm", "prism", "grasp", "space", "blast", "flock", "hazel", "carve", "flute", "jumbo",
    "plush", "shrub", "frost", "plank", "glove", "blaze", "harsh", "quilt", "cider", "dough",
    "slope", "mirth", "serum", "carol", "sprig", "amber", "chime", "haste", "gnome", "trunk",
    "spear", "latte", "coral", "weave", "orbit", "algae", "ember", "polka", "carat", "moist",
    "tulip", "scout", "brisk", "medal", "cabin", "twirl", "glint", "spade", "feast", "grove",
    "throb", "swoop", "shard", "brisk", "vivid", "shrug", "shave", "scarf", "cloak", "latch",
    "torso", "pluck", "fable", "sworn", "gravy", "lumen", "sheep", "vault", "wrist", "melon",
    "abbey", "quill", "bluff", "craze", "wield", "spunk", "fluff", "thump", "prank", "quark",
    "spurt", "dandy", "quash", "stomp", "quirk", "dwell", "fizzy", "boast", "waver", "swoon",
    "shush", "pique", "crisp", "jolly", "scoop", "lilac", "maple", "snout", "sable", "truce",
    "thorn", "sneer", "chasm", "bliss", "droop", "hatch", "froth", "brass", "tramp", "mirth",
    "rover", "scorn", "pouch", "stint", "crash", "haunt", "pluck", "throb", "swept", "swine",
    "chuck", "singe", "vapor", "quint", "dross", "scalp", "quirk", "brine", "crest", "clang",
    "snarl", "trout", "wrack", "crave", "knoll", "deter", "swank", "fudge", "amble", "wreak",
    "twang", "glare", "tryst", "sloop", "rider", "swath", "chide", "flare", "jumpy", "scour",
    "throb", "scowl", "whack", "snipe", "pride", "pluck", "thrum", "swirl", "twine", "brisk",
    "swoop", "scold", "swamp", "twist", "clump", "slink", "waver", "crush", "grind", "bluff",
    "creek", "glaze", "twang", "ravel", "scarf", "clasp", "spite", "drift", "swipe", "creep",
    "groan", "frown", "sniff", "scold", "scoff", "twirl", "prank", "brave", "scamp", "flout",
    "squib", "tweak", "brisk", "swoop", "glade", "swath", "crisp", "flint", "twirl", "swipe",
    "scold", "brine", "twine", "brisk", "swamp", "twist", "slink", "twang", "swirl", "scowl"
];

 // Sample words
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
    keyboard.innerHTML = ""; // Clear previous keys

    const keyRows = [
        "qwertyuiop",
        "asdfghjkl",
        "zxcvbnm"
    ];

    keyRows.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("key-row");

        row.split("").forEach(letter => {
            const key = document.createElement("div");
            key.classList.add("key");
            key.innerText = letter;
            key.addEventListener("click", () => handleKeyPress(letter));
            rowDiv.appendChild(key);
        });

        keyboard.appendChild(rowDiv);
    });

    // Special keys
    const specialKeys = document.createElement("div");
    specialKeys.classList.add("key-row");

    const enterKey = document.createElement("div");
    enterKey.classList.add("key", "special-key");
    enterKey.innerText = "Enter";
    enterKey.addEventListener("click", submitGuess);
    specialKeys.appendChild(enterKey);

    const backspaceKey = document.createElement("div");
    backspaceKey.classList.add("key", "special-key");
    backspaceKey.innerText = "←";
    backspaceKey.addEventListener("click", deleteLetter);
    specialKeys.appendChild(backspaceKey);

    keyboard.appendChild(specialKeys);
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
