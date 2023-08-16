//Initialize the Map
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> By Charlie Zhang'
});

var map = L.map("map", {
    center: L.latLng(38.8977, -77.0365),
    zoom: 14,
    minZoom: 10,
    maxZoom: 20,
    layers: [osm]
});

// Read GeoJson file by ajax
var dcMetro = new L.geoJson();
dcMetro.addTo(map);

// Add layer control
var overlayMaps = {
    "D.C. Metro": dcMetro
};

L.control.layers(null, overlayMaps).addTo(map);


$.ajax({
    dataType: "json",
    url: "dc-metro-lines.json",
    success: function (data) {
        $(data.features).each(function (key, data) {
            dcMetro.addData(data);
        });
    }
}).error(function () { });

