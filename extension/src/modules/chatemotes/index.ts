import Axios from "axios";
import escape from "escape-html";

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

const CHAT_MESSAGE_CLASS = "chat-line__message";
const CHAT_MESSAGE_TEXT_SELECTORS = [".text-fragment", ".text-fragment > span"];

const filterMessages = (nodes: NodeList): HTMLDivElement[] => (
    Array.from(nodes)
        .filter((node) => (node as HTMLDivElement).classList.contains(CHAT_MESSAGE_CLASS)) as HTMLDivElement[]
);

const createEmoteWrapper = (emote: Emote): HTMLSpanElement => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("bbttv-emote-wrapper");
    wrapper.style.display  = "inline-block";
    wrapper.style.position = "relative";

    const emoteImg = document.createElement("img");
    emoteImg.style.margin        = "-0.5rem 0";
    emoteImg.style.verticalAlign = "middle";
    emoteImg.title               = emote.keyword;
    emoteImg.src                 = EMOTE_URL(emote.id, "x1");
    emoteImg.srcset              = EMOTE_SIZES.map(size => `${EMOTE_URL(emote.id, size)} ${size.split("").reverse().join("")}`).join(", ");

    wrapper.appendChild(emoteImg);

    return wrapper;
};

const renderEmotesInNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        const words = node.textContent.split(" ");
        let modified = false;
        for (let i = 0; i < words.length; i += 1) {
            if (emotes[words[i]]) {
                modified = true;
                words[i] = createEmoteWrapper(emotes[words[i]]).innerHTML;
            } else {
                words[i] = escape(words[i]);
            }
        }
        if (modified) {
            const newNode = document.createElement("span") as HTMLSpanElement;
            newNode.innerHTML = words.join(" ");
            node.parentNode!.replaceChild(newNode, node);
        }
    }
};

const handleMessageNodeAdded = (node: HTMLDivElement): void => {
    setTimeout(() => { // setTimeout is used to avoid conflicts with BTTV
        const nodes = node.querySelectorAll(CHAT_MESSAGE_TEXT_SELECTORS.join(","));
        nodes.forEach(node => Array.from(node.childNodes).forEach(renderEmotesInNode))
    });
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
