document.addEventListener('DOMContentLoaded', function () {
    const supportButton = document.getElementById('supportButton');
    const supportModal = document.getElementById('supportModal');
    const closeBtn = document.getElementsByClassName('support-close')[0];
  
    supportButton.addEventListener('click', function() {
      supportModal.style.display = 'block';
    });
  
    closeBtn.addEventListener('click', function() {
      supportModal.style.display = 'none';
    });
  
    window.addEventListener('click', function(event) {
      if (event.target == supportModal) {
        supportModal.style.display = 'none';
      }
    });
  
    const form = document.getElementById('supportForm');
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      emailjs.sendForm('service_id', 'template_id', this)
        .then(function() {
          alert('Email sent successfully!');
          supportModal.style.display = 'none';
        }, function(error) {
          alert('Failed to send email. Error: ' + JSON.stringify(error));
        });
    });
  });
  