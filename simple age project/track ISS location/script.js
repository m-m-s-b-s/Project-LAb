const map = L.map('map').setView([0, 0], 2);

const issIcon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [50, 32],
  iconAnchor: [25, 16]
});

const marker = L.marker([0, 0], { icon: issIcon }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

async function updateISS() {
  const issUrl = 'https://api.wheretheiss.at/v1/satellites/25544';
  const response = await fetch(issUrl);
  const data = await response.json();
  const { latitude, longitude, velocity } = data;

  marker.setLatLng([latitude, longitude]);
  map.setView([latitude, longitude], 2);

  // Reverse geocoding to get location name
  const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  let location = "Over the ocean or unknown area";

  try {
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();
    if (geoData.address) {
      const { city, town, village, state, country } = geoData.address;
      location = `${city || town || village || state || 'Unknown'}, ${country}`;
    }
  } catch (err) {
    console.log("Location fetch error:", err);
  }

  const speed = velocity.toFixed(2); // km/h
  document.getElementById('info').textContent =
    `📍 Location: ${location} | 🛰️ Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)} | 🚀 Speed: ${speed} km/h`;
}

// 🔄 Call updateISS every 5 seconds
setInterval(updateISS, 5000);
updateISS();

// 🕒 Countdown to next ISS pass over Japan
function startCountdown(timestamp) {
  const countdownEl = document.getElementById("countdown");

  function update() {
    const now = new Date().getTime();
    const diff = timestamp * 1000 - now;

    if (diff <= 0) {
      countdownEl.textContent = "🎯 ISS is now passing over Japan!";
      return;
    }

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    countdownEl.textContent = `⏱️ Next ISS pass over Japan in: ${minutes}m ${seconds}s`;
  }

  update();
  setInterval(update, 1000);
}

async function getNextJapanPass() {
  const url = "http://api.open-notify.org/iss-pass.json?lat=35.6895&lon=139.6917";
  const response = await fetch(url);
  const data = await response.json();

  const nextPassTime = data.response[0].risetime; // UNIX timestamp
  startCountdown(nextPassTime);
}

getNextJapanPass();
