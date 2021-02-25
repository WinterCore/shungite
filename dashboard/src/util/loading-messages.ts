const MESSAGES = [
  "The server is powered by a lemon and two electrodes.",
  "We're testing your patience",
  "Follow the white rabbit",
  "The last time I tried this the monkey didn't survive. Let's hope it works better this time.",
  "My other loading screen is much faster.",
  "Are we there yet?",
  "Have you lost weight?",
  "Just count to 10",
  "Counting backwards from Infinity",
  "Do you come here often?",
  "All your web browser are belong to us",
  "Constructing additional pylons...",
  "Still faster than Windows update",
  "Obfuscating quantum entaglement",
  "CAPS LOCK – Preventing Login Since 1980.",
  "Installing virus...",
  "Loading Error...",
  "Deleting system32...",
];

const getLoadingMessage = () => MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

export default getLoadingMessage;
