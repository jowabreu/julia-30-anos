// ── NAVEGAÇÃO ENTRE SEÇÕES ──
const navButtons = document.querySelectorAll('.nav-btn');
const viewSections = document.querySelectorAll('.view-section');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    viewSections.forEach(v => v.classList.remove('view-active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('view-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ── ENVIO DO FORMULÁRIO (RSVP) ──
const form = document.getElementById('view-confirmacao');
const submitBtn = form.querySelector('button[type="submit"]');
const feedback = document.getElementById('form-msg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    formData.append("subject", "Confirmação de Presença – Aniversário da Júlia 30 Anos");
    formData.append("redirect", "");

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Enviando...";
    submitBtn.disabled = true;
    feedback.style.color = '#6a8c4a';
    feedback.textContent = "Enviando sua confirmação... 🌸";

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            feedback.style.color = '#6a8c4a';
            feedback.textContent = "Presença confirmada com sucesso! Obrigado! 🌸";
            alert("Presença confirmada com sucesso! Obrigado! 🌸");
            form.reset();
        } else {
            feedback.style.color = '#a03050';
            feedback.textContent = "Erro ao enviar: " + data.message;
            alert("Erro ao enviar: " + data.message);
        }

    } catch (error) {
        feedback.style.color = '#a03050';
        feedback.textContent = "Ops! Algo deu errado. Por favor, tente novamente.";
        alert("Ops! Algo deu errado. Por favor, tente novamente.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});
