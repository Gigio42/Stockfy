document.addEventListener('DOMContentLoaded', () => {
    // Carrega o conteúdo do modal HTML
    fetch('../utils/support/support.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
            initializeSupportModal();
        });

    function initializeSupportModal() {
        // Seletores dos elementos do modal
        const supportModal = document.getElementById('supportModalWindow');
        const supportBtn = document.getElementById('supportButton');
        const supportCloseBtn = document.getElementsByClassName('supportClose')[0];
        const supportForm = document.getElementById('supportForm');

        // Abre o modal
        supportBtn.addEventListener('click', () => {
            supportModal.style.display = 'block';
        });

        // Fecha o modal quando clica no botão de fechar
        supportCloseBtn.addEventListener('click', () => {
            supportModal.style.display = 'none';
        });

        // Fecha o modal quando clica fora do modal
        window.addEventListener('click', (event) => {
            if (event.target === supportModal) {
                supportModal.style.display = 'none';
            }
        });

        // Envia o formulário e fecha o modal
        supportForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(supportForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            emailjs.send('service_io4c8xa', 'template_ag8i135', data)
                .then(() => {
                    alert('Mensagem enviada com sucesso!');
                    supportForm.reset();
                    supportModal.style.display = 'none';
                })
                .catch(() => {
                    alert('Falha ao enviar a mensagem, tente novamente.');
                });
        });
    }
});
