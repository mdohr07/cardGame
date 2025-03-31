// Canvas einrichten
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const cards = [];
const cardWidth = 120;
const cardHeight = 170;

// JSON-Datei laden
fetch("cards.json")
    .then(response => response.json()) // Hier wird das JSON in ein Array umgewandelt
    .then(data => {
let loadedImages = 0;

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

            cards.push({ // Cards-Array befüllen
                cardName: cardData.cardName,
                cardNumber: cardData.cardNumber,
                atck: cardData.atck,
                dfns: cardData.dfns,
                x: index * (canvas.width / data.length), // teilt die Gesamtbreite des Canvas in gleich große Abschnitte
                y: canvas.height - cardHeight - 10, // Am unteren Rand positionieren
                width: cardWidth,
                height: cardHeight,
                isFlipped: false,
                imgFront: imgFront,
                imgBack: imgBack
            });
        });
    })
    .catch(error => console.error("Something went wrong when loading the JSON-file:", error));

    // Zeichnet alle Karten
    function drawCards() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cards.forEach(card => {
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

    // Click-Event: turn cards around
    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        cards.forEach(card => { // Jede Karte prüfen ob sie angeklickt wurde
            if (
                mouseX >= card.x && mouseX <= card.x + card.width && // War die Maus innerhalb der Kartenkoordinaten?
                mouseY >= card.y && mouseY && mouseY <= card.y + card.height // Falls ja, wird isFlipped geändert ↓
            ) {
                card.isFlipped = !card.isFlipped;
            }
        });
        drawCards();
    });

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