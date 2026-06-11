export default class ProfileManager {
    constructor(storageKey = "cogniflex-profile") {
        this.storageKey = storageKey;
        this.profileData = this.loadProfile();
    }

    loadProfile() {
        const data = localStorage.getItem(this.storageKey);
        if (data) return JSON.parse(data);
        
        return {
            username: "Explorer",
            medalCount: 0,
            completedScenarios: [],
            accessibilityMode: false,
            flexibilityPoints: 0
        };
    }

    saveProfile() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.profileData));
    }

    // Atualiza propriedades específicas e persiste de forma reativa
    updateProgress(scenarioId, isFlexibleChoice, pointsGained) {
        if (!this.profileData.completedScenarios.includes(scenarioId)) {
            this.profileData.completedScenarios.push(scenarioId);
        }
        this.profileData.flexibilityPoints += pointsGained;

        // Regra de gamificação para ganho de medalhas [cite: 474]
        if (this.profileData.flexibilityPoints >= 50) {
            this.profileData.medalCount = Math.floor(this.profileData.flexibilityPoints / 50);
        }

        this.saveProfile();
    }

    toggleAccessibility(status) {
        this.profileData.accessibilityMode = status;
        this.saveProfile();
    }
}