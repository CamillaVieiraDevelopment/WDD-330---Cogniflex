export default class SimulationManager {
  constructor() {
    this.scenarios = [];
    this.currentScenario = null;
    this.userProfile = localStorage.getItem('cogniflex_targetAgeGroup') || 'child';
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

      // The file already contains only the specific scenarios, so no need to filter!
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

    // RESET VISUAL: Garante que os elementos escondidos no cenário anterior voltem a aparecer
    document.getElementById('options-container').style.display = 'grid'; // É grid porque usamos grid no CSS!
    document.getElementById('question-prompt').style.display = 'block';

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

    // Shuffle the array (Fisher-Yates algorithm)
    for (let i = optionsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
    }

    // Render the neutral buttons on the screen
    optionsArray.forEach(option => {
      const button = document.createElement('button');
      button.classList.add('btn-choice-neutral');
      button.textContent = option.data.text;

      // Add click event to reveal consequence
      button.addEventListener('click', () => this.handleChoice(option.type, option.data));

      optionsContainer.appendChild(button);
    });
  }

  handleChoice(choiceType, choiceData) {
    console.log(`User selected a/an ${choiceType} response.`);

    // Hide the options container
    document.getElementById('options-container').style.display = 'none';
    document.getElementById('question-prompt').style.display = 'none';

    // Populate and show the feedback container
    const feedbackContainer = document.getElementById('feedback-container');
    document.getElementById('feedback-immediate').querySelector('span').textContent = choiceData.immediateConsequence;
    document.getElementById('feedback-later').querySelector('span').textContent = choiceData.laterConsequence;

    // Optional: Change feedback title color based on choice type
    const feedbackTitle = document.getElementById('feedback-title');
    if (choiceType === 'ideal') feedbackTitle.style.color = 'var(--color-ideal)';
    if (choiceType === 'intermediary') feedbackTitle.style.color = 'var(--color-intermed)';
    if (choiceType === 'impulsive') feedbackTitle.style.color = 'var(--color-impulsive)';

    feedbackContainer.style.display = 'block';

    // Add event listener to "Next Scenario" button
    document.getElementById('next-scenario-btn').onclick = () => {
      feedbackContainer.style.display = 'none';
      this.init(); // Reload a new scenario
    };
  }

  showError(message) {
    document.getElementById('scenario-title').textContent = "Oops! Something went wrong.";
    document.getElementById('scenario-text').textContent = message;
  }
}