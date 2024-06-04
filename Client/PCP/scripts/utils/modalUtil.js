// utils/modalUtil.js
export function createModalContent(modalContent, closeModal, contentGenerator) {
  return () => {
    modalContent.innerHTML = "";
    modalContent.appendChild(closeModal);

    const contentWrapper = document.createElement("div");
    contentWrapper.style.maxHeight = "60vh";
    contentWrapper.style.overflowY = "auto";

    const content = contentGenerator();
    contentWrapper.appendChild(content);

    modalContent.appendChild(contentWrapper);
  };
}
