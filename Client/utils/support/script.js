document.addEventListener('DOMContentLoaded', (event) => {
    const modal = document.getElementById("supportModal");
    const btn = document.getElementById("supportButton");
    const span = document.getElementsByClassName("close")[0];
    const form = document.getElementById("supportForm");

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    form.onsubmit = function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', data)
            .then((response) => {
                alert('Mensagem enviada com sucesso!');
                form.reset();
                modal.style.display = "none";
            }, (error) => {
                alert('Falha ao enviar a mensagem, tente novamente.');
            });
    }
});
