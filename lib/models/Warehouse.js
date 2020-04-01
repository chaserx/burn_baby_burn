export default class Warehouse {
    local = false;
    defaultKey = 'meetings';

    constructor() {
        if (typeof (Storage) !== "undefined") {
            this.local = true;
        }
    }

    save(payload, key=this.defaultKey) {
        if (!this.local) return null;
        // localStorage can only store strings but payload should be an array of objects
        let pastMeetings = JSON.parse(this.load()) || [];
        pastMeetings.push(payload);
        if (pastMeetings.length > 10) pastMeetings.shift();
        return window.localStorage.setItem(key, JSON.stringify(pastMeetings));
    }

    load(key=this.defaultKey) {
        if (!this.local) return null;
        if (!(typeof key === 'string' || key instanceof String)) return null;
        return window.localStorage.getItem(key);
    }

    remove(key=this.defaultKey) {
        if (!this.local) return null;
        if (!(typeof key === 'string' || key instanceof String)) return null;
        return window.localStorage.removeItem(key);
    }

    clear() {
        if (!this.local) return null;
        return window.localStorage.clear();
    }

    key(index) {
        if (!this.local) return null;
        return window.localStorage.key(index);
    }
}
