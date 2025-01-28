var map = L.map('map').setView([43.606346535595776, 1.429172974796818], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
// Fonction pour charger et lire le CSV
function chargerCSV(url) {
    fetch(url)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true, // Prend en compte les noms de colonnes
                skipEmptyLines: true,
                complete: function(resultats) {
                    ajouterMarqueurs(resultats.data);
                }
            });
        });
}

// Fonction pour ajouter les marqueurs sur la carte
function ajouterMarqueurs(data) {
    data.forEach(lieu => {
        if (lieu.latitude && lieu.longitude) {
            var marker = L.marker([parseFloat(lieu.latitude), parseFloat(lieu.longitude)]).addTo(map);
            marker.bindPopup(`<b>${lieu.nom}</b><br>${lieu.adresse}`);
        }
    });
}

// Charger le CSV (remplacez 'data.csv' par l'URL de votre fichier)
chargerCSV('./data/data.csv');
var marker = L.marker([43.606346535595776, 1.429172974796818]).addTo(map);
marker.bindPopup("<b>Hello Prexii!</b>");
