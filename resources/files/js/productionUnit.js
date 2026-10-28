export class ProductionUnit {
    constructor(id, name, baseCost, baseRate, icon) {
        this.id = id;
        this.name = name;
        this.baseCost = baseCost;
        this.baseRate = baseRate;
        this.icon = icon;
        this.owned = 0;
        this.cost = baseCost;
    }

    buy() {
        this.owned++;
        this.cost = Math.floor(this.baseCost * Math.pow(1.15, this.owned));
    }

    get totalRate() {
        return this.owned * this.baseRate;
    }
}