var i = 1;
var map = L.map("map");
navigator.geolocation.watchPosition(success, error);
function success(pos) {
  const user_lat = pos.coords.latitude;
  const user_lng = pos.coords.longitude;
  const location_accuracy = pos.coords.accuracy;
  L.marker([user_lat, user_lng]).addTo(map);
  L.circle([user_lat, user_lng], { radius: accuracy }).addTo(map);
  console.log("accuracy=", location_accuracy);
}
function error(err) {
  console.log("error", err.code);
  console.log("error message", err.message);
}

let markers = [];

map.setView([27.697883, 85.320194], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

map.on("contextmenu", function () {
  console.log("Right clicked!");
});

map.on("contextmenu", function (e) {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  L.popup()
    .setLatLng(e.latlng)
    .setContent(
      `
        <button id="set_pickup">
        Set Pickup Location</button>
     `,
    )
    .openOn(map);
  document.getElementById("set_pickup").addEventListener("click", function () {
    set_marker(lat, lng);
  });
});

function set_marker(lat, lng) {
  markers.push([lat, lng]);
  const marker = L.marker([lat, lng]).addTo(map);

  map.closePopup();
  marker.bindPopup(`
    <button id="remove_location"> Remove Marker </button>
    `);
  marker.on("popupopen", function (event) {
    const markerpopup = event.popup.getElement();
    markerpopup
      .querySelector("#remove_location")
      .addEventListener("click", function () {
        console.log("locationremoved=", event.popup);
        map.removeLayer(marker);
      });
  });
  let waypoints = markers;
  console.log(markers);
  // if (waypoints.lenght < 2) {
  L.Routing.control(
    { waypoints: waypoints },
    {
      createMarker: function () {
        return null;
      },
    },
  ).addTo(map);
  // }
}

let waypoints = 0;
