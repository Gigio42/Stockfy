let BASE_URL;



if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  BASE_URL = "http://localhost:3000";
} else {
  BASE_URL = "https://stockfy-dqgudbg4adexbxfw.brazilsouth-01.azurewebsites.net";
}

export default BASE_URL;