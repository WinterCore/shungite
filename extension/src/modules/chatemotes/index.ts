import Axios from "axios";

import browserLocationSpy from "../../utils/location-spy";

import { EMOTE_SIZES, EMOTE_URL, GET_CHANNEL_EMOTES_URL } from "../../config";

type Emote = {
    id      : string;
    keyword : string;
    type    : "gif" | "image";
};

type ChannelEmotesResponse = {
    data: {
        uploaded_emotes : Emote[];
        public_emotes   : Emote[];
    };
};



let observer: MutationObserver | null = null;
let emotes: Record<string, Emote> = {};

const SELECTORS = [
    ".chat-scrollable-area__message-container",
    ".video-chat__message-list-wrapper ul",
];

const CLASSES = {
    chatMessage     : ["chat-line__message"],
    chatMessageText : ["text-fragment"],
};

const filterMessages = (nodes: NodeList): HTMLDivElement[] => (
    Array.from(nodes).filter((node) => (
        CLASSES.chatMessage.some(c => (
            (node as HTMLDivElement).classList.contains(c)
        ))
    )) as HTMLDivElement[]
);

const createEmoteWrapper = (emote: Emote): HTMLSpanElement => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("bbttv-emote-wrapper");
    wrapper.style.display  = "inline-block";
    wrapper.style.position = "relative";

    const emoteImg = document.createElement("img");
    emoteImg.style.margin        = "-0.5rem 0";
    emoteImg.style.verticalAlign = "middle";
    emoteImg.src                 = EMOTE_URL(emote.id, "x1");
    emoteImg.srcset              = EMOTE_SIZES.map(size => `${EMOTE_URL(emote.id, size)} ${size.split("").reverse().join("")}`).join(", ");

    wrapper.appendChild(emoteImg);

    return wrapper;
};

const handleMessageNodeAdded = (node: HTMLDivElement): void => {
    const textNode = node.querySelector(`.${CLASSES.chatMessageText}`);
    if (!textNode || !textNode.textContent) return;

    textNode.innerHTML = textNode.textContent
        .split(" ")
        .map(word => emotes[word] ? createEmoteWrapper(emotes[word]).innerHTML : word)
        .join(" ");
};

const handleMutations: MutationCallback = (mutations) => {
    mutations
        .map((mutation) => filterMessages(mutation.addedNodes))
        .reduce((a, b) => [...a, ...b])
        .forEach(handleMessageNodeAdded);
};

let pollTimeout = -1;

const actuallyInit = () => {
    const chatContainers = document.querySelectorAll(SELECTORS.join(","));

    clearTimeout(pollTimeout);
    if (chatContainers.length) {
        observer = new MutationObserver(handleMutations);

        // We only get the first one that matches, because I'm pretty sure there
        // won't be a situtation where we would have 2 chats open at the
        // same time in the same tab
        observer.observe(chatContainers[0], { childList: true });
    } else {
        pollTimeout = window.setTimeout(() => actuallyInit(), 500);
    }
};

const init = () => {
    const match = /^\/(?<username>\w+)/.exec(window.location.pathname);

    if (!match || !match.groups) return;

    Axios.get<ChannelEmotesResponse>(GET_CHANNEL_EMOTES_URL(match.groups.username))
        .then(({ data: { data } }) => {
            const channelEmotes = [...data.uploaded_emotes, ...data.public_emotes];
            emotes = channelEmotes.reduce((o, e) => {
                o[e.keyword] = e;
                return o;
            }, {} as Record<string, Emote>);

            actuallyInit();
        }).catch((e) => console.log("SHUNGITE: ", e));

};

const destroy = () => {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
};
const IGNORED_PATHNAMES = [
    { exact: true, path: "/" },
    { exact: false, path: "/directory" },
    { exact: false, path: "/u/" },
    { exact: false, path: "/settings" },
    { exact: false, path: "/friends" },
    { exact: false, path: "/subscriptions" },
    { exact: false, path: "/inventory" },
    { exact: false, path: "/wallet" },
    { exact: false, path: "/jobs" },
];

browserLocationSpy.addListener((pathname) => {
    const ignored = IGNORED_PATHNAMES.some(({ exact, path }) => exact ? path === pathname : pathname.startsWith(path));
    if (ignored) return;
    destroy();
    init();
});

export default { init, destroy };
