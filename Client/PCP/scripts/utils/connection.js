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

export async function fetchItems() {
  try {
    const response = await axios.get(`${PCP_URL}/items`);
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