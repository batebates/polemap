// 🔐 Stocker le hash du mot de passe (mot de passe : "monSuperMotDePasse123")
const HASH_STOCKE = "6cc4f9e81df815c52e73b1562df40607"; // MD5("Amusez-vous")
let map;

// Vérifier le mot de passe
function verifierMotDePasse() {
    let mdpUtilisateur = document.getElementById("password").value;
    let hashUtilisateur = CryptoJS.MD5(mdpUtilisateur).toString(); // Hasher l'entrée utilisateur en MD5

    if (hashUtilisateur === HASH_STOCKE) {
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("map-container").style.display = "block";
        // Attendre un court instant avant d'initialiser la carte
        setTimeout(initMap, 100); 
    } else {
        document.getElementById("error-message").textContent = "Mot de passe incorrect.";
    }
}
// Initialisation de la carte
function initMap() {
        // Vérifier si la carte n'existe pas déjà (évite les doublons)
        if (map) {
            map.invalidateSize(); // Corrige les problèmes d'affichage
            return;
        }

        map = L.map('map').setView([43.606346535595776, 1.429172974796818], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Après affichage, forcer Leaflet à recalculer la taille de la carte
        setTimeout(() => {
            map.invalidateSize();
        }, 300);

        // Charger les données CSV
        chargerCSV('./data/data');
        var marker = L.marker([43.606346535595776, 1.428172974796818]).addTo(map);
        marker.bindPopup("<b>Hello Prexii!</b>");
    }
// Fonction pour décoder le fichier CSV encodé en Base85
function decodeBase64(encodedText) {
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
            let decodedCSV = decodeBase64(encodedText); // Décodage Base85 -> CSV brut
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
    var GreenIcon = L.icon({
    iconUrl: 'data/poleicoblack.png',
    iconSize:     [43, 65], // size of the icon
    iconAnchor:   [21, 65], // point of the icon which will correspond to marker's location
    popupAnchor:  [-2, -65] // point from which the popup should open relative to the iconAnchor
    });
    var BlueIcon = L.icon({
    iconUrl: 'data/poleicoblue.png',
    iconSize:     [43, 65], // size of the icon
    iconAnchor:   [21, 65], // point of the icon which will correspond to marker's location
    popupAnchor:  [-2, -65] // point from which the popup should open relative to the iconAnchor
    });
    var PinkIcon = L.icon({
    iconUrl: 'data/poleicopink.png',
    iconSize:     [43, 65], // size of the icon
    iconAnchor:   [21, 65], // point of the icon which will correspond to marker's location
    popupAnchor:  [-2, -65] // point from which the popup should open relative to the iconAnchor
    });
    var RedIcon = L.icon({
    iconUrl: 'data/poleicored.png',
    iconSize:     [43, 65], // size of the icon
    iconAnchor:   [21, 65], // point of the icon which will correspond to marker's location
    popupAnchor:  [-2, -65] // point from which the popup should open relative to the iconAnchor
    });
    var Icon;
    data.forEach(lieu => {
        switch (lieu.type) {
          case 'école':
            Icon = GreenIcon;
            break;
          case 'concurrent':
            Icon = RedIcon;
            break;
          case 'evenement':
            Icon = PinkIcon;
            break;
          default:
            Icon = BlueIcon;
        }
        if (lieu.latitude && lieu.longitude) {
            var marker = L.marker([parseFloat(lieu.latitude), parseFloat(lieu.longitude)], {icon: Icon}).addTo(map);
            marker.bindPopup(`<b>${lieu.nom}</b><br>${lieu.adresse}`);
        }
    });
}


