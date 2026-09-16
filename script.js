// Adds a map to the page
var map = L.map("map");
const markers = [];

//sets the view of the map to a given center and zoom
map.setView([27.697883, 85.320194], 13);

// title layer for the map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

//marker example
//L.marker([27.697883, 85.320194]).addTo(map);

//create a event detector for right click on the map
map.on("contextmenu", function (e) {
  //event information in e
  console.log("Right clicked!");

  //logs the longitude of the point from e.latlng
});
//when right click detected constant lat and lng created and store e.latlng.lat and e.latlng.lng respectively.
map.on("contextmenu", function (e) {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;
  //popup generated at the point
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
  const marker = L.marker([lat, lng]).addTo(map);
  markers.push({ marker: marker, lat: lat, lng: lng });
  console.log(markers);
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
}
