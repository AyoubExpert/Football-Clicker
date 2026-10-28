export class UpgradeManager {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.init();
    }

    init() {
        const upgradeButtons = document.querySelectorAll('.upgrade-card');

        upgradeButtons.forEach(button => {
            const id = button.id.replace('buy-', '');
            const baseCost = parseInt(button.getAttribute('data-cost'), 10);
            const rate = parseInt(button.getAttribute('data-rate'), 10);

            if (!this.game.upgradesState[id]) {
                this.game.upgradesState[id] = {
                    cost: baseCost,
                    owned: 0,
                    rate: rate
                };
            }

            button.addEventListener('click', () => {
                const upgrade = this.game.upgradesState[id];

                if (this.game.players >= upgrade.cost) {
                    document.dispatchEvent(new CustomEvent('buyUpgrade', {
                        detail: {
                            cost: upgrade.cost,
                            ppsIncrease: upgrade.rate,
                            clickPowerIncrease: 0,
                            isStaff: true
                        }
                    }));

                    upgrade.owned++;
                    upgrade.cost = Math.floor(upgrade.cost * 1.15);

                    this.updateUpgradeUI(id, upgrade);
                    this.game.saveGame();
                }
            });
        });

        document.addEventListener('gameUpdated', () => {
            this.refreshAllUpgradesUI();
        });

        this.refreshAllUpgradesUI();
    }

    updateUpgradeUI(id, upgrade) {
        const costEl = document.getElementById(`cost-${id}`);
        const ownedEl = document.getElementById(`owned-${id}`);

        if (costEl) costEl.textContent = upgrade.cost.toLocaleString('nl-NL');
        if (ownedEl) ownedEl.textContent = upgrade.owned;
    }

    refreshAllUpgradesUI() {
        if (!this.game.upgradesState) return;

        let totalOwnedCount = 0;

        for (const [id, upgrade] of Object.entries(this.game.upgradesState)) {
            const costEl = document.getElementById(`cost-${id}`);
            const ownedEl = document.getElementById(`owned-${id}`);
            const button = document.getElementById(`buy-${id}`);
            const costBadge = button ? button.querySelector('.cost-badge') : null;

            if (costEl) costEl.textContent = upgrade.cost.toLocaleString('nl-NL');
            if (ownedEl) ownedEl.textContent = upgrade.owned;

            if (button) {
                if (this.game.players >= upgrade.cost) {
                    button.classList.remove('disabled');
                    if (costBadge) costBadge.style.backgroundColor = 'rgba(245, 158, 11, 0.12)';
                } else {
                    button.classList.add('disabled');
                    if (costBadge) costBadge.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
                }
            }

            if (upgrade.owned > 0) {
                totalOwnedCount++;
            }
        }

        const upgradesCountEl = document.getElementById('upgrades-count');
        if (upgradesCountEl) {
            const totalUpgrades = Object.keys(this.game.upgradesState).length;
            upgradesCountEl.textContent = `${totalOwnedCount}/${totalUpgrades} Actief`;
        }
    }
}