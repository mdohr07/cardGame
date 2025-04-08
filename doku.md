# Ablauf des Spiels (Reihenfolge der Funktionsaufrufe):
### 1. Initialisierung des Spiels (Start des Spiels)

    fetch("cards.json")

        Die JSON-Datei wird geladen und das Kartendaten-Array wird geladen und gemischt.

    playerDeck und enemyDeck erstellen

        5 Karten werden für den Spieler und 5 Karten für den Gegner aus dem gemischten Kartendeck gezogen.

        Karten werden jeweils als Objekte erstellt, mit Eigenschaften wie z.B. Angriff, Verteidigung, Position auf dem Canvas und Bildquellen.

    drawCards()

        Diese Funktion wird aufgerufen, um alle Karten (Spieler und Gegner) auf dem Canvas zu zeichnen, nachdem die Bilder geladen sind.

    Ziel: Das Spiel ist nun vorbereitet, die Karten sind auf dem Bildschirm sichtbar und das erste Zug steht an.

### 2. Spielbeginn – Spieler ist dran

    playerTurn(card)

        Diese Funktion wird aufgerufen, wenn der Spieler an der Reihe ist und eine Karte gespielt hat.

        card.isFlipped = true; – Die Karte, die der Spieler auswählt, wird umgedreht.

        drawCards() – Alle Karten werden erneut auf dem Canvas gezeichnet.

        enemyCards.find(card => card.isFlipped) – Es wird überprüft, ob der Gegner bereits eine Karte gespielt hat.

        Wenn der Gegner eine Karte gespielt hat, wird der Kampf mit checkBattle() gestartet.

    Ziel: Der Spieler spielt eine Karte, und wenn der Gegner ebenfalls eine Karte gespielt hat, wird der Kampf geprüft.

### 3. Kampf – Wenn beide Spieler Karten gespielt haben

    checkBattle()

        Diese Funktion prüft, ob sowohl der Spieler als auch der Gegner eine Karte gespielt haben (d.h. ob isFlipped für beide Karten true ist).

        Falls ja, wird die Kampfentscheidung getroffen.

        Wenn der Spieler gewonnen hat, wird resolveBattle(playerCard, enemyCard, true) aufgerufen.

        Wenn der Gegner gewonnen hat, wird resolveBattle(enemyCard, playerCard, false) aufgerufen.

        Wenn es ein Unentschieden gibt, werden beide Karten entfernt.

    resolveBattle(attackingCard, defendingCard, isPlayerAttacking)

        Hier wird die Schadensberechnung durchgeführt.

        Der Angriffswert des Angreifers (Spieler oder Gegner) wird mit dem Verteidigungswert des Verteidigers (Gegner oder Spieler) verglichen.

        Falls der Schaden positiv ist, wird Schaden zugefügt und der HP-Wert des Verteidigers reduziert.

        addDamageEffect(x, y, damageAmount) – Ein Schadenseffekt wird auf dem Canvas angezeigt.

        removeCardFromGame(cardToRemove) – Nach dem Kampf werden die Karten aus dem Spiel entfernt.

        updateHPdisplay() – Die HP-Anzeige wird aktualisiert.

        checkGameOver() – Es wird überprüft, ob das Spiel vorbei ist (z.B. wenn der HP-Wert eines Spielers auf 0 ist).

        Ziel: Der Kampf wird entschieden, Karten werden entfernt, und das Spiel überprüft, ob es ein Gewinner gibt.

### 4. Gegnerzug

    enemyTurn()

        Der Gegner wählt eine Karte aus, die noch nicht umgedreht ist.

        Die Karte wird umgedreht: randomCard.isFlipped = true;

        drawCards() – Alle Karten werden erneut auf dem Canvas gezeichnet.

        playerCards.find(card => card.isFlipped) – Es wird geprüft, ob der Spieler eine Karte gespielt hat.

        Wenn der Spieler eine Karte gespielt hat, wird checkBattle() aufgerufen.

        Ziel: Der Gegner macht seinen Zug und prüft dann den Kampf.

### 5. Kampfbehandlung – nach dem Gegnerzug

    checkBattle() (wiederum)

        Hier wird erneut geprüft, ob beide Spieler Karten gespielt haben.

        Falls ja, wird der Kampf zwischen der Spieler- und der Gegnerkarte entschieden.

        resolveBattle() wird aufgerufen, um den Kampf zu berechnen.

    Ziel: Es wird erneut geprüft, ob beide Karten für einen Kampf bereit sind, und der Kampf wird durchgeführt.

### 6. Spielablauf fortsetzen (nach jedem Zug)

    battleInProgress

        Nach jedem Zug wird der Status des Kampfes durch die Variable battleInProgress überwacht. Wird battleInProgress auf true gesetzt, können keine weiteren Aktionen stattfinden, bis der Kampf abgeschlossen ist.

    setTimeout()

        Hier wird durch setTimeout() ein kurzer Zeitraum eingeführt, um den Kampf fortzusetzen, nachdem eine Entscheidung getroffen wurde (z.B. der Gegnerzug nach dem Spielerzug).

### 7. Endgültiges Ergebnis (Spiel beendet)

    checkGameOver()

    Diese Funktion wird aufgerufen, um zu prüfen, ob das Spiel zu Ende ist. Es gibt verschiedene Szenarien, in denen das Spiel endet:

            Wenn beide Spieler 0 HP haben (Unentschieden).

            Wenn der Gegner oder der Spieler 0 HP hat (Sieg oder Niederlage).

            Wenn keine Karten mehr übrig sind.

        Ziel: Das Spiel überprüft, ob es einen Gewinner gibt und gibt eine entsprechende Nachricht aus (z.B. "You won 🎉").