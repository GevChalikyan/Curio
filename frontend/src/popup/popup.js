const API_BASE_URL = "https://curio-backend-d13s.onrender.com"

console.log("Popup Page Opened")

fetch(`${API_BASE_URL}/ping`)
  .then(r => r.json())
  .then(console.log);