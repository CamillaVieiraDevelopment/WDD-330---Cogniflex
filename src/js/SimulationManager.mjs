import ProfileManager from './ProfileManager.mjs';
import ExternalServices from './ExternalServices.mjs'; // Added API integration

export default class SimulationManager {
  constructor() {
    this.scenarios = [];
    this.currentScenario = null;
    this.userProfile = localStorage.getItem('cogniflex_targetAgeGroup') || 'child';
    this.services = new ExternalServices(); // Instantiate external API services
  }

  async init() {
    console.log(`Initializing simulation for profile: ${this.userProfile}`);
    await this.loadScenarios();
  }

  async loadScenarios() {
    try {
      // Dynamically fetches the correct file based on the user profile (child, teen, or adult)
      const response = await fetch(`/data/${this.userProfile}.json`);

      if (!response.ok) {
        throw new Error(`Error loading the ${this.userProfile} scenarios file.`);
      }

      this.scenarios = await response.json();
      console.log(`${this.scenarios.length} scenarios loaded successfully for ${this.userProfile}.`);

      if (this.scenarios.length > 0) {
        // Select a random scenario to start
        const randomIndex = Math.floor(Math.random() * this.scenarios.length);
        this.renderScenario(this.scenarios[randomIndex]);
      } else {
        this.showError("No scenarios found for this profile.");
      }

    } catch (error) {
      console.error("Fetch error: ", error);
      this.showError("Failed to connect to the Cogniflex database.");
    }
  }

  renderScenario(scenario) {
    this.currentScenario = scenario;

    // Reset displays for a new scenario
    document.getElementById('options-container').style.display = 'grid';
    document.getElementById('question-prompt').style.display = 'block';
    document.getElementById('media-container').style.display = 'none'; // Hide GIF container initially
    document.getElementById('scenario-gif').src = ''; // Clear previous GIF

    // Inject texts into the HTML
    document.getElementById('scenario-title').textContent = scenario.title;
    document.getElementById('scenario-text').textContent = scenario.situationText;

    this.generateButtons(scenario.choices);
  }

  generateButtons(choices) {
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = ''; // Clear previous buttons

    // Create an array to easily shuffle the options
    const optionsArray = [
      { type: 'ideal', data: choices.ideal },
      { type: 'intermediary', data: choices.intermediary },
      { type: 'impulsive', data: choices.impulsive }
    ];

    // Aggressive Shuffle: Uses time alongside random to force variety and prevent stuck positions
    optionsArray.sort(() => (Math.random() + Date.now()) % 0.5 - 0.25);

    // Render the neutral buttons on the screen
    optionsArray.forEach(option => {
      const button = document.createElement('button');
      button.classList.add('btn-choice-neutral');
      button.textContent = option.data.text;

      // Add click event to reveal consequence and trigger asynchronous actions
      button.addEventListener('click', () => this.handleChoice(option.type, option.data));

      optionsContainer.appendChild(button);
    });
  }

  async handleChoice(choiceType, choiceData) {
    console.log(`User selected a/an ${choiceType} response.`);

    // 1. Save Progress
    const profile = new ProfileManager();
    const xpGained = this.currentScenario.xpPointsValue || 50;
    profile.updateProgress(this.currentScenario.id, true, xpGained);

    // 2. Hide Options
    document.getElementById('options-container').style.display = 'none';
    document.getElementById('question-prompt').style.display = 'none';

    // 3. Configure Visual Feedback Colors (Green, Yellow, Red)
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackTitle = document.getElementById('feedback-title');

    const styleMap = {
      ideal: { bg: 'var(--bg-ideal)', border: 'var(--color-ideal)', text: 'var(--color-ideal)' },
      intermediary: { bg: 'var(--bg-intermed)', border: 'var(--color-intermed)', text: 'var(--color-intermed)' },
      impulsive: { bg: 'var(--bg-impulsive)', border: 'var(--color-impulsive)', text: 'var(--color-impulsive)' }
    };

    feedbackContainer.style.backgroundColor = styleMap[choiceType].bg;
    feedbackContainer.style.border = `2px solid ${styleMap[choiceType].border}`;
    feedbackTitle.style.color = styleMap[choiceType].text;
    feedbackContainer.style.color = 'var(--dark-purple)';

    // 4. Populate Feedback Text
    document.getElementById('feedback-immediate').innerHTML = `<strong>Immediate:</strong> ${choiceData.immediateConsequence}`;
    document.getElementById('feedback-later').innerHTML = `<strong>Long-term:</strong> ${choiceData.laterConsequence}`;
    feedbackContainer.style.display = 'block';

    // 5. Fetch and display dynamic GIF from Giphy API based on scenario and emotion
    const mediaContainer = document.getElementById('media-container');
    const gifElement = document.getElementById('scenario-gif');

    try {
      const baseKeyword = this.currentScenario.giphySearchTerm || 'reaction';
      const emotionalModifier = choiceType === 'ideal' ? 'happy' : choiceType === 'intermediary' ? 'thinking' : 'frustrated';
      const finalSearchTerm = `${baseKeyword} ${emotionalModifier}`;

      console.log(`Fetching GIF for: ${finalSearchTerm}`);
      const gifData = await this.services.getEmotionFeedbackGIF(finalSearchTerm);

      if (gifData && gifData.images && gifData.images.original.url) {
        gifElement.src = gifData.images.original.url;
        gifElement.style.display = 'block';
        mediaContainer.style.display = 'flex';
      }
    } catch (error) {
      console.error("Could not load Giphy feedback:", error);
      // We don't break the application if the API fails, we just don't show the image
    }

    // 6. Setup "Next Scenario" button to reload cleanly
    document.getElementById('next-scenario-btn').onclick = () => {
      feedbackContainer.style.display = 'none';
      mediaContainer.style.display = 'none';
      this.init(); // Reload a new scenario
    };
  }

  showError(message) {
    document.getElementById('scenario-title').textContent = "Oops! Something went wrong.";
    document.getElementById('scenario-text').textContent = message;
  }
}