// 🔐 Stocker le hash du mot de passe (mot de passe : "monSuperMotDePasse123")
const HASH_STOCKE = "6cc4f9e81df815c52e73b1562df40607"; // MD5("Amusez-vous")
const API_URL = "http://148.113.45.125:3000/lieux";
let map;
var table = new Tabulator("#bdd-table", {
    height:"311px",
    layout:"fitColumns",
    autoColumns:true
});

// Vérifier le mot de passe
function verifierMotDePasse() {
    let mdpUtilisateur = document.getElementById("password").value;
    let hashUtilisateur = CryptoJS.MD5(mdpUtilisateur).toString(); // Hasher l'entrée utilisateur en MD5

    if (hashUtilisateur === HASH_STOCKE) {
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("map-container").style.display = "block";
        // Attendre un court instant avant d'initialiser la carte
        setTimeout(chargerLieux, 100); 
    } else {
        document.getElementById("error-message").textContent = "Mot de passe incorrect.";
    }
}
// Initialisation de la carte
function chargerLieux() {
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
            var ExoIcon = L.icon({
            iconUrl: 'data/Logo Exotea.png',
            iconSize:     [60, 60], // size of the icon
            iconAnchor:   [30, 30], // point of the icon which will correspond to marker's location
            popupAnchor:  [-2, -65] // point from which the popup should open relative to the iconAnchor
        });
        var marker = L.marker([43.606056535595776, 1.428372974796818], {icon: ExoIcon}).addTo(map);
        marker.bindPopup("<b>Hello Prexii, Bonne journée à toi !</b>");
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

// Charger les lieux depuis l'API
function chargerLieux() {
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

    var ExoIcon = L.icon({
    iconUrl: 'data/Logo Exotea.png',
    iconSize:     [60, 60], // size of the icon
    iconAnchor:   [30, 30], // point of the icon which will correspond to marker's location
    popupAnchor:  [-2, -65] // point from which the popup should open relative to the iconAnchor
    });
    
    var marker = L.marker([43.606056535595776, 1.428372974796818], {icon: ExoIcon}).addTo(map);
    marker.bindPopup("<b>Hello Prexii, Bonne journée à toi !</b>");
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            var GreenIcon = L.icon({
            iconUrl: 'data/poleicoblack.png',
            iconSize:     [43, 65], // size of the icon
            iconAnchor:   [21, 65], // point of the icon which will correspond to marker's location
            popupAnchor:  [-2, -65] // point from which the popup should open relative to the iconAnchor
            });
            var BlueIcon = L.icon({
            iconUrl: 'data/poleicoblue.png',
            iconSize:     [43, 65], // size of the icon
            iconAnchor:   [20, 65], // point of the icon which will correspond to marker's location
            popupAnchor:  [-2, -65] // point from which the popup should open relative to the iconAnchor
            });
            var PinkIcon = L.icon({
            iconUrl: 'data/poleicopink.png',
            iconSize:     [43, 65], // size of the icon
            iconAnchor:   [23, 65], // point of the icon which will correspond to marker's location
            popupAnchor:  [-2, -65] // point from which the popup should open relative to the iconAnchor
            });
            var RedIcon = L.icon({
            iconUrl: 'data/poleicored.png',
            iconSize:     [43, 65], // size of the icon
            iconAnchor:   [19, 65], // point of the icon which will correspond to marker's location
            popupAnchor:  [-2, -65] // point from which the popup should open relative to the iconAnchor
            });
            var Icon;
            data.forEach(lieu => {
                switch (lieu.type) {
                  case 'ecole':
                    Icon = GreenIcon;
                    break;
                  case 'concurrent':
                    Icon = RedIcon;
                    break;
                  case 'event':
                    Icon = PinkIcon;
                    break;
                  default:
                    Icon = BlueIcon;
                }
                if (lieu.latitude && lieu.longitude) {
                    let marker = L.marker([lieu.latitude, lieu.longitude], {icon: Icon}).addTo(map)
                        .bindPopup(`<b>${lieu.nom}</b><br>${lieu.adresse} <br>
                        <button onclick="supprimerLieu(${lieu.id})">🗑 Supprimer</button>`);
                }
            });
            table.setData(data);
        });
}

// 📌 Ajouter un lieu
function ajouterLieu() {
    let nom = document.getElementById("nom").value;
    let adresse = document.getElementById("adresse").value;
    let latitude = parseFloat(document.getElementById("latitude").value);
    let longitude = parseFloat(document.getElementById("longitude").value);

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, latitude, longitude, adresse })
    }).then(() => chargerLieux());
}

// 📌 Supprimer un lieu
function supprimerLieu(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => chargerLieux());
}

