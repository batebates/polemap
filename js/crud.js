const API_URL = "http://148.113.45.125:3000/lieux";
// Charger les lieux depuis l'API
function chargerLieux() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            document.getElementById("lieux-list").innerHTML = "";
            data.forEach(lieu => {
                let marker = L.marker([lieu.latitude, lieu.longitude]).addTo(map)
                    .bindPopup(`<b>${lieu.nom}</b><br>${lieu.adresse} <br>
                    <button onclick="supprimerLieu(${lieu.id})">🗑 Supprimer</button>`);

                let li = document.createElement("li");
                li.innerHTML = `${lieu.nom} - ${lieu.adresse}
                    <button onclick="supprimerLieu(${lieu.id})">🗑 Supprimer</button>`;
                document.getElementById("lieux-list").appendChild(li);
            });
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
chargerLieux();
