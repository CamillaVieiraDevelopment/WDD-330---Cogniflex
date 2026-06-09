// main.js - Main orchestrator script for Cogniflex
import { loadHeaderFooter, qs } from "./utils.mjs";
import ProfileManager from "./ProfileManager.mjs";

// Initialize header and footer templates when the DOM is ready
loadHeaderFooter().then(() => {
  console.log("Cogniflex core components loaded successfully.");

  // Initialize profile data for gamification tracking
  const profile = new ProfileManager();
  console.log(`Welcome back, ${profile.profileData.username}!`);

  // Dynamically populate home page profile stats widgets if they exist on the current page
  const nameElement = qs("#user-name");
  const pointsElement = qs("#user-points");
  const medalsElement = qs("#user-medals");

  if (nameElement) nameElement.textContent = profile.profileData.username;
  if (pointsElement) pointsElement.textContent = profile.profileData.flexibilityPoints;
  if (medalsElement) medalsElement.textContent = `🏅 ${profile.profileData.medalCount}`;
});