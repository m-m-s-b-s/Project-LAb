const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const arrow = document.getElementById('direction-arrow');
const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');

// Start camera with back-facing preference
navigator.mediaDevices.getUserMedia({
  video: { facingMode: { exact: "environment" } }
})
.then(stream => { video.srcObject = stream; })
.catch(err => { overlay.innerText = "Camera error"; });

refreshDirection(); // Auto-refresh on page load

function refreshDirection() {
  overlay.innerText = "Calculating...";

  // Destination coordinates
  let destLat = 35.835400; // Katsuji Mate Temple
  let destLon = 139.610400;

  // Allow user to override destination
  const toValue = toInput.value.trim();
  if (toValue && toValue.includes(",")) {
    const [lat, lon] = toValue.split(",").map(Number);
    destLat = lat;
    destLon = lon;
  }

  const fromValue = fromInput.value.trim();
  if (fromValue && fromValue.includes(",")) {
    const [currentLat, currentLon] = fromValue.split(",").map(Number);
    showDirection(currentLat, currentLon, destLat, destLon);
  } else {
    navigator.geolocation.getCurrentPosition(position => {
      const currentLat = position.coords.latitude;
      const currentLon = position.coords.longitude;
      showDirection(currentLat, currentLon, destLat, destLon);
    }, err => {
      overlay.innerText = "Location error";
    });
  }
}

function showDirection(currentLat, currentLon, destLat, destLon) {
  const direction = calculateDirection(currentLat, currentLon, destLat, destLon);
  const distance = getDistanceInMeters(currentLat, currentLon, destLat, destLon);
  overlay.innerText = `${direction} (${distance}m to destination)`;
  updateArrow(direction);
}

function calculateDirection(currLat, currLon, destLat, destLon) {
  const deltaLat = destLat - currLat;
  const deltaLon = destLon - currLon;

  if (Math.abs(deltaLat) < 0.0005 && Math.abs(deltaLon) < 0.0005) return "You’ve arrived!";
  if (deltaLat > 0.0005 && deltaLon > 0.0005) return "Take a right from here";
  if (deltaLat > 0.0005 && deltaLon < -0.0005) return "Turn left from this point";
  if (deltaLat > 0.0005) return "Go straight from here";
  return "Turn around to reach destination";
}

function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const toRad = angle => angle * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

function updateArrow(message) {
  arrow.style.display = "block";
  if (message.includes("Go straight")) arrow.src = "images/straight.png";
  else if (message.includes("left")) arrow.src = "images/left.png";
  else if (message.includes("right")) arrow.src = "images/right.png";
  else if (message.includes("Turn around")) arrow.src = "images/uturn.png";
  else arrow.style.display = "none";
}
//Event listening for input change