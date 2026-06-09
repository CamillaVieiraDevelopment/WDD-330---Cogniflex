// src/js/main.js
import { renderHeaderFooter } from "./utils.mjs";

document.addEventListener('DOMContentLoaded', async () => {
  // Inicializa o cabeçalho e rodapé modulares com segurança
  await renderHeaderFooter();
  console.log("Componentes core do Cogniflex carregados com sucesso.");

  // O bloco abaixo cuida das estatísticas do perfil. 
  // Ele está protegido para NÃO travar o cabeçalho caso o ProfileManager ainda não esteja pronto.
  try {
    const nameElement = document.querySelector("#user-name");
    const pointsElement = document.querySelector("#user-points");
    const medalsElement = document.querySelector("#user-medals");

    // Descomente as linhas abaixo apenas quando criar a classe ProfileManager.mjs
    /*
    const { default: ProfileManager } = await import("./ProfileManager.mjs");
    const profile = new ProfileManager();
    console.log(`Welcome back, ${profile.profileData.username}!`);

    if (nameElement) nameElement.textContent = profile.profileData.username;
    if (pointsElement) pointsElement.textContent = profile.profileData.flexibilityPoints;
    if (medalsElement) medalsElement.textContent = `🏅 ${profile.profileData.medalCount}`;
    */
  } catch (profileError) {
    console.log("ProfileManager ainda não foi totalmente integrado ou configurado.");
  }
});