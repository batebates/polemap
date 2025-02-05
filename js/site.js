// 🔐 Stocker le hash du mot de passe (mot de passe : "monSuperMotDePasse123")
const HASH_STOCKE = "6cc4f9e81df815c52e73b1562df40607"; // MD5("Amusez-vous")
const API_URL = "http://148.113.45.125:3000/lieux";
let map;
//define row context menu contents
var rowMenu = [
    {
        label:"<i class='fas fa-user'></i> Change Name",
        action:function(e, row){
            row.update({name:"Steve Bobberson"});
        }
    },
    {
        label:"<i class='fas fa-check-square'></i> Select Row",
        action:function(e, row){
            row.select();
        }
    },
    {
        separator:true,
    },
    {
        label:"Admin Functions",
        menu:[
            {
                label:"<i class='fas fa-trash'></i> Delete Row",
                action:function(e, row){
                    row.delete();
                }
            },
            {
                label:"<i class='fas fa-ban'></i> Disabled Option",
                disabled:true,
            },
        ]
    }
]

//define column header menu as column visibility toggle
var headerMenu = function(){
    var menu = [];
    var columns = this.getColumns();

    for(let column of columns){

        //create checkbox element using font awesome icons
        let icon = document.createElement("i");
        icon.classList.add("fas");
        icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square");

        //build label
        let label = document.createElement("span");
        let title = document.createElement("span");

        title.textContent = " " + column.getDefinition().title;

        label.appendChild(icon);
        label.appendChild(title);

        //create menu item
        menu.push({
            label:label,
            action:function(e){
                //prevent menu closing
                e.stopPropagation();

                //toggle current column visibility
                column.toggle();

                //change menu item icon
                if(column.isVisible()){
                    icon.classList.remove("fa-square");
                    icon.classList.add("fa-check-square");
                }else{
                    icon.classList.remove("fa-check-square");
                    icon.classList.add("fa-square");
                }
            }
        });
    }

   return menu;
};

var table = new Tabulator("#bdd-table", {
    height:"100%",
    layout:"fitDataStretch",
    rowContextMenu: rowMenu,
    columns:[
        {title:"Id", field:"id",sorter:"number", headerMenu:headerMenu},
        {title:"Nom", field:"nom", hozAlign:"center", headerMenu:headerMenu},
        {title:"Latitude", field:"latitude", headerMenu:headerMenu, visible:false },
        {title:"Longitude", field:"longitude", hozAlign:"center", headerMenu:headerMenu, visible:false},
        {title:"Adresse", field:"adresse", headerMenu:headerMenu}
        {title:"Statut d'activité", field:"active", headerMenu:headerMenu}
        {title:"Début", field:"date_start", headerMenu:headerMenu}
        {title:"Fin", field:"date_end", headerMenu:headerMenu}
        {title:"Type de lieu", field:"type", headerMenu:headerMenu,visible:false}
        {title:"Email", field:"mail", headerMenu:headerMenu,visible:false}
        {title:"Téléphone", field:"phone", headerMenu:headerMenu,visible:false}
        {title:"Facebook", field:"facebook", headerMenu:headerMenu,visible:false}
        {title:"Instagram", field:"instagram", headerMenu:headerMenu,visible:false}
        {title:"Site Web", field:"site_web", headerMenu:headerMenu,visible:false}
        {title:"Status du contact", field:"status_contact", headerMenu:headerMenu}
        {title:"Status de la relation", field:"status_relation", headerMenu:headerMenu}
        {title:"Commentaire", field:"commentaire", headerMenu:headerMenu}
        {title:"Source", field:"source", headerMenu:headerMenu,visible:false}
        {title:"Date de la création", field:"time_creation", headerMenu:headerMenu,visible:false}
        {title:"Date de la dernière update", field:"time_last_update", headerMenu:headerMenu,visible:false}
    ],
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

