import React from "react";

import EmotesResource from "../components/EmotesResource";

const Emotes: React.FC<EmotesProps> = () => {
    return (
        <section>
            <EmotesResource />
        </section>
    );
};


interface EmotesProps {}

export default Emotes;
