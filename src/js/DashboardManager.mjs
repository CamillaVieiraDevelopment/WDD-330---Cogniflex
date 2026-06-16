import ProfileManager from './ProfileManager.mjs';

export default class DashboardManager {
    constructor() {
        this.profile = new ProfileManager();
        this.userProfileGroup = localStorage.getItem('cogniflex_targetAgeGroup') || 'child';
        this.allScenarios = [];
        this.playedScenariosData = [];
    }

    async init() {
        await this.loadDatabase();
        this.matchPlayedScenarios();
        this.renderBasicStats();
        this.renderExecutiveFunctions();
        this.renderLifeAreasTable();
        this.renderMedals();
        this.renderInsights();
        this.renderDecisionProfileBars();
        this.renderRadarChart();
    }

    // Fetches the JSON database to cross-reference with the saved IDs
    async loadDatabase() {
        try {
            const response = await fetch(`/data/${this.userProfileGroup}.json`);
            if (response.ok) {
                this.allScenarios = await response.json();
            }
        } catch (error) {
            console.error("Failed to load scenarios database for dashboard.", error);
        }
    }

    // Filters the full database to find only the scenarios the user has completed
    matchPlayedScenarios() {
        const completedIds = this.profile.profileData.completedScenarios;
        this.playedScenariosData = this.allScenarios.filter(scenario =>
            completedIds.includes(scenario.id)
        );
    }

    renderBasicStats() {
        const data = this.profile.profileData;

        document.getElementById('user-greeting').textContent = `Hello, ${data.username}!`;
        document.getElementById('stat-stories').textContent = data.completedScenarios.length;
        document.getElementById('stat-xp').textContent = data.flexibilityPoints;
        document.getElementById('stat-medals').textContent = data.medalCount;

        const profileStats = this.calculateDecisionProfile();

        document.getElementById('stat-flexibility-rate').textContent = `${profileStats.ideal}%`;
    }

    renderExecutiveFunctions() {
        const container = document.getElementById('executive-functions-container');
        if (this.playedScenariosData.length === 0) return;

        // Count occurrences of each executive function using array reduce
        const functionCounts = this.playedScenariosData.reduce((acc, scenario) => {
            const func = scenario.executiveFunction || 'Other';
            acc[func] = (acc[func] || 0) + 1;
            return acc;
        }, {});

        container.innerHTML = ''; // Clear placeholder
        let topSkill = { name: '-', count: 0 };

        // Generate progress bars
        Object.entries(functionCounts).forEach(([funcName, count]) => {
            // Find the top skill to update the main metric card
            if (count > topSkill.count) {
                topSkill = { name: funcName, count: count };
            }

            // Formatting the string (e.g., "cognitive_flexibility" -> "Cognitive Flexibility")
            const formattedName = funcName.replaceAll('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            const percentage = Math.round((count / this.playedScenariosData.length) * 100);

            const barHtml = `
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                        <strong>${formattedName}</strong>
                        <span>${count} scenario(s)</span>
                    </div>
                    <div style="background: var(--gray-light); height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="background: var(--main-purple); height: 100%; width: ${percentage}%;"></div>
                    </div>
                </div>
            `;
            container.innerHTML += barHtml;
        });

        // Update Top Skill Card
        if (topSkill.name !== '-') {
            const formattedTopSkill = topSkill.name.replaceAll('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            document.getElementById('stat-top-skill').textContent = formattedTopSkill;
        }
    }

    renderLifeAreasTable() {
        const tbody = document.getElementById('dashboard-table-body');
        if (this.playedScenariosData.length === 0) return;

        // Aggregate data by life area
        const areaStats = this.playedScenariosData.reduce((acc, scenario) => {
            const area = scenario.area || 'General';
            if (!acc[area]) {
                acc[area] = { count: 0, xp: 0 };
            }
            acc[area].count += 1;
            acc[area].xp += scenario.xpPointsValue || 0;
            return acc;
        }, {});

        tbody.innerHTML = ''; // Clear placeholder

        Object.entries(areaStats).forEach(([areaName, stats]) => {
            const formattedName = areaName.charAt(0).toUpperCase() + areaName.slice(1);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${formattedName}</strong></td>
                <td>${stats.count}</td>
                <td>${stats.xp} XP</td>
            `;
            tbody.appendChild(tr);
        });
    }
}