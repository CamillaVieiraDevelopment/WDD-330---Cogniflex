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

            flexibilityPoints: 0,

            statistics: {
                idealChoices: 0,
                intermediaryChoices: 0,
                impulsiveChoices: 0
            },

            executiveFunctions: {},

            socialSkills: {},

            areas: {},

            achievements: []
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

        this.checkAchievements();

        this.saveProfile();
    }

    recordChoice(choiceType, scenario) {

        if (choiceType === "ideal") {
            this.profileData.statistics.idealChoices++;
        }

        if (choiceType === "intermediary") {
            this.profileData.statistics.intermediaryChoices++;
        }

        if (choiceType === "impulsive") {
            this.profileData.statistics.impulsiveChoices++;
        }

        const executiveFunction = scenario.executiveFunction;

        if (!this.profileData.executiveFunctions[executiveFunction]) {
            this.profileData.executiveFunctions[executiveFunction] = {
                total: 0,
                ideal: 0
            };
        }

        this.profileData.executiveFunctions[executiveFunction].total++;

        if (choiceType === "ideal") {
            this.profileData.executiveFunctions[executiveFunction].ideal++;
        }

        const area = scenario.area;

        if (!this.profileData.areas[area]) {
            this.profileData.areas[area] = 0;
        }

        this.profileData.areas[area]++;

        this.checkAchievements();

        this.saveProfile();
    }

    checkAchievements() {

        const achievements = [];

        const totalScenarios =
            this.profileData.completedScenarios.length;

        const idealChoices =
            this.profileData.statistics.idealChoices;

        if (totalScenarios >= 1) {
            achievements.push("🏅 Explorer");
        }

        if (totalScenarios >= 10) {
            achievements.push("🏅 Persistent");
        }

        if (totalScenarios >= 25) {
            achievements.push("🏅 Veteran");
        }

        if (idealChoices >= 5) {
            achievements.push("🏅 Flexible Thinker");
        }

        if (idealChoices >= 20) {
            achievements.push("🏅 Cognitive Master");
        }

        this.profileData.achievements = achievements;

        this.profileData.medalCount =
            achievements.length;
    }

    toggleAccessibility(status) {
        this.profileData.accessibilityMode = status;
        this.saveProfile();
    }
}