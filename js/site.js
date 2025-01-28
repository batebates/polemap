var map = L.map('map').setView([43.606346535595776, 1.429172974796818], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var popup = L.popup()
    .setLatLng([43.606346535595776, 1.429172974796818])
    .setContent("Exotea")
    .openOn(map);
