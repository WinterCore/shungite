type LocationChangeListener = (pathname: string) => void;

class LocationSpy {
    private listeners: LocationChangeListener[] = [];
    private lastLocation: string = window.location.pathname;

    constructor() {
        setInterval(() => {
            if (window.location.pathname !== this.lastLocation) {
                this.lastLocation = window.location.pathname;
                this.listeners.forEach(l => l(this.lastLocation));
            }
        }, 1000);
    }

    addListener(listener: LocationChangeListener) {
        this.listeners.push(listener)
    }

    removeListener(listener: LocationChangeListener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }
}

export default new LocationSpy();
