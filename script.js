let user_location = null;
let markers = [];
let user_marker, user_circle;
var map = L.map("map");

map.setView([27.697883, 85.320194], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

navigator.geolocation.watchPosition(success, error);

function success(pos) {
  const user_lat = pos.coords.latitude;
  const user_lng = pos.coords.longitude;
  const location_accuracy = pos.coords.accuracy;
  user_location = [user_lat, user_lng];
  if (user_marker) {
    a = map.removeLayer(user_marker);
    b = map.removeLayer(user_circle);
  }
  user_marker = L.marker([user_lat, user_lng]).addTo(map);
  user_circle = L.circle([user_lat, user_lng], {
    radius: location_accuracy,
  }).addTo(map);
  console.log("User location =", user_location);
  console.log("Accuracy =", location_accuracy);
}

function error(err) {
  console.log("error", err.code);
  console.log("error message", err.message);
}

let routing_control = L.Routing.control({
  waypoints: [],

  createMarker: function () {
    return null;
  },
}).addTo(map);

function update_route() {
  // Don't create route if GPS location isn't available
  if (user_location === null) {
    console.log("User location not available yet");
    return;
  }

  const waypoints = [
    L.latLng(user_location[0], user_location[1]),

    ...markers.map(function (position) {
      return L.latLng(position[0], position[1]);
    }),
  ];

  routing_control.setWaypoints(waypoints);

  console.log("Waypoints =", waypoints);
}

map.on("contextmenu", function (e) {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  L.popup()
    .setLatLng(e.latlng)
    .setContent(
      `
      <button id="set_pickup">
        Set Pickup Location
      </button>
    `,
    )
    .openOn(map);

  document.getElementById("set_pickup").addEventListener("click", function () {
    set_marker(lat, lng);
  });
});

function set_marker(lat, lng) {
  const marker_position = [lat, lng];

  markers.push(marker_position);

  const marker = L.marker(marker_position).addTo(map);

  map.closePopup();

  marker.bindPopup(`
    <button id="remove_location">
      Remove Marker
    </button>
  `);

  marker.on("popupopen", function (event) {
    const markerpopup = event.popup.getElement();

    markerpopup
      .querySelector("#remove_location")
      .addEventListener("click", function () {
        const index = markers.indexOf(marker_position);

        if (index !== -1) {
          markers.splice(index, 1);
        }

        map.removeLayer(marker);

        map.closePopup();

        update_route();
      });
  });

  update_route();

  console.log("markers =", markers);
}
