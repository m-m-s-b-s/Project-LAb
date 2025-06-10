const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');

// Start camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => { video.srcObject = stream; })
  .catch(err => { overlay.innerText = "Camera error"; });

// Auto-refresh on load
refreshDirection();

// Button function
function refreshDirection() {
  overlay.innerText = "Calculating...";

  // If user input is given
  const fromValue = fromInput.value.trim();
  const toValue = toInput.value.trim();

  let destLat = 35.835400; // Default: Katsuji Mate Temple
  let destLon = 139.610400;

  if (toValue && toValue.includes(",")) {
    const parts = toValue.split(",");
    destLat = parseFloat(parts[0]);
    destLon = parseFloat(parts[1]);
  }

  if (fromValue && fromValue.includes(",")) {
    // Use manual current location
    const parts = fromValue.split(",");
    const currentLat = parseFloat(parts[0]);
    const currentLon = parseFloat(parts[1]);
    const message = calculateDirection(currentLat, currentLon, destLat, destLon);
    overlay.innerText = message;
    updateArrow(message);
  } else {
    // Use real GPS
    navigator.geolocation.getCurrentPosition(position => {
      const currentLat = position.coords.latitude;
      const currentLon = position.coords.longitude;
      const message = calculateDirection(currentLat, currentLon, destLat, destLon);
      overlay.innerText = message;
      updateArrow(message);
    }, err => {
      overlay.innerText = "Location error";
    });
  }
}

function calculateDirection(currLat, currLon, destLat, destLon) {
  const deltaLat = destLat - currLat;
  const deltaLon = destLon - currLon;

  if (Math.abs(deltaLat) < 0.0005 && Math.abs(deltaLon) < 0.0005) return "You have arrived!";
  if (deltaLat > 0.0005 && deltaLon > 0.0005) return "Go Right";
  if (deltaLat > 0.0005 && deltaLon < -0.0005) return "Turn Left";
  if (deltaLat > 0.0005) return "Go Straight";
  return "Turn Around";
}

function updateArrow(message) {
  const arrow = document.getElementById('direction-arrow');
  arrow.style.display = "block";

  if (message.includes("Straight")) arrow.src = "images/straight.png";
  else if (message.includes("Left")) arrow.src = "images/left.png";
  else if (message.includes("Right")) arrow.src = "images/right.png";
  else if (message.includes("Turn Around")) arrow.src = "images/uturn.png";
  else arrow.style.display = "none"; // Hide for "You have arrived!"
}
