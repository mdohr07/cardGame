// Canvas einrichten
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const cardWidth = 120;
const cardHeight = 170;

const playerCards = [];
const enemyCards = [];

let currentTurn = "player";
let playerHP = 20;
let enemyHP = 20;

// JSON-Datei laden, Karten ziehen, Karten erstellen
fetch("cards.json")
    .then(response => response.json())
    .then(data => {
        // Karten mischen
        const shuffleCards = data.sort(() => Math.random() - 0.5);

        // 5 Karten ziehen
        const playerDeck = shuffleCards.slice (0, 5);
        const enemyDeck = shuffleCards.slice(5, 10);

        let loadedImages = 0;

        // Spielerkarten erstellen
        playerDeck.forEach((cardData, index) => {
            const imgFront = new Image();
            const imgBack = new Image();

            imgFront.src = `img/${cardData.imgFront}`;
            imgBack.src = `img/${cardData.imgBack}`;

            imgFront.onload = imgBack.onload = () => {
                loadedImages++;
                if (loadedImages === 10) {
                    drawCards(); // Zeichne erst, wenn ALLE Bilder geladen sind
                }
            };

            playerCards.push({ // Cards-Array befüllen
                ...cardData, // Spread Operator (...): Alle Werte aus cardData (Name, Angriff, Verteidigung usw.) werden übernommen
      
                x: index * (canvas.width / 5), // Gleichmäßige Verteilung
                y: canvas.height - cardHeight - 10, // Am unteren Rand positionieren
                width: cardWidth,
                height: cardHeight,
                isFlipped: false,
                imgFront: imgFront,
                imgBack: imgBack
            });
        });

        // Gegnerkarten erstellen
        enemyDeck.forEach((cardData, index) => {
            const imgFront = new Image();
            const imgBack = new Image();

            imgFront.src = `img/${cardData.imgFront}`;
            imgBack.src = `img/${cardData.imgBack}`;

            enemyCards.push({
                ...cardData,

                x: index * (canvas.width / 5), // Gleichmäßige Verteilung
                y: 20, // Am oberen Rand
                width: cardWidth,
                height: cardHeight,
                isFlipped: false,
                imgFront: imgFront,
                imgBack: imgBack
            });
        });

        drawCards();
    })
    .catch(error => console.error("Something went wrong when loading the JSON-file:", error));

// Zeichnet alle Karten (Spieler und Gegner)
function drawCards() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Zeichne alle Spielerkarten
    playerCards.forEach(card => {
        const img = card.isFlipped ? card.imgFront : card.imgBack;
        ctx.drawImage(img, card.x, card.y, card.width, card.height);

        if (card.isFlipped) {
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.shadowColor = "black";
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur = 3;
            ctx.fillText(`${card.cardName}`, card.x + card.width / 2, card.y + 20);
            ctx.textAlign = "right";
            ctx.fillText(`${card.atck}/${card.dfns}`, card.x + 110, card.y + card.height - 10);
        }
    });

// Zeichne alle Gegnerkarten
    enemyCards.forEach(card => {
        const img = card.isFlipped ? card.imgFront : card.imgBack;
        ctx.drawImage(img, card.x, card.y, card.width, card.height);

        if (card.isFlipped) {
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.shadowColor = "black";
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur = 3;
            ctx.fillText(`${card.cardName}`, card.x + card.width / 2, card.y + 20);
            ctx.textAlign = "right";
            ctx.fillText(`${card.atck}/${card.dfns}`, card.x + 110, card.y + card.height - 10);
        }
    });
}

// Player turn
function playerTurn(card) {
    card.isFlipped = true;
    drawCards();

    // Checken, ob Gegner dran ist
    setTimeout(enemyTurn, 1000);
}

// Wenn der Gegner automatisch eine Karte spielt
function enemyTurn() {
    /*  availableCards enthält alle noch verdeckten Karten des Gegners 
    Das filter-Array gibt nur die Karten zurück, die noch nicht aufgedeckt wurden.
    Math.random() gibt eine Zufallszahl zwischen 0 und 1 zurück (z. B. 0.743 oder 0.123).
    Wenn man das mit availableCards.length multipliziert -> Zufallszahl zwischen 0 und der Anzahl der verfügbaren Karten.
    Math.floor() wird benutzt, um die Zufallszahl abzurunden. */
    const availableCards = enemyCards.filter(card => !card.isFlipped);
    if (availableCards.length > 0) {
        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
        randomCard.isFlipped = true;
        drawCards();
        checkBattle();
    }

    // Nach dem Zug des Gegners wird der Spieler wieder dran sein
    currentTurn = "player";
}

function removeCardFromGame(cardToRemove) {
    // Spielerkarte entfernen
    const playerIndex = playerCards.indexOf(cardToRemove);
    if (playerIndex !== -1) {
        playerCards.splice(playerIndex, 1);
        return;
    }

    // Gegnerkarte entfernen
    const enemyIndex = enemyCards.indexOf(cardToRemove);
    if (enemyIndex !== -1) {
        enemyCards.splice(enemyIndex, 1);
        return;
    }
}

// Battle math
function resolveBattle(attackingCard, defendingCard, isPlayerAttacking) {
    const damage = attackingCard.atck - defendingCard.dfns;

    if (damage > 0) {
        const actualDamage = Math.ceil(damage); // Math.ceil rundet die Zahl auf
        if (isPlayerAttacking) {
            enemyHP -= actualDamage;
            console.log(`Player dealt ${actualDamage}!`);
        } else {
            playerHP -= actualDamage;
            console.log(`Enemy dealt ${actualDamage}!`);
        }
    } else {
        console.log("No damage dealt");
    }

    // Karten aus Spiel entfernen
    removeCardFromGame(attackingCard);
    removeCardFromGame(defendingCard);
    drawCards();

    // HP Anzeige aktualisieren
    updateHPdisplay();
    checkGameOver();
}

// card.isFlipped, HP--, drawCards(), checkGameover()
function checkBattle() {
    const playerCard = playerCards.find(card => card.isFlipped);
    const enemyCard = enemyCards.find(card => card.isFlipped);

    if (playerCard && enemyCard) {
        if (playerCard.atck > enemyCard.dfns) {
            console.log("You dealt damage!");
            resolveBattle(playerCard, enemyCard, true);
        } else if (enemyCard.atck > playerCard.dfns) {
            console.log("You took damage!");
            resolveBattle(enemyCard, playerCard, false);
        } else {
            console.log("It's a draw.");

            removeCardFromGame(playerCard);
            removeCardFromGame(enemyCard);
            drawCards();
            checkGameOver();

            // Zug wechseln, wenn noch Karten da sind
            currentTurn = isPlayerAttacking ? "enemy" : "player";
                if (currentTurn === "enemy") {
                    setTimeout(enemyTurn, 1000);
                }
            }
        }
    }


// Update HP display
function updateHPdisplay() {
    document.getElementById("playerHP").innerHTML = `Player HP <br> <p class="HP">${playerHP}</p>`;
    document.getElementById("enemyHP").innerHTML = `Enemy HP <br> <p class="HP">${enemyHP}</p>`;
}

// Check if the game is over
function checkGameOver() {
    const messageDiv = document.getElementById("gameMessage");

    // 1. Beide 0 HP
    if (playerHP <= 0 && enemyHP <= 0) {
        console.log("It's a draw");
        messageDiv.textContent = "It's a draw 🤝";
        return;
    }

    // 2. Gegner tot
    if (enemyHP <= 0) {
        console.log("You won");
        messageDiv.textContent = "You won 🎉";
        return;
    }

    // 3. Spieler tot
    if (playerHP <= 0) {
        console.log("You lost");
        messageDiv.textContent = "You lost 💀";
        return;
    }

    // 4. Beide keine Karten mehr
    if (playerCards.length === 0 && enemyCards.length === 0) {
        if (playerHP > enemyHP) {
            console.log("You won");
            messageDiv.textContent = "You won 🎉";
        } else if (enemyHP > playerHP) {
            console.log("You lost");
            messageDiv.textContent = "You lost 💀";
        } else {
            console.log("It's a draw");
            messageDiv.textContent = "It's a draw 🤝";
        }
        return;
    }

    // 5. Nur Spieler hat keine Karten mehr
    if (playerCards.length === 0) {
        console.log("You lost");
        messageDiv.textContent = "You lost 💀";
        return;
    }

    // 6. Nur Gegner hat keine Karten mehr
    if (enemyCards.length === 0) {
        console.log("You won");
        messageDiv.textContent = "You won 🎉";
        return;
    }

    // Noch kein Game Over
    console.log("Game still ongoing");
}

// Klick-Event: Karte umdrehen
canvas.addEventListener("click", (event) => {
    if (currentTurn !== "player") return; // Spieler kann nur in seinem Zug klicken

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    playerCards.forEach(card => {
        if (
            mouseX >= card.x && mouseX <= card.x + card.width &&
            mouseY >= card.y && mouseY <= card.y + card.height &&
            !card.isFlipped
        ) {
            card.isFlipped = true;
            drawCards();
            currentTurn = "enemy"; // Jetzt ist der Gegner dran
            setTimeout(enemyTurn, 1000); // Gegner zieht nach einer Sekunde
        }
    });
});