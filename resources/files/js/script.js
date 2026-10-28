import { FootballClickerGame } from './player.js';
import { UpgradeManager } from './upgrades.js';

document.addEventListener('DOMContentLoaded', () => {
    const initialPlayersEl = document.getElementById('player-count');
    const initialPlayers = initialPlayersEl ? parseInt(initialPlayersEl.textContent, 10) || 0 : 0;

    window.game = new FootballClickerGame({ initialPlayers });
    window.upgradeManager = new UpgradeManager(window.game);
});