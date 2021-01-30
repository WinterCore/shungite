type LocationChangeListener = (pathname: string) => void;

let listeners: LocationChangeListener[] = [];

export const addListener = (listener: LocationChangeListener) => {
    listeners.push(listener);
};

export const removeListener = (listener: LocationChangeListener) => {
    listeners = listeners.filter(l => l !== listener);
};

const origPushState = window.history.pushState;

window.history.pushState = (...args) => {
    origPushState.apply(window.history, args);
    listeners.forEach(l => l(args[2] as string));
};
