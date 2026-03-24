// Global map variable
let ghostMap;

// Wait for the "Gatekeeper" to unlock before loading the map
window.addEventListener('systemUnlocked', () => {
    initMap();
});

function initMap() {
    // 1. Initialize the map centered on a default location (e.g., London, or [0,0])
    // Zoom level 13 is close enough to see city streets
    ghostMap = L.map('map-container', {
        zoomControl: false // We hide the default zoom to keep it cinematic
    }).setView([51.505, -0.09], 13);

    // 2. Load the base map tiles (OpenStreetMap)
    // Remember, our index.css is magically inverting these colors to look dark!
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(ghostMap);

    // Add custom zoom controls to the bottom right instead of top left
    L.control.zoom({ position: 'bottomright' }).addTo(ghostMap);

    console.log("[SYSTEM] Geospatial routing online.");

    // 3. Listen for clicks on the map to initiate a "Drop"
    ghostMap.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        initiateDrop(lat, lng);
    });
}

// 4. Create the glowing nodes
function initiateDrop(lat, lng) {
    // Create a custom HTML icon using the CSS classes we made
    const pulsingIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="ghost-node"></div>`, // Change to "ghost-node encrypted" for red
        iconSize: [15, 15],
        iconAnchor: [7.5, 7.5] // Centers the dot exactly where you clicked
    });

    // Place the marker on the map
    const marker = L.marker([lat, lng], { icon: pulsingIcon }).addTo(ghostMap);

    // Create the terminal-style popup content
    const popupContent = `
        <div style="text-align: center;">
            <p style="margin-bottom: 5px; font-weight: bold; letter-spacing: 1px;">
                [ NEW DEAD DROP ]
            </p>
            <span style="font-size: 0.8rem; color: var(--text-muted);">
                LAT: ${lat.toFixed(4)} <br> LNG: ${lng.toFixed(4)}
            </span>
            <input type="text" class="terminal-input" id="drop-message" placeholder="Enter classified data..." autocomplete="off">
            <button class="btn-drop" style="margin-top: 10px; padding: 5px 10px; font-size: 0.8rem;" onclick="saveDrop()">ENCRYPT & DEPLOY</button>
        </div>
    `;

    // Bind the popup to the marker and open it immediately
    marker.bindPopup(popupContent).openPopup();
}

// A placeholder function for when the user clicks "ENCRYPT & DEPLOY"
// We will connect this to our crypto logic later.
window.saveDrop = function() {
    const msg = document.getElementById('drop-message').value;
    if (!msg) return;
    
    console.log("[ENCRYPTING DATA...]", msg);
    ghostMap.closePopup();
    // TODO: Send to Web Crypto API, then send to backend server.
};