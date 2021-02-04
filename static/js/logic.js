
// visualize an earthquake data set.

// 1. **Get your data set**
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    // The data.features object is in the GeoJSON standard
    console.log(data.features);

    // var earthquakes = L.geoJSON(data.features);

    function onEachFeatureFunc(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p><strong>Date Time: </strong>" + new Date(feature.properties.time) + "</p>"+
        "<p><strong>Magnitude: </strong>" + feature.properties.mag + "</p>"
        );
    }
    
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    
    function pointToLayerFunc(feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
    
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    // Paste this into the .then() function
    var earthquakes = L.geoJSON(data.features, {
            onEachFeature: onEachFeatureFunc,
            pointToLayer: pointToLayerFunc
    });  

    // 2. **Import & Visualize the Data**
    //    Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.
    // The rest of this is all the same
    var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
    });

    // var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    //     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    //     maxZoom: 18,
    //     id: "dark-v10",
    //     accessToken: API_KEY
    // });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Outdoor Map": outdoormap,
        // "Dark Map": darkmap,
        "Satellite Map": satellitemap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes

    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
        center: [
        37.09, -95.71
        ],
        zoom: 2,
        layers: [outdoormap, earthquakes, satellitemap]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    });




