const PCP_URL = "http://localhost:3000/PCP";

export async function fetchChapas(sortKey, sortOrder, filterCriteria) {
  const response = await axios.get(`${PCP_URL}/chapas`, {
    params: {
      sortBy: sortKey,
      sortOrder: sortOrder,
      filterCriteria: JSON.stringify(filterCriteria),
    },
  });
  return response.data;
}

export async function fetchItems(searchQuery = '') {
  try {
    const response = await axios.get(`${PCP_URL}/items`, {
      params: {
        search: searchQuery
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}

export async function deleteEntity(id, type) {
  try {
    await axios.delete(`${PCP_URL}/${type}s/${id}`);
    const openModalLink = document.getElementById("openModalLink");
    openModalLink.click();
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
  }
}

export async function reserveChapas(data) {
  try {
    const response = await axios.post(`${PCP_URL}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
      throw new Error(`Error: ${error.response.data.error}`);
    } else if (error.request) {
      console.error(error.request);
      throw new Error("Error: No response from server");
    } else {
      console.error("Error", error.message);
      throw new Error(`Error: ${error.message}`);
    }
  }
}