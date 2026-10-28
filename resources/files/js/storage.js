export class GameStorage {
    constructor(key = 'footballClickerSave1') {
        this.key = key;
    }

    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    load() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : null;
    }
}