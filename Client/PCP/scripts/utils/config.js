let BASE_URL;

if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  BASE_URL = "http://localhost:3000";
} else {
  BASE_URL = "https://stockfy.onrender.com";
}

export default BASE_URL;