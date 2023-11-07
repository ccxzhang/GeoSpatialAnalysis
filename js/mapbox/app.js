mapboxgl.accessToken = "pk.eyJ1IjoiY3poYW5nNyIsImEiOiJjbG11M3E1ZGUwN2VpMnF0M2Yzczc3enZpIn0.JesN1SstpdmZhkYyp6yZ-w";
const columnHeaders = config.sideBarInfo;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [160, 4],
    zoom: 4,
});

async function fetchLookupTable() {
    const response = await fetch('cc_trimed.csv', { method: 'GET' });
    return await response.text();
  }


map.on('load', () => {
    map.addSource('country_info', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: 'pic_info.geojson'
    });

    map.addLayer({
        'id': 'info_layer',
        'type': 'fill',
        'source': 'country_info',
        'paint': {
            'fill-outline-color': '#484896',
            'fill-color': ['interpolate', ["linear"], ['get', 'pop_2019'],
                0,
                '#F2F12D',
                5000,
                '#EED322',
                10000,
                '#E6B71E',
                50000,
                '#DA9C20',
                100000,
                '#CA8323',
                250000,
                '#B86B25',
                500000,
                '#A25626'],
            'fill-opacity': 0.75
        }
    });

    map.on('click', 'info_layer', (e) => {

        // Set up the Popup HTML 
        const popUpHTML = 'ADM1 Name: ' + e.features[0].properties.NAME_1 + "<br>" + "Population (2019): " + (e.features[0].properties.pop_2019).toFixed(1) + "<br>"
            + 'GDP (2019): $' + (e.features[0].properties.K_2019).toFixed(1);
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popUpHTML)
            .addTo(map);
    });

    const admLegendEl = document.getElementById('adm-legend');
    map.on('zoom', () => {
        admLegendEl.style.display = 'block';
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'info_layer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'info_layer', () => {
        map.getCanvas().style.cursor = '';
    });
});