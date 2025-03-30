// Canvas einrichten
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const cards = [];
const cardWidth = 100;
const cardHeight = 150;

// JSON-Datei laden
fetch("cards.json")
    .then(response => response.json())
    .then(data => {
        data.forEach((cardData, index) => {
            const imgFront = new Image();
            const imgBack = new Image();
        
            imgFront.src = `img/${cardData.imgFront}`;
            imgBack.src = `img/${cardData.imgBack}`;

            cards.push({
                name: cardData.name,
                cardNumber: cardData.cardNumber,
                x: Math.random() * (canvas.width - cardWidth), // Zufällige X-Position
                y: Math.random() * (canvas.height - cardHeight), // Zufällige Y-Position
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

    // Zeichnet alle Karten
    function drawCards() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cards.forEach(card => {
            const img = card.isFlipped ? card.imgFront : card.imgBack;
            ctx.drawImage(img, card.x, card.y, card.width, card.height);
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