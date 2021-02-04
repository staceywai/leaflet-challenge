
// Visualizing Significant Earthquakes in Past 30 Days

// Get your data set and store API endpoint inside url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Create map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 2
    // layer: [outdoormap, satellitemap]
    });

    // Add tile layers
    var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    }).addTo(myMap);
    
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
    }).addTo(myMap);
    
    // get earthquake data with d3
    d3.json(url).then(function(data) {

        console.log(data.features);

        function getColor(data) {

            if (data > 110 ) return '#990000'
            else if  (data > 90  ) return '#d7301f'
            else if  (data > 70  ) return '#ef6548' 
            else if  (data > 50  ) return '#fc8d59' 
            else if  (data > 30  ) return '#fdbb84' 
            else if  (data > 10  ) return '#fdd49e' 
            else return '#fef0d9';
        }

        // add earthquake markers
        function pointToLayerFunc(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag*2,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "white",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.7
            });
        }
        // Add pop-up w/ info about earthquakes
        function onEachFeatureFunc(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p><strong>Time: </strong>" + new Date(feature.properties.time) + "</p>"+
            "<p><strong>Magnitude: </strong>" + feature.properties.mag + "</p>"
            );
        }
    
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    var earthquakes = L.geoJSON(data.features, {
            onEachFeature: onEachFeatureFunc,
            pointToLayer: pointToLayerFunc
    }).addTo(myMap);  

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Outdoor Map": outdoormap,
        "Satellite Map": satellitemap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create a layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90, 110],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

    });




