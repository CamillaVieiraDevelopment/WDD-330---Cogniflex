// src/js/main.js
import { renderHeaderFooter } from "./utils.mjs";

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Starting Model Header and FooterInicializa 
  await renderHeaderFooter();
  console.log("Componentes core do Cogniflex carregados com sucesso.");

  // 2. Select Profigle Logic
  setupProfileSelection();
});

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