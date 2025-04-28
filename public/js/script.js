// const socket = io();

// if (navigator.geolocation) {
//   navigator.geolocation.watchPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;
//       socket.emit("send-location", { latitude, longitude });
//     },
//     (error) => {
//       console.error("Error getting location:", error);
//     },
//     {
//       enableHighAccuracy: true,
//       maximumAge: 0,
//       timeout: 5000,
//     }
//   );
// }


// const map = L.map("map").setView([0, 0], 16);
//  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
 
   
//  }).addTo(map);

//  const marker = {};
//  socket.on("recieve-location", (data) =>{
//     const { id, latitude, longitude } = data;
//     map.setView([latitude, longitude]);
//     if (marker[id]) {
//         marker[id].setLatLng([latitude, longitude]);
//     } else {
//         marker[id] = L.marker([latitude, longitude]).addTo(map).bindPopup(id).openPopup();
//         console.log(marker[id]);
//     }
//  });

//  socket.on("user-disconnected", (id) => {
//     if (marker[id]) {
//         map.removeLayer(marker[id]);
//         delete marker[id];
//     }
//  });

const socket = io(); // assuming server is same localhost:8000

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Error getting location:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(map);

const marker = {};

// Define a few different colored icons
const icons = {
    red: L.icon({
        iconUrl: "placeholder.png",
        iconSize: [21, 34],
        iconAnchor: [10, 34],
        popupAnchor: [0, -30]
    }),
    green: L.icon({
        iconUrl: "black.png",
        iconSize: [21, 34],
        iconAnchor: [10, 34],
        popupAnchor: [0, -30]
    })
    
};

// Function to pick a color based on id (simple hash)
function getColorIcon(id) {
    const colors = Object.keys(icons);
    const index = Math.abs(hashCode(id)) % colors.length;
    return icons[colors[index]];
}

// Simple hash function
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

socket.on("recieve-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);

    if (marker[id]) {
        marker[id].setLatLng([latitude, longitude]);
    } else {
        marker[id] = L.marker([latitude, longitude], {
            icon: getColorIcon(id)
        }).addTo(map)
        .bindPopup("User: " + id.substring(0, 6)) // show shortened id
        .openPopup();
    }
});

socket.on("user-disconnected", (id) => {
    if (marker[id]) {
        map.removeLayer(marker[id]);
        delete marker[id];
    }
});
