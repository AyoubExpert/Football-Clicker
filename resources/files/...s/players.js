import { GameStorage } from './storage.js';

export class FootballClickerGame {
    constructor(config = {}) {
        this.players = config.initialPlayers || 0;
        this.totalClicks = 0;
        this.totalStaff = 0;
        this.pps = 0;
        this.clickPower = 1;
        this.currentGoal = 100;
        this.previousGoal = 0;
        this.upgradesState = {};

        this.storage = new GameStorage();

        this.dom = {
            playerCount: document.getElementById('player-count'),
            pps: document.getElementById('pps'),
            totalClicks: document.getElementById('total-clicks'),
            totalStaff: document.getElementById('total-staff'),
            progressBar: document.getElementById('progress-bar'),
            playerBtn: document.getElementById('player-btn'),
            clickSection: document.querySelector('.click-section')
        };

        this.loadGame();
        this.init();
    }

    init() {
        if (this.dom.playerBtn) {
            this.dom.playerBtn.addEventListener('click', (e) => this.handlePlayerClick(e));
        }

        document.addEventListener('buyUpgrade', (e) => this.handleBuyUpgrade(e.detail));

        setInterval(() => {
            if (this.pps > 0) {
                this.players += this.pps / 10;
                this.checkGoal();
                this.updateUI();
            }
        }, 100);

        setInterval(() => {
            this.saveGame();
        }, 5000);

        this.checkGoal();
        this.updateUI();
    }

    checkGoal() {
        while (this.players >= this.currentGoal) {
            this.previousGoal = this.currentGoal;
            this.currentGoal *= 2;
        }
    }

    saveGame() {
        const saveData = {
            players: this.players,
            totalClicks: this.totalClicks,
            totalStaff: this.totalStaff,
            pps: this.pps,
            clickPower: this.clickPower,
            currentGoal: this.currentGoal,
            previousGoal: this.previousGoal,
            upgradesState: this.upgradesState
        };
        this.storage.save(saveData);
    }

    loadGame() {
        const data = this.storage.load();
        if (data) {
            this.players = data.players ?? this.players;
            this.totalClicks = data.totalClicks ?? this.totalClicks;
            this.totalStaff = data.totalStaff ?? this.totalStaff;
            this.pps = data.pps ?? this.pps;
            this.clickPower = data.clickPower ?? this.clickPower;
            this.currentGoal = data.currentGoal ?? this.currentGoal;
            this.previousGoal = data.previousGoal ?? this.previousGoal;
            this.upgradesState = data.upgradesState || {};
        }
        this.checkGoal();
    }

    handlePlayerClick(event) {
        this.players += this.clickPower;
        this.totalClicks++;
        this.checkGoal();
        this.createFloatingText(event, `+${this.clickPower}`);
        this.updateUI();
        this.saveGame();
    }

    handleBuyUpgrade(detail) {
        if (this.players >= detail.cost) {
            this.players -= detail.cost;
            if (detail.ppsIncrease) this.pps += detail.ppsIncrease;
            if (detail.clickPowerIncrease) this.clickPower += detail.clickPowerIncrease;
            if (detail.isStaff) this.totalStaff++;
            this.checkGoal();
            this.updateUI();
            this.saveGame();
        }
    }

    get ProgressPercentage() {
        const current = this.players - this.previousGoal;
        const total = this.currentGoal - this.previousGoal;
        return Math.min(Math.max((current / total) * 100, 0), 100);
    }

    updateUI() {
        if (this.dom.playerCount) {
            this.dom.playerCount.textContent = Math.floor(this.players).toLocaleString('nl-NL');
        }

        if (this.dom.pps) {
            this.dom.pps.textContent = this.pps.toLocaleString('nl-NL');
        }

        if (this.dom.totalClicks) {
            this.dom.totalClicks.textContent = this.totalClicks.toLocaleString('nl-NL');
        }

        if (this.dom.totalStaff) {
            this.dom.totalStaff.textContent = this.totalStaff.toLocaleString('nl-NL');
        }

        if (this.dom.progressBar) {
            this.dom.progressBar.style.width = `${this.ProgressPercentage}%`;
        }

        document.dispatchEvent(new CustomEvent('gameUpdated'));
    }

    createFloatingText(event, text) {
        if (!this.dom.clickSection) return;

        const floatEl = document.createElement('span');
        floatEl.className = 'floating-number';
        floatEl.textContent = text;

        const rect = this.dom.playerBtn.getBoundingClientRect();
        const x = event.clientX ? (event.clientX - rect.left) : (rect.width / 2);
        const y = event.clientY ? (event.clientY - rect.top) : (rect.height / 2);

        floatEl.style.left = `${x}px`;
        floatEl.style.top = `${y}px`;

        this.dom.playerBtn.appendChild(floatEl);

        setTimeout(() => {
            floatEl.remove();
        }, 1000);
    }
}