import * as browserLocationSpy from "../../utils/location-spy";

let observer: MutationObserver | null = null;

const SELECTORS = [
    ".chat-scrollable-area__message-container",
    ".video-chat__message-list-wrapper ul",
];
const CLASSES = {
    chatMessage     : ["chat-line__message", ""],
    chatMessageText : ["text-fragment"],
};

type Emote = {
    id      : string;
    name    : string;
    channel : string;
};

const filterMessages = (nodes: NodeList): HTMLDivElement[] => (
    Array.from(nodes).filter((node) => (
        CLASSES.chatMessage.some(c => (
            (node as HTMLDivElement).classList.contains(c)
        ))
    )) as HTMLDivElement[]
);

const createEmoteWrapper = (): HTMLSpanElement => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("bbttv-emote-wrapper");
    wrapper.style.display  = "inline-block";
    wrapper.style.position = "relative";

    const emoteImg = document.createElement("img");
    emoteImg.style.margin        = "-0.5rem 0";
    emoteImg.style.verticalAlign = "middle";
    emoteImg.src                 = "https://i.imgur.com/MVAQCKf.png";

    wrapper.appendChild(emoteImg);

    return wrapper;
};

const handleMessageNodeAdded = (node: HTMLDivElement): void => {
    const textNode = node.querySelector(`.${CLASSES.chatMessageText}`);
    if (!textNode || !textNode.textContent) return;
    textNode.innerHTML = textNode.textContent.replace(" is ", ` ${createEmoteWrapper().innerHTML} `);
};

const handleMutations: MutationCallback = (mutations) => {
    mutations
        .map((mutation) => filterMessages(mutation.addedNodes))
        .reduce((a, b) => [...a, ...b])
        .forEach(handleMessageNodeAdded);
};

let pollTimeout = -1;

const init = () => {
    const chatContainers = document.querySelectorAll(SELECTORS.join(","));

    if (chatContainers.length) {
        clearTimeout(pollTimeout);
        observer = new MutationObserver(handleMutations);

        // We only get the first one that matches, because I'm pretty sure there
        // won't be a situtation where we would have 2 chats open at the
        // same time in the same tab
        observer.observe(chatContainers[0], { childList: true });
    } else {
        pollTimeout = window.setTimeout(init, 500);
    }
};

const destroy = () => {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
};

browserLocationSpy.addListener(() => {
    destroy();
    init();
});

export default { init, destroy };
