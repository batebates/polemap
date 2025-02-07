// 🔐 Stocker le hash du mot de passe (mot de passe : "monSuperMotDePasse123")
const HASH_STOCKE = "6cc4f9e81df815c52e73b1562df40607"; // MD5("Amusez-vous")
const API_URL = "http://148.113.45.125:3000/lieux";
// Coordonnées d'Exotea à Toulouse
const EXOTEA_LAT = 43.606056535595776;
const EXOTEA_LON = 1.428372974796818;
let map;

/**
 * Calcule la distance entre deux points GPS en km avec la formule de Haversine
 * @param {number} lat1 - Latitude du premier point
 * @param {number} lon1 - Longitude du premier point
 * @param {number} lat2 - Latitude du second point
 * @param {number} lon2 - Longitude du second point
 * @returns {number} Distance en kilomètres
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon moyen de la Terre en km
    const toRadians = angle => (angle * Math.PI) / 180;

    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en km
}


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
//custom max min header filter
var minMaxFilterEditor = function(cell, onRendered, success, cancel, editorParams){

    var end;

    var container = document.createElement("span");

    //create and style inputs
    var start = document.createElement("input");
    start.setAttribute("type", "number");
    start.setAttribute("placeholder", "Min");
    start.setAttribute("min", 0);
    start.setAttribute("max", 100);
    start.style.padding = "4px";
    start.style.width = "50%";
    start.style.boxSizing = "border-box";

    start.value = cell.getValue();

    function buildValues(){
        success({
            start:start.value,
            end:end.value,
        });
    }

    function keypress(e){
        if(e.keyCode == 13){
            buildValues();
        }

        if(e.keyCode == 27){
            cancel();
        }
    }

    end = start.cloneNode();
    end.setAttribute("placeholder", "Max");

    start.addEventListener("change", buildValues);
    start.addEventListener("blur", buildValues);
    start.addEventListener("keydown", keypress);

    end.addEventListener("change", buildValues);
    end.addEventListener("blur", buildValues);
    end.addEventListener("keydown", keypress);


    container.appendChild(start);
    container.appendChild(end);

    return container;
 }

//custom max min filter function
function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams){
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

        if(rowValue){
            if(headerValue.start != ""){
                if(headerValue.end != ""){
                    return rowValue >= headerValue.start && rowValue <= headerValue.end;
                }else{
                    return rowValue >= headerValue.start;
                }
            }else{
                if(headerValue.end != ""){
                    return rowValue <= headerValue.end;
                }
            }
        }

    return true; //must return a boolean, true if it passes the filter.
}
let table = new Tabulator("#bdd-table", {
    layout:"fitColumns",
    rowContextMenu: rowMenu,
    pagination:"local",
    paginationSize:10,
    paginationSizeSelector:[10, 50, 100],
    movableColumns:true,
    paginationCounter:"rows",
    columns:[
        {title:"Id", field:"id",sorter:"number", headerMenu:headerMenu, visible:false},
        {title:"Nom", field:"nom", hozAlign:"center", headerMenu:headerMenu, headerFilter:"input"},
        {title:"Latitude", field:"latitude", headerMenu:headerMenu, visible:false},
        {title:"Longitude", field:"longitude", hozAlign:"center", headerMenu:headerMenu, visible:false},
        {title:"Distance (km)", field:"distance", headerMenu:headerMenu, sorter:"number", headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false},
        {title:"Adresse", field:"adresse", headerMenu:headerMenu, headerFilter:"input"},
        {title:"Statut d'activité", field:"active", headerMenu:headerMenu, editor:"input", headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
        {title:"Début", field:"date_start", headerMenu:headerMenu, sorter:"date",  headerFilter:"input"},
        {title:"Fin", field:"date_end", headerMenu:headerMenu, sorter:"date",  headerFilter:"input"},
        {title:"Type de lieu", field:"type", headerMenu:headerMenu,visible:false, editor:"input", headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
        {title:"Email", field:"mail", headerMenu:headerMenu,visible:false,headerFilter:"input"},
        {title:"Téléphone", field:"phone", headerMenu:headerMenu,visible:false,headerFilter:"input"},
        {title:"Facebook", field:"facebook", headerMenu:headerMenu,visible:false,headerFilter:"input"},
        {title:"Instagram", field:"instagram", headerMenu:headerMenu,visible:false,headerFilter:"input"},
        {title:"Site Web", field:"site_web", headerMenu:headerMenu,visible:false,headerFilter:"input"},
        {title:"Status du contact", field:"status_contact", headerMenu:headerMenu, editor:"input", headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
        {title:"Status de la relation", field:"status_relation", headerMenu:headerMenu, editor:"input", headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
        {title:"Commentaire", field:"commentaire", headerMenu:headerMenu,headerFilter:"input"},
        {title:"Source", field:"source", headerMenu:headerMenu,visible:false,headerFilter:"input"},
        {title:"Date de la création", field:"time_creation", headerMenu:headerMenu,visible:false, sorter:"date",  headerFilter:"input"},
        {title:"Date de la dernière update", field:"time_last_update", headerMenu:headerMenu,visible:false, sorter:"date",  headerFilter:"input"},
    ],
    dataLoaded: function() {
        chargerMap();
    },
    dataFiltered: function() {
        chargerMap();
    }
});
table.on("renderComplete", function(){
    chargerMap();
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
// Charger les lieux depuis l'API
function chargerLieux() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            // Ajouter le champ "distance" pour chaque lieu
            data.forEach(lieu => {
                if (lieu.latitude && lieu.longitude) {
                    lieu.distance = haversineDistance(EXOTEA_LAT, EXOTEA_LON, lieu.latitude, lieu.longitude).toFixed(2);
                } else {
                    lieu.distance = ""; // Si pas de coordonnées GPS
                }
            });
            table.setData(data);
            chargerMap();
        });
}

function chargerMap() {
    
    if (map) {
        map.eachLayer(layer => {
            if (layer.toGeoJSON) {
                map.removeLayer(layer);
            }
        });
    } else {
        map = L.map('map').setView([43.606346535595776, 1.429172974796818], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    }

    // Après affichage, forcer Leaflet à recalculer la taille de la carte
    setTimeout(() => {
        map.invalidateSize();
    }, 300);
    let dataFiltered = table.getData("active");
    var ExoIcon = L.icon({
    iconUrl: 'data/Logo Exotea.png',
    iconSize:     [60, 60], // size of the icon
    iconAnchor:   [30, 30], // point of the icon which will correspond to marker's location
    popupAnchor:  [-2, -65] // point from which the popup should open relative to the iconAnchor
    });
    
    var marker = L.marker([43.606056535595776, 1.428372974796818], {icon: ExoIcon}).addTo(map);
    marker.bindPopup("<b>Hello Prexii, Bonne journée à toi !</b>");
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
    Object.keys(dataFiltered).forEach(key => {
        let lieu = dataFiltered[key];
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

