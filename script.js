// Canvas einrichten
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const cardWidth = 120;
const cardHeight = 170;

const playerCards = [];
const enemyCards = [];

let currentTurn = "player";

// JSON-Datei laden
fetch("cards.json")
    .then(response => response.json())
    .then(data => {
        let loadedImages = 0;

        // Spielerkarten
        data.forEach((cardData, index) => {
            const imgFront = new Image();
            const imgBack = new Image();

            imgFront.src = `img/${cardData.imgFront}`;
            imgBack.src = `img/${cardData.imgBack}`;

            imgFront.onload = imgBack.onload = () => {
                loadedImages++;
                if (loadedImages === data.length * 2) {
                    drawCards(); // Zeichne erst, wenn ALLE Bilder geladen sind
                }
            };

            playerCards.push({ // Cards-Array befüllen
                cardName: cardData.cardName,
                cardNumber: cardData.cardNumber,
                atck: cardData.atck,
                dfns: cardData.dfns,
                x: index * (canvas.width / data.length), // Gleichmäßige Verteilung
                y: canvas.height - cardHeight - 10, // Am unteren Rand positionieren
                width: cardWidth,
                height: cardHeight,
                isFlipped: false,
                imgFront: imgFront,
                imgBack: imgBack
            });
        });

        // Gegnerkarten
        data.forEach((cardData, index) => {
            const imgFront = new Image();
            const imgBack = new Image();

            imgFront.src = `img/${cardData.imgFront}`;
            imgBack.src = `img/${cardData.imgBack}`;

            enemyCards.push({
                cardName: cardData.cardName,
                cardNumber: cardData.cardNumber,
                atck: cardData.atck,
                dfns: cardData.dfns,
                x: index * (canvas.width / data.length), // Gleichmäßige Verteilung
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
    }
    currentTurn = "player";
}
    enemyCards.forEach(card => {
        if (
            mouseX >= card.x && mouseX <= card.x + card.width &&
            mouseY >= card.y && mouseY <= card.y + card.height
        ) {
            card.isFlipped = !card.isFlipped;
        }
    });

    drawCards(); // Aktualisiere das Canvas nach jedem Klick





// function drawCards() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     cards.forEach(card => {
//         const img = card.isFlipped ? card.imgFront : card.imgBack;
//         ctx.drawImage(img, card.x, card.y, card.width, card.height);

//         if (card.isFlipped) {
//             ctx.fillStyle = "white";
//             ctx.strokeStyle = "black";
//             ctx.font = "14px Arial";
//             ctx.textAlign = "center";
//             ctx.shadowColor = "black";
//             ctx.shadowOffsetX = 1;
//             ctx.shadowOffsetY = 1;
//             ctx.shadowBlur = 3;
//             ctx.fillText(`${card.cardName}`, card.x + card.width / 2, card.y + 20);
//             ctx.textAlign = "right";
//             ctx.fillText(`${card.atck}/${card.dfns}`, card.x + 110, card.y + card.height - 10);
//         }
//     });
// }


// const cardBack = new Image();
// const cardFront = new Image();
// cardBack.src = "/img/cardBack.jpg";
// cardFront.src = "/img/samplecard.jpg"; // Beispiel

// // Karten-Objekte definieren
// const cards = [
//     { x: 50, y: 50, width: 100, height: 150, isFlipped: false },
//     { x: 200, y: 50, width: 100, height: 150, isFlipped: false },
//     { x: 350, y: 50, width: 100, height: 150, isFlipped: false },
// ];

// // Zeichnet alle Karten auf die Canvas
// function drawCards() {
//     ctx.clearRect /* Löscht zuerst das Canvas */
//     cards.forEach(card => { // Alle Karten durchgehen
//         const img = card.isFlipped ? cardFront : cardBack; // Ist das die Vorder- oder Rückseite?
//         ctx.drawImage(img, card.x, card.y, card.width, card.height); // Hole das passende Bild dazu
//     });
// }

// // Click-Event: Karte umdrehen
// canvas.addEventListener("click", (event) => {
//     const rect = canvas.getBoundingClientRect(); // Position und Größe des canvas im Viewport 
//     const mouseX = event.clientX - rect.left; // Koordinaten der oberen linken Ecke des Canvas im Browserfenster 
//     const mouseY = event.clientY - rect.top; // event.clientX & event.clientY sind die Mauskoordinaten relativ zum Gesamtfenster

//     cards.forEach(card => { // Jede Karte prüfen ob sie angeklickt wurde
//         if ( // War die Maus innerhalb der Kartenkoordinaten?
//         mouseX >= card.x && mouseX <= card.x + card.width && // Falls ja, wird isFlipped geändert ↓
//         mouseY >= card.y && mouseY <= card.y + card.height
//     ) {
//         card.isFlipped = !card.isFlipped;
//     }
//     });
//     drawCards();
// });

// // Bilder laden und dann Karten zeichnen
// cardBack.onload = drawCards;
// cardFront.onload = drawCards;