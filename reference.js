let all_markers_positions = [];
var map = L.map("map");
map.setView([27.700571, 85.318812], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

navigator.geolocation.watchPosition(success, error);

function success(position) {
  user_lat = position.coords.latitude;
  user_lng = position.coords.longitude;
  user_accuracy = position.coords.accuracy;
  user_marker = L.marker([user_lat, user_lng]).addTo(map);
  user_circle = L.circle([user_lat, user_lng], { radius: user_accuracy }).addTo(
    map,
  );
}

function error() {
  alert("NO USER LOCATION!!");
}

map.on("contextmenu", function (e) {
  console.log("Right Clicked!");
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  L.popup()
    .setLatLng(e.latlng)
    .setContent(
      `
      Type of waste:<br>
      <br><select id= Type>

      <option value="recyclable">Recyclable</option>
      <option value="biodegradable">Biodegradable</option>
      <option value="non-degradable">Non-degradable</option>
      
      </select><br><br>

        <button id="add_marker_here">Set location Here<button>
        `,
    )
    .openOn(map);

  document
    .getElementById("add_marker_here")
    .addEventListener("click", function () {
      creats_marker(lat, lng);
    });
});

function creats_marker(lat, lng) {
  const marker_position = [lat, lng];
  all_markers_positions.push(marker_position);
  console.log(all_markers_positions);
  const created_marker = L.marker([lat, lng]).addTo(map);
  map.closePopup();
  created_marker.bindPopup(
    `<button id="removal_button">Remove Location</button>`,
  );
  created_marker.on("popupopen", function (event) {
    const marker_deleting = event.popup
      .getElement()
      .querySelector("#removal_button");
    marker_deleting.addEventListener("click", function () {
      const index = all_markers_positions.indexOf(marker_position);
      map.removeLayer(created_marker);
      if (index !== -1) {
        all_markers_positions.slice(index, 1);
        console.log();
      }
    });
  });
}
