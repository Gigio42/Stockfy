import BASE_URL from "../../../utils/config.js";
const PCP_URL = `${BASE_URL}/PCP`;

function handleError(error) {
  if (error.response) {
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);
    console.error("Response headers:", error.response.headers);
    if (error.response.data.message && error.response.data.error) {
      throw new Error(`${error.response.data.message}: ${error.response.data.error}`);
    } else {
      throw new Error(JSON.stringify(error.response.data));
    }
  } else if (error.request) {
    console.error("Request:", error.request);
    throw new Error("Error: No response from server");
  } else {
    console.error("Error message:", error.message);
    throw new Error(error.message);
  }
}

export async function fetchChapas(sortKey, sortOrder, filterCriteria) {
  try {
    const response = await axios.get(`${PCP_URL}/chapas`, {
      params: {
        sortBy: sortKey,
        sortOrder: sortOrder,
        filterCriteria: JSON.stringify(filterCriteria),
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function reserveChapas(data) {
  console.log(data);
  try {
    const response = await axios.post(`${PCP_URL}`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function fetchItems(searchQuery = "") {
  try {
    const response = await axios.get(`${PCP_URL}/items`, {
      params: {
        search: searchQuery,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteItem(id) {
  try {
    await axios.delete(`${PCP_URL}/items/${id}`);
  } catch (error) {
    handleError(error);
  }
}

export async function deleteChapaFromItem(itemId, chapaId, reservedBy, dataFormatada) {
  try {
    await axios.delete(`${PCP_URL}/items/${itemId}/chapas/${chapaId}`, {
      data: { reservedBy, dataFormatada }
    });
  } catch (error) {
    handleError(error);
  }
}
