var map = L.map('map').setView([43.606346535595776, 1.429172974796818], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
// Fonction pour décoder le fichier CSV encodé en Base85
function decodeBase85(encodedText) {
    try {
        let decodedBytes = atob(encodedText); // Décodage Base64 (équivalent pour Base85 selon l'encodage utilisé)
        return new TextDecoder("utf-8").decode(Uint8Array.from(decodedBytes, c => c.charCodeAt(0)));
    } catch (error) {
        console.error("Erreur de décodage Base85:", error);
        return "";
    }
}
// Fonction pour charger et lire le CSV encodé en Base85
function chargerCSV(url) {
    fetch(url)
        .then(response => response.text())  // Récupérer le texte encodé
        .then(encodedText => {
            let decodedCSV = decodeBase85(encodedText); // Décodage Base85 -> CSV brut
            Papa.parse(decodedCSV, {
                header: true, // Prend en compte les noms de colonnes
                skipEmptyLines: true,
                complete: function(resultats) {
                    ajouterMarqueurs(resultats.data);
                }
            });
        })
        .catch(error => console.error("Erreur de chargement du CSV:", error));
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
chargerCSV('./data/data');
var marker = L.marker([43.606346535595776, 1.428172974796818]).addTo(map);
marker.bindPopup("<b>Hello Prexii!</b>");
