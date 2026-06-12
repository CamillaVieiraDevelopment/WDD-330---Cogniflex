import { renderHeaderFooter } from "./utils.mjs";

// Removido o DOMContentLoaded: Em type="module", o DOM já está pronto quando este script roda.
async function init() {
    await renderHeaderFooter();
    console.log("Componentes core do Cogniflex carregados com sucesso.");
    setupProfileSelection();
}

// Inicia a execução imediatamente
init();

function setupProfileSelection() {
    const profileButtons = document.querySelectorAll('.profile-card');
    if (profileButtons.length === 0) return;

    profileButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedProfile = event.currentTarget.getAttribute('data-profile');
            localStorage.setItem('cogniflex_targetAgeGroup', selectedProfile);
            window.location.href = 'simulation.html';
        });
    });
}