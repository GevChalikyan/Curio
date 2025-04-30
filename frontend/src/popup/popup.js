const API_BASE_URL = "http://localhost:3000"

console.log("Popup Page Opened")

fetch(`${API_BASE_URL}/ping`)
  .then(r => r.json())
  .then(console.log);