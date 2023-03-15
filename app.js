/*
// Map
*/

// REMOVE IT
var center = [55.76, 37.64];

const mapConfig = {
    minZoom: 5,
    maxZoom: 18,
    zoomSnap: 0.25,

    zoomControl: false,
    zoomAnimation: false,
    markerZoomAnimation: false,

    attributionControl: false,
};
var myMap;

initMap();

function initMap(){
    myMap = L.map('map', mapConfig).setView(center, 10);

    var ggl_layer = L.gridLayer
        .googleMutant({
          type: "roadmap", // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        });
    myMap.addLayer(ggl_layer);

    L.control.zoom({
      position:'topright'
    }).addTo(myMap);

    var markers = initMarkers()

    myMap.addLayer(markers);

    myMap.on('popupopen', function(e) {
      var marker = e.popup._source;
      marker._icon.style.display = 'none';
    });

    myMap.on('popupclose', function(e) {
      var marker = e.popup._source;
      marker._icon.style.display = '';
    });

    return;
}

function initMarkers() {
  var markers = L.markerClusterGroup({
    maxClusterRadius: 48,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    chunkedLoading: true,
    animate: false,
    animateAddingMarkers: false,
    spiderfyOnMaxZoom: false,
    disableClusteringAtZoom: 18,

    iconCreateFunction: function(cluster) {
      return L.divIcon({
        className: 'cluster-pharm-icon', 
        iconSize: [80, 80], 
        iconAnchor: [-40, -40],
        html: '<b>' + cluster.getChildCount() + '</b>' 
      });
    },
  });

  features.features.forEach((pharm, index) => {
    var marker = L.marker(
      pharm.geometry.coordinates,
      {
        icon: L.divIcon({className: 'pharm-icon', iconSize: [50, 58],}),
    });
    var popup = L.popup({
      autoClose: false,
    })
    .setContent(`<strong style="font-weight: 500; font-size: 20px;">${pharm.properties.balloonPharmName}</strong>\
            <p style="margin-top: 8px;">${pharm.properties.balloonContent}</p>\
            `)

    marker.bindPopup(popup);
    markers.addLayer(marker);
  });

  markers.on('clustermouseover', function(event) {
    var marker = event.layer;
    if (marker && marker._icon && marker._icon.style) {
      marker._icon.style.zIndex = 20;
    }
  });

  markers.on('clustermouseout', function(event) {
      var marker = event.layer;
      if (marker && marker._icon && marker._icon.style) {
        marker._icon.style.zIndex = 10;
      }

  });

  markers.on('clusterclick', function (event) {
    var bounds = event.layer.getBounds().pad(0.5);
    myMap.fitBounds(bounds, {animate: false});
  });

  return markers;
}

const goToBounds = (bounds) => {
  myMap.fitBounds(bounds);
}

const goToCoords = (coords) => {
  myMap.setView(coords);
}

/*
// Suggestion input
*/

// You can use geoProvider for suggestions:
// const provider = new GeoSearch.OpenStreetMapProvider();
// const results = await provider.search({ query: suggestInput.value });
// displaySuggestion(...)


const autocompleteService = new google.maps.places.AutocompleteService();
const placesService = new google.maps.places.PlacesService(document.createElement('div'));

const suggestInput = document.getElementById('map-input');
const suggestList = document.getElementById('suggest-list');
let currentTimeoutId = null;

// Add event listeners
suggestInput.addEventListener('input', handleInput);
suggestInput.addEventListener('keydown', handleKeydown);
suggestInput.addEventListener('focus', handleFocus);
document.addEventListener('click', handleClickOutside);

function handleInput(event) {
  suggestList.innerHTML = '';

  // Cancel previous timeout (if exists)
  if (currentTimeoutId) {
    clearTimeout(currentTimeoutId);
  }

  // Wait for 500ms to prevent previous query search on new input
  currentTimeoutId = setTimeout(async () => {
    autocompleteService.getPlacePredictions({
      input: suggestInput.value,
      types: ['geocode']
    }, (predictions, status) => {
      if (status !== 'OK') {
        console.error(`AutocompleteService error: ${status}`);
        return;
      }

      predictions.forEach( (prediction) => {
        const placeId = prediction.place_id;
        placesService.getDetails({ placeId: placeId }, (placeResult, status) => {
          // Check if the PlaceService request was successful
          if (status !== 'OK') {
            console.error(`PlaceService error: ${status}`);
            return;
          }

          // Extract the latitude and longitude coordinates from the place's geometry location
          const lat = placeResult.geometry.location.lat();
          const lng = placeResult.geometry.location.lng();

          displaySuggestion(prediction.description, [lat, lng]);
        });
      });  
    });
  }, 500);

  suggestList.style.display = 'block';
};

function handleKeydown(event) {
  if (event.key === 'Enter') {
    // Select first suggestion
    const firstSuggestion = suggestList.querySelector('li');
    firstSuggestion.click();
  }
}

function handleFocus() {
  if (suggestList.childNodes.length > 0) {
    suggestList.style.display = 'block';
  }
}

// Hide suggestions list when user clicks outside input and list
function handleClickOutside(event) {
  if (!suggestInput.contains(event.target) && !suggestList.contains(event.target)) {
    suggestList.style.display = 'none';
  }
}

function displaySuggestion(description, coords) {
  const li = document.createElement('li');
  li.classList.add("list-items");
  li.style.cursor = "pointer";
  li.innerText = description;
  li.addEventListener("click", () => {
    goToCoords(coords)
    suggestInput.value = description;
    suggestList.style.display = 'none';
  });

  suggestList.appendChild(li);
}
