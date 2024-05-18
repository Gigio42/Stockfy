export function handleShowSelectedButtonClick(getSelectedSubcards) {
    const showSelectedButton = document.getElementById('showSelectedButton');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.getElementById('closeModal');
    const popupContainer = document.getElementById('popupContainer');

    if (showSelectedButton.onclick) {
        showSelectedButton.removeEventListener('click', showSelectedButton.onclick);
    }

    showSelectedButton.onclick = () => {
        modalContent.innerHTML = '';
        modalContent.appendChild(closeModal);

        const selectedSubcards = getSelectedSubcards();

        selectedSubcards.forEach(chapa => {
            const chapaElement = document.createElement('p');
            chapaElement.textContent = `id_chapa: ${chapa.id_chapa}, fornecedor: ${chapa.fornecedor}, medida: ${chapa.medida}, qualidade: ${chapa.qualidade}`;
            modalContent.appendChild(chapaElement);
        });

        popupContainer.style.display = 'block';
    };

    closeModal.onclick = () => {
        popupContainer.style.display = 'none';
    };
}