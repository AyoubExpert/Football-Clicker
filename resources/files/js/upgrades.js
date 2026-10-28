export class UpgradeManager {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.upgrade-card');
            if (!button) return;

            const id = button.id.replace('buy-', '');

            if (this.game.units[id]) {
                document.dispatchEvent(new CustomEvent('buyUnit', { detail: { id } }));
            } else if (this.game.upgrades[id]) {
                document.dispatchEvent(new CustomEvent('buyUpgrade', { detail: { id } }));
            }
        });

        document.addEventListener('gameUpdated', () => {
            this.refreshUI();
        });

        this.refreshUI();
    }

    refreshUI() {
        if (!this.game.units || !this.game.upgrades) return;

        let totalOwnedCount = 0;
        const allItems = { ...this.game.units, ...this.game.upgrades };

        for (const [id, item] of Object.entries(allItems)) {
            const costEl = document.getElementById(`cost-${id}`);
            const ownedEl = document.getElementById(`owned-${id}`);
            const button = document.getElementById(`buy-${id}`);
            const costBadge = button ? button.querySelector('.cost-badge') : null;

            if (costEl) costEl.textContent = Math.floor(item.cost).toLocaleString('nl-NL');
            if (ownedEl) ownedEl.textContent = item.owned ?? (item.purchased ? '1' : '0');

            if (button) {
                const canAfford = this.game.players >= item.cost;
                const isAvailable = item.purchased === undefined || !item.purchased;

                if (canAfford && isAvailable) {
                    button.classList.remove('disabled');
                    if (costBadge) costBadge.style.backgroundColor = 'rgba(245, 158, 11, 0.12)';
                } else {
                    button.classList.add('disabled');
                    if (costBadge) costBadge.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
                }

                if (item.purchased) {
                    button.style.display = 'none';
                }
            }

            if (item.owned > 0 || item.purchased) {
                totalOwnedCount++;
            }
        }

        const upgradesCountEl = document.getElementById('upgrades-count');
        if (upgradesCountEl) {
            const totalCount = Object.keys(allItems).length;
            upgradesCountEl.textContent = `${totalOwnedCount}/${totalCount} Actief`;
        }
    }
}