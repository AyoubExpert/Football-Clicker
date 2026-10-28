import { GameStorage } from './storage.js';
import { ProductionUnit } from './productionUnit.js';
import { ClickUpgrade, ProductionUpgrade } from './upgrade.js';

export class FootballClickerGame {
    constructor(config = {}) {
        this.players = config.initialPlayers || 0;
        this.totalClicks = 0;
        this.totalStaff = 0;
        this.clickPower = 1;
        this.currentGoal = 100;
        this.previousGoal = 0;
        this.unlockedThemes = ['classic'];
        this.currentTheme = 'classic';

        this.storage = new GameStorage();

        this.units = {
            scout: new ProductionUnit('scout', 'Jeugd Scout', 10, 1, '🔍'),
            academy: new ProductionUnit('academy', 'Voetbalacademie', 50, 5, '🏆'),
            agent: new ProductionUnit('agent', 'Top Agent', 200, 20, '💼'),
            coach: new ProductionUnit('coach', 'Hoofdtrainer', 1000, 100, '👔'),
            analyst: new ProductionUnit('analyst', 'Tactisch Analysator', 5000, 450, '💻'),
            doctor: new ProductionUnit('doctor', 'Clubdokter', 15000, 1200, '🏥'),
            headscout: new ProductionUnit('headscout', 'Hoofdscout', 50000, 4000, '⭐'),
            stadium: new ProductionUnit('stadium', 'Stadion Uitbreiding', 200000, 15000, '🏟️')
        };

        this.upgrades = {
            goldenBoots: new ClickUpgrade('goldenBoots', 'Gouden Schoen', 100, '👟', 2),
            energyDrink: new ClickUpgrade('energyDrink', 'Energiedrank', 500, '⚡', 3),
            modTactics: new ProductionUpgrade('modTactics', 'Moderne Tactiek', 250, '📋', 'scout', 2),
            topFacilities: new ProductionUpgrade('topFacilities', 'Topfaciliteiten', 1000, '🏢', 'academy', 2),
            worldCup: new ProductionUpgrade('worldCup', 'WK Deelname', 5000, '🌍', 'agent', 2)
        };

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
        this.initSpecialEvent();
    }

    get pps() {
        let total = 0;
        for (let key in this.units) {
            total += this.units[key].totalRate;
        }
        return total;
    }

    init() {
        if (this.dom.playerBtn) {
            this.dom.playerBtn.addEventListener('click', (e) => this.handlePlayerClick(e));
        }

        document.addEventListener('buyUnit', (e) => this.handleBuyUnit(e.detail.id));
        document.addEventListener('buyUpgrade', (e) => this.handleBuyUpgrade(e.detail.id));
        document.addEventListener('changeTheme', (e) => this.setTheme(e.detail.theme));

        setInterval(() => {
            if (this.pps > 0) {
                this.players += this.pps / 10;
                this.checkGoal();
                this.updateUI();
            }
        }, 100);

        setInterval(() => this.saveGame(), 5000);

        this.checkGoal();
        this.updateUI();
    }

    handlePlayerClick(event) {
        this.players += this.clickPower;
        this.totalClicks++;
        this.checkGoal();
        this.checkUnlocks();
        this.createFloatingText(event, `+${this.clickPower}`);
        this.updateUI();
        this.saveGame();
    }

    handleBuyUnit(unitId) {
        const unit = this.units[unitId];
        if (unit && this.players >= unit.cost) {
            this.players -= unit.cost;
            unit.buy();
            this.totalStaff++;
            this.checkGoal();
            this.checkUnlocks();
            this.updateUI();
            this.saveGame();
        }
    }

    handleBuyUpgrade(upgradeId) {
        const upgrade = this.upgrades[upgradeId];
        if (upgrade && !upgrade.purchased && this.players >= upgrade.cost) {
            this.players -= upgrade.cost;
            upgrade.apply(this);
            this.updateUI();
            this.saveGame();
        }
    }

    initSpecialEvent() {
        setInterval(() => {
            if (Math.random() < 0.15) {
                this.spawnGoldenBall();
            }
        }, 30000);
    }

    spawnGoldenBall() {
        const ball = document.createElement('div');
        ball.className = 'golden-ball';
        ball.innerHTML = '⚽✨';
        ball.style.position = 'fixed';
        ball.style.left = `${Math.random() * 80 + 10}%`;
        ball.style.top = `${Math.random() * 80 + 10}%`;
        ball.style.cursor = 'pointer';
        ball.style.zIndex = '1000';
        ball.style.fontSize = '2rem';

        ball.addEventListener('click', () => {
            const bonus = Math.floor(this.pps * 15 + 50);
            this.players += bonus;
            this.createFloatingText({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, `+${bonus} BONUS!`);
            ball.remove();
            this.updateUI();
        });

        document.body.appendChild(ball);
        setTimeout(() => ball.remove(), 7000);
    }

    checkUnlocks() {
        if (this.totalClicks >= 50 && !this.unlockedThemes.includes('neon')) {
            this.unlockedThemes.push('neon');
            this.createFloatingText({ clientX: window.innerWidth / 2, clientY: 100 }, '🎨 Neon Vrijgespeeld!');
        }

        if (this.totalStaff >= 10 && !this.unlockedThemes.includes('gold')) {
            this.unlockedThemes.push('gold');
            this.createFloatingText({ clientX: window.innerWidth / 2, clientY: 100 }, '🏆 Goud Vrijgespeeld!');
        }
    }

    setTheme(themeName) {
        if (this.unlockedThemes.includes(themeName)) {
            this.currentTheme = themeName;
            document.body.className = `theme-${themeName}`;
            localStorage.setItem('footballClickerTheme', themeName);
        }
    }

    checkGoal() {
        while (this.players >= this.currentGoal) {
            this.previousGoal = this.currentGoal;
            this.currentGoal *= 2;
        }
    }

    saveGame() {
        const unitsData = {};
        for (let key in this.units) {
            unitsData[key] = { owned: this.units[key].owned, cost: this.units[key].cost, baseRate: this.units[key].baseRate };
        }
        const upgradesData = {};
        for (let key in this.upgrades) {
            upgradesData[key] = { purchased: this.upgrades[key].purchased };
        }

        this.storage.save({
            players: this.players,
            totalClicks: this.totalClicks,
            totalStaff: this.totalStaff,
            clickPower: this.clickPower,
            currentGoal: this.currentGoal,
            previousGoal: this.previousGoal,
            unlockedThemes: this.unlockedThemes,
            currentTheme: this.currentTheme,
            units: unitsData,
            upgrades: upgradesData
        });
    }

    loadGame() {
        const data = this.storage.load();
        if (data) {
            this.players = data.players ?? this.players;
            this.totalClicks = data.totalClicks ?? this.totalClicks;
            this.totalStaff = data.totalStaff ?? this.totalStaff;
            this.clickPower = data.clickPower ?? this.clickPower;
            this.currentGoal = data.currentGoal ?? this.currentGoal;
            this.previousGoal = data.previousGoal ?? this.previousGoal;
            this.unlockedThemes = data.unlockedThemes ?? this.unlockedThemes;
            this.currentTheme = data.currentTheme ?? this.currentTheme;

            if (data.units) {
                for (let key in data.units) {
                    if (this.units[key]) {
                        this.units[key].owned = data.units[key].owned;
                        this.units[key].cost = data.units[key].cost;
                        this.units[key].baseRate = data.units[key].baseRate;
                    }
                }
            }
            if (data.upgrades) {
                for (let key in data.upgrades) {
                    if (this.upgrades[key] && data.upgrades[key].purchased) {
                        this.upgrades[key].apply(this);
                    }
                }
            }
        }
        this.setTheme(this.currentTheme);
    }

    get ProgressPercentage() {
        const current = this.players - this.previousGoal;
        const total = this.currentGoal - this.previousGoal;
        return Math.min(Math.max((current / total) * 100, 0), 100);
    }

    updateUI() {
        if (this.dom.playerCount) this.dom.playerCount.textContent = Math.floor(this.players).toLocaleString('nl-NL');
        if (this.dom.pps) this.dom.pps.textContent = Math.floor(this.pps).toLocaleString('nl-NL');
        if (this.dom.totalClicks) this.dom.totalClicks.textContent = this.totalClicks.toLocaleString('nl-NL');
        if (this.dom.totalStaff) this.dom.totalStaff.textContent = this.totalStaff.toLocaleString('nl-NL');
        if (this.dom.progressBar) this.dom.progressBar.style.width = `${this.ProgressPercentage}%`;

        document.dispatchEvent(new CustomEvent('gameUpdated'));
    }

    createFloatingText(event, text) {
        if (!this.dom.clickSection) return;
        const floatEl = document.createElement('span');
        floatEl.className = 'floating-number';
        floatEl.textContent = text;
        const rect = this.dom.playerBtn.getBoundingClientRect();
        floatEl.style.left = `${event.clientX ? event.clientX - rect.left : rect.width / 2}px`;
        floatEl.style.top = `${event.clientY ? event.clientY - rect.top : rect.height / 2}px`;
        this.dom.playerBtn.appendChild(floatEl);
        setTimeout(() => floatEl.remove(), 1000);
    }
}