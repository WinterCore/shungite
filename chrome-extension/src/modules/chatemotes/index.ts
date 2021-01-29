let observer: MutationObserver | null = null;
const CLASSES = {
    chatContainer   : "chat-scrollable-area__message-container",
    chatMessage     : "chat-line__message",
    chatMessageText : "text-fragment",
};

type Emote = {
    id      : string;
    name    : string;
    channel : string;
};

const filterMessages = (nodes: NodeList): HTMLDivElement[] => (
    Array.from(nodes).filter((node) => (
        (node as HTMLDivElement).classList.contains(CLASSES.chatMessage)
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
    console.log(textNode?.textContent);
    if (!textNode || !textNode.textContent) return;
    textNode.innerHTML = textNode.textContent.replace('S', ` ${createEmoteWrapper().innerHTML} `);
};

const handleMutations: MutationCallback = (mutations) => {
    mutations
        .map((mutation) => filterMessages(mutation.addedNodes))
        .reduce((a, b) => [...a, ...b])
        .forEach(handleMessageNodeAdded);
};

let pollTimeout = -1;

const init = () => {
    const chatContainer = document.querySelector(`.${CLASSES.chatContainer}`);

    if (chatContainer) {
        clearTimeout(pollTimeout);
        observer = new MutationObserver(handleMutations);
        observer.observe(chatContainer, { childList: true });
    } else {
        pollTimeout = window.setTimeout(init, 200);
    }
};

const destroy = () => {
    if (observer)
        observer.disconnect();
};

export default { init, destroy };
