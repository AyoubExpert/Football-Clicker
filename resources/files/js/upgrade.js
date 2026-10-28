export class BaseUpgrade {
    constructor(id, name, cost, icon) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.icon = icon;
        this.purchased = false;
    }

    apply(game) {
        this.purchased = true;
    }
}

export class ClickUpgrade extends BaseUpgrade {
    constructor(id, name, cost, icon, clickMultiplier) {
        super(id, name, cost, icon);
        this.clickMultiplier = clickMultiplier;
    }

    apply(game) {
        super.apply(game);
        game.clickPower *= this.clickMultiplier;
    }
}

export class ProductionUpgrade extends BaseUpgrade {
    constructor(id, name, cost, icon, targetUnitId, rateMultiplier) {
        super(id, name, cost, icon);
        this.targetUnitId = targetUnitId;
        this.rateMultiplier = rateMultiplier;
    }

    apply(game) {
        super.apply(game);
        const unit = game.units[this.targetUnitId];
        if (unit) {
            unit.baseRate *= this.rateMultiplier;
        }
    }
}