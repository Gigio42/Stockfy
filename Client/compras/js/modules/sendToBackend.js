import BASE_URL from "../utils/config.js";

export function sendJSONDataToBackend() {
  let url = `${BASE_URL}/compras`;

  var jsonDataToSend = JSON.parse(JSON.stringify(jsonData), function (key, value) {
    if (typeof value === "string" && !isNaN(value) && value !== "") {
      var intValue = parseInt(value.replace(/\./g, ""), 10);
      return intValue;
    }
    return value;
  });

  axios
    .post(url, jsonDataToSend, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(() => {
      console.log("Dados enviados com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Erro ao enviar dados:", error);
    });
}
