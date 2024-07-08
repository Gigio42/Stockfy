let BASE_URL;

if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  BASE_URL = "http://localhost:3000";
} else if (window.location.hostname.includes("ngrok")) {
  BASE_URL = "https://reptile-cosmic-firstly.ngrok-free.app";
} else {
  BASE_URL = "https://stockfy.onrender.com";
}

export default BASE_URL;