export function toggleDropzoneVisibility() {
    const modals = document.querySelectorAll('.modal');
    let isAnyModalVisible = false;

    modals.forEach(modal => {
        if (window.getComputedStyle(modal).display === 'block') {
            isAnyModalVisible = true;
        }
    });

    const dropzone = document.getElementById('dropzone');
    if (isAnyModalVisible) {
        dropzone.style.display = 'none';
    } else {
        dropzone.style.display = 'block';
    }

    const myModal = document.getElementById('myModal');
    const mModal = document.getElementById('mModal');

    if (mModal.style.display === 'block') {
        myModal.style.display = 'none';
    }
}
