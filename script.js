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

// ── MÚLTIPLOS NOMES (ADICIONAR / REMOVER) ──
const nomesList = document.getElementById('nomes-list');
const addNomeBtn = document.getElementById('add-nome');

addNomeBtn.addEventListener('click', () => {
  const row = document.createElement('div');
  row.className = 'nome-row';
  row.innerHTML = `
    <input type="text" class="nome-input" placeholder="Nome do convidado" autocomplete="name">
    <button type="button" class="btn-remove-nome" aria-label="Remover">&times;</button>
  `;
  nomesList.appendChild(row);
});

nomesList.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-remove-nome')) {
    e.target.closest('.nome-row').remove();
  }
});

// ── ENVIO DO FORMULÁRIO (RSVP) ──
const form = document.getElementById('view-confirmacao');
const submitBtn = form.querySelector('button[type="submit"]');
const feedback = document.getElementById('form-msg');
const nomesFinalInput = document.getElementById('nomes-final');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Junta todos os nomes preenchidos em um único campo "Nome"
    const nomeInputs = nomesList.querySelectorAll('.nome-input');
    const nomes = Array.from(nomeInputs)
        .map(input => input.value.trim())
        .filter(Boolean);

    if (nomes.length === 0) {
        feedback.style.color = '#a03050';
        feedback.textContent = "Por favor, informe ao menos um nome.";
        return;
    }

    nomesFinalInput.value = nomes.join(', ');

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
