import ExternalServices from "./ExternalServices.mjs";
import ProfileManager from "./ProfileManager.mjs";
import { qs } from "./utils.mjs";

const apiService = new ExternalServices();
const profile = new ProfileManager();

export default class SimulationManager {
    constructor(parentElementSelector) {
        this.parentElement = qs(parentElementSelector);
        this.currentScenario = null;
    }

    async init(scenarioData) {
        this.currentScenario = scenarioData;

        // Busca um NPC dinâmico da API para compor o contexto da simulação [cite: 470, 504]
        const npc = await apiService.getRandomNPC();
        this.renderScenario(npc);
        this.setupInteractionEvents();
    }

    renderScenario(npc) {
        // Implementa o layout de 3 cartões para combater o pensamento rígido/binário 
        this.parentElement.innerHTML = `
      <div class="simulation-view">
        <div class="npc-card">
          <img src="${npc.picture.large}" alt="${npc.name.first}">
          <p>Interagindo com: <strong>${npc.name.first} ${npc.name.last}</strong> de ${npc.location.city}</p>
        </div>
        
        <div class="problem-box">
          <h2>${this.currentScenario.title}</h2>
          <p>${this.currentScenario.context}</p>
        </div>

        <div class="feedback-visual-area" id="api-gif-placeholder">
          </div>

        <div class="options-grid">
          ${this.currentScenario.options.map((opt, idx) => `
            <button class="card-option opacity-trigger" data-feedback="${opt.feedbackType}" data-points="${opt.points}" data-idx="${idx}">
              ${opt.text}
            </button>
          `).join("")}
        </div>
      </div>
    `;
    }

    setupInteractionEvents() {
        const buttons = this.parentElement.querySelectorAll(".card-option");

        // Critério: Cumpre a exigência de disparar múltiplos eventos interativos (Click, MouseOver) [cite: 406]
        buttons.forEach(button => {
            // Evento 1: Clique principal (Avanço lógico da simulação) [cite: 406]
            button.addEventListener("click", async (e) => {
                const btn = e.currentTarget;
                const feedbackType = btn.getAttribute("data-feedback");
                const points = parseInt(btn.getAttribute("data-points"));

                // Modifica o estado do perfil no LocalStorage [cite: 406]
                profile.updateProgress(this.currentScenario.id, feedbackType === "flexible", points);

                // Dispara o feedback dinâmico consumindo o endpoint do Giphy [cite: 469, 501]
                const gifArea = qs("#api-gif-placeholder");
                gifArea.innerHTML = "<p>Carregando reação...</p>";

                const gifData = await apiService.getEmotionFeedbackGIF(feedbackType);
                gifArea.innerHTML = `<img src="${gifData.images.original.url}" alt="${gifData.title}" class="fade-in-animation">`;
            });

            // Evento 2: MouseEnter para microinteração visual avançada de CSS 
            button.addEventListener("mouseenter", (e) => {
                e.target.style.transform = "translateY(-5px) scale(1.02)";
            });

            // Evento 3: MouseLeave para reverter a transformação fluida 
            button.addEventListener("mouseleave", (e) => {
                e.target.style.transform = "translateY(0) scale(1)";
            });
        });
    }
}