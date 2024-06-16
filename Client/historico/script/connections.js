import BASE_URL from "../../utils/config.js";

const HISTORICO_URL = `${BASE_URL}/historico`;

function handleError(error) {
  // TODO
}

export async function fetchChapas() {
  try {
    const response = await axios.get(`${HISTORICO_URL}/chapas`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function fetchItems() {
  try {
    const response = await axios.get(`${HISTORICO_URL}/items`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}