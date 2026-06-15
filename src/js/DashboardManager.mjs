// src/js/DashboardManager.mjs
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

        const profileStats =
            this.calculateDecisionProfile();

        document.getElementById(
            'stat-flexibility-rate'
        ).textContent =
            `${profileStats.ideal}%`;
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
            const formattedName = funcName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            const percentage = Math.min((count / this.playedScenariosData.length) * 100, 100);

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
            const formattedTopSkill = topSkill.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
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

    renderMedals() {
        const container = document.getElementById('medals-container');
        const medalCount = this.profile.profileData.medalCount;

        if (medalCount === 0) return;

        container.innerHTML = ''; // Clear placeholder

        const medalNames = ["🏆 Explorer", "🧠 Thinker", "⚖️ Balancer", "💙 Empathetic", "🌟 Master"];

        for (let i = 0; i < medalCount; i++) {
            // Cycle through medal names
            const medalTitle = medalNames[i % medalNames.length];

            const medalHtml = `
                <div class="medal-item-placeholder" style="background: var(--bg-ideal); border: 1px solid var(--color-ideal); color: var(--color-ideal); font-weight: bold;">
                    ${medalTitle}
                </div>
            `;
            container.innerHTML += medalHtml;
        }
    };
    calculateDecisionProfile() {

        const stats =
            this.profile.profileData.statistics || {
                idealChoices: 0,
                intermediaryChoices: 0,
                impulsiveChoices: 0
            };

        const total =
            stats.idealChoices +
            stats.intermediaryChoices +
            stats.impulsiveChoices;

        if (total === 0) {
            return {
                ideal: 0,
                intermediary: 0,
                impulsive: 0
            };
        }

        return {
            ideal: Math.round((stats.idealChoices / total) * 100),
            intermediary: Math.round((stats.intermediaryChoices / total) * 100),
            impulsive: Math.round((stats.impulsiveChoices / total) * 100)
        };
    }


    renderInsights() {


            const container =
                document.getElementById(
                    'insights-container'
                );

            const stats =
                this.calculateDecisionProfile();

            let insights = [];

            // Alta flexibilidade
            if (stats.ideal >= 70) {
                insights.push(
                    "🟢 Demonstrated strong consideration of consequences before acting."
                );
            }

            // Muitas respostas intermediárias
            if (stats.intermediary >= 50) {
                insights.push(
                    "🟡 Frequently evaluated multiple alternatives before deciding."
                );
            }

            // Muitas respostas impulsivas
            if (stats.impulsive >= 30) {
                insights.push(
                    "🔴 Several decisions prioritized immediate reactions. Explore more scenarios to compare different outcomes."
                );
            }

            // Perfil equilibrado
            if (
                stats.ideal < 70 &&
                stats.intermediary < 50 &&
                stats.impulsive < 30
            ) {
                insights.push(
                    "⚪ Your decision patterns are currently balanced across different response styles."
                );
            }

            // Sem histórico suficiente
            if (
                stats.ideal === 0 &&
                stats.intermediary === 0 &&
                stats.impulsive === 0
            ) {
                insights.push(
                    "📚 Complete additional scenarios to generate personalized insights."
                );
            }

            container.innerHTML =
                insights
                    .map(item => `<p>${item}</p>`)
                    .join('');
        }
}