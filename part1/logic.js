// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);


function color(magnitude){
  
    if (magnitude > 5){
        return "#ff3333"
    }
    else if (magnitude > 4){
        return "#ff6600"
    }
    else if (magnitude > 3){
        return "#ffff00"
    }
    else if (magnitude > 2){
        return "#99ff33"
    }
    else if (magnitude > 1){
        return "#009900"
    }
    else {
      return "#023b11"
    }
}

function circle(feature){
    return {
        opacity: 0.9,
        fillOpacity: 0.5,
        fillColor: color(feature.properties.mag),
        color: "#ffffff",
        radius: feature.properties.mag * 4,
        weight: 0.5
    }
}

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng)
    },
    style: circle
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

//   var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//     attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//   });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    // "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position:'bottomright'})

  legend.onAdd = function () {
    var items = L.DomUtil.create('div', 'info legend'),
    magnitudes = [0, 1, 2, 3, 4, 5]

    items.innerHTML += "<h3>Magnitude Level</h3>"

    for (var i = 0; i < magnitudes.length; i++){
      items.innerHTML += '<i style="background: ' + color(magnitudes[i] + 1) + '"></i> ' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }

    return items
  }
  legend.addTo(myMap)
}
});
