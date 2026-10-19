// Chats are kept in the browser's session storage (a sticky note the browser keeps for this
// tab), one note per person, and messages older than 3 hours are dropped when read.
// If session storage isn't available (some private windows), chats are kept in memory
// for this visit only.

export const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

const keyFor = (personId) => `checkdin-chat-${personId}`;
const memoryChats = new Map();

function readRaw(personId) {
  try {
    const text = sessionStorage.getItem(keyFor(personId));
    return text ? JSON.parse(text) : [];
  } catch {
    return memoryChats.get(personId) || [];
  }
}

function writeRaw(personId, messages) {
  try {
    sessionStorage.setItem(keyFor(personId), JSON.stringify(messages));
  } catch {
    memoryChats.set(personId, messages);
  }
}

// Messages are { text, at } where `at` is the time it was sent, in milliseconds.
export function loadMessages(personId, now = Date.now()) {
  const recent = readRaw(personId).filter((message) => now - message.at <= THREE_HOURS_MS);
  writeRaw(personId, recent); // forget the old ones for good
  return recent;
}

export function saveMessage(personId, text, now = Date.now()) {
  const messages = [...loadMessages(personId, now), { text, at: now }];
  writeRaw(personId, messages);
  return messages;
}
