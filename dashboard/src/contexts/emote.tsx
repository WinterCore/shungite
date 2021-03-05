import React from "react";

import { Emote } from "../api/models";

const EmoteContext = React.createContext<EmoteProviderI | null>(null);

type EmoteUpdater = (emote: Partial<Emote>) => void;

interface EmoteProviderI {
    emote  : Emote;
    update : EmoteUpdater;
}

interface EmoteProviderProps {
    emote: Emote;
}

const EmoteProvider: React.FC<EmoteProviderProps> = ({ emote: origEmote, ...props }) => {
    const [emote, setEmote] = React.useState(() => origEmote);

    const update: EmoteUpdater = (partial) => setEmote(emote => ({ ...emote, ...partial }));

    return <EmoteContext.Provider value={{ emote, update }} { ...props } />;
};

function useEmote() {
    const context = React.useContext(EmoteContext);

    if (!context)
        throw new Error("useEmote must be used as a child of EmoteProvider");

    return context;
}

export {
    EmoteProvider,
    useEmote,
};