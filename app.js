// Daten aus dem Handy-Speicher laden (oder leer starten)
let dogs = JSON.parse(localStorage.getItem('welpenDaten')) || [];

// Daten speichern
function saveData() {
    localStorage.setItem('welpenDaten', JSON.stringify(dogs));
}

document.getElementById('add-dog-btn').addEventListener('click', () => {
    const dogName = prompt("Name des Hundes:");
    if (!dogName) return;
    
    const birthday = prompt("Geburtstag (Format: JJJJ-MM-TT, z.B. 2023-10-15):");
    
    dogs.push({ 
        id: Date.now(), 
        name: dogName, 
        birthday: birthday || "Unbekannt",
        weights: [] 
    });
    saveData();
    renderDogs();
});

function berechneAlterInWochen(geburtsdatum) {
    if (geburtsdatum === "Unbekannt") return "?";
    const heute = new Date();
    const geburt = new Date(geburtsdatum);
    if (isNaN(geburt.getTime())) return "Ungültiges Datum";
    
    const diffTime = Math.abs(heute - geburt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return Math.floor(diffDays / 7) + " Wochen";
}

function renderDogs() {
    const container = document.getElementById('app-container');
    container.innerHTML = '';
    
    dogs.forEach(dog => {
        // Zunahme berechnen
        let zunahme = 0;
        let statText = "Noch keine Daten";
        
        if (dog.weights.length > 0) {
            const erstesGewicht = dog.weights[0].value;
            const letztesGewicht = dog.weights[dog.weights.length - 1].value;
            zunahme = (letztesGewicht - erstesGewicht).toFixed(2);
            statText = `Zunahme: ${zunahme > 0 ? '+' : ''}${zunahme} kg`;
        }

        const card = document.createElement('div');
        card.className = 'dog-card';
        card.innerHTML = `
            <h2>🐕 ${dog.name}</h2>
            <div class="dog-info">
                Geb.: ${dog.birthday} | Alter: ${berechneAlterInWochen(dog.birthday)}
            </div>
            <div class="stats">${statText}</div>
            <div class="weight-entry">
                <input type="number" step="0.01" id="weight-${dog.id}" placeholder="Gewicht (kg)">
                <button onclick="addWeight(${dog.id})">Eintragen</button>
            </div>
            <div class="history">
                <strong>Verlauf:</strong><br>
                ${dog.weights.map(w => `${w.date}: ${w.value} kg`).join('<br>') || 'Noch keine Einträge.'}
            </div>
        `;
        container.appendChild(card);
    });
}

function addWeight(dogId) {
    const dog = dogs.find(d => d.id === dogId);
    const input = document.getElementById(`weight-${dogId}`);
    
    if (dog && input.value) {
        const heute = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
        dog.weights.push({ date: heute, value: parseFloat(input.value) });
        input.value = '';
        saveData();
        renderDogs();
    } else {
        alert("Bitte gib ein gültiges Gewicht ein.");
    }
}

// Initiale Anzeige
renderDogs();
