let deck = [];
let enemies = [];
let currentEnemyIndex = 0;
let score = 0;

// Charger les cartes du deck et les ennemis depuis JSON
async function loadGameData() {
    deck = await fetch('data/deck.json').then(res => res.json());
    enemies = await fetch('data/enemies.json').then(res => res.json());
}

// Fonction pour afficher les onglets
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';

    if (tabId === 'deck') {
        displayDeck();
    }
}

// Afficher le deck du joueur
function displayDeck() {
    const deckContainer = document.getElementById('deck-cards');
    deckContainer.innerHTML = '';
    deck.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <img src="${card.image}" alt="${card.name}" class="card-image">
            <h3>${card.name}</h3>
            <p>Univers : ${card.universe}</p>
            <p>Niveau : ${card.level}</p>
            <p>Force : ${card.stats.strength}</p>
            <p>Mana : ${card.stats.mana}</p>
            <p>Vitesse : ${card.stats.speed}</p>
            <p>Popularité : ${card.stats.popularity}</p>
        `;
        deckContainer.appendChild(cardElement);
    });
}

// Fonction pour démarrer le jeu
function startGame() {
    loadGameData().then(() => {
        score = 0;
        currentEnemyIndex = 0;
        displayDeck(); // Charger le deck si ce n'est pas déjà fait
        nextTurn();
    });
}

// Afficher l'adversaire actuel
function displayEnemy() {
    const enemy = enemies[currentEnemyIndex];
    const enemyContainer = document.getElementById('enemy-card');
    enemyContainer.innerHTML = `
        <img src="${enemy.image}" alt="${enemy.name}" class="enemy-image">
        <h3>${enemy.name}</h3>
        <p>Stat cible : ${enemy.stat} - Valeur : ${enemy.value}</p>
    `;
}

// Fonction pour jouer un tour
function nextTurn() {
    if (currentEnemyIndex >= enemies.length) {
        alert("Vous avez gagné le jeu !");
        return;
    }

    const enemy = enemies[currentEnemyIndex];
    displayEnemy();

    // Tirer une carte aléatoire du deck
    const selectedCard = deck[Math.floor(Math.random() * deck.length)];
    const cardStat = selectedCard.stats[enemy.stat];

    if (cardStat >= enemy.value) {
        score += 100;
        currentEnemyIndex++;
        alert(`Victoire ! Vous gagnez 100 points. Score : ${score}`);
    } else {
        // Si la carte est éliminée, on la retire du deck
        const index = deck.indexOf(selectedCard);
        if (index > -1) deck.splice(index, 1);
        alert(`Défaite ! La carte ${selectedCard.name} est éliminée.`);
    }

    // Mise à jour du score
    document.getElementById('score').textContent = `Score : ${score}`;

    // Vérification de l'état du deck
    if (deck.length === 0) {
        alert("Vous avez perdu toutes vos cartes ! Game Over.");
    }
}

// Charger les données de jeu au chargement de la page
loadGameData();
