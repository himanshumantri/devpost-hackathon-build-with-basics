import { useEffect, useRef, useState } from "react";
import { loadMessages, saveMessage } from "../chatStore.js";
import Avatar from "../components/Avatar.jsx";

export default function Chat({ person, onBack }) {
  const [messages, setMessages] = useState(() => loadMessages(person.id));
  const [draft, setDraft] = useState("");
  const bottom = useRef(null);

  useEffect(() => {
    bottom.current?.scrollIntoView?.({ block: "end" });
  }, [messages]);

  function send(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages(saveMessage(person.id, trimmed));
  }

  function handleSubmit(event) {
    event.preventDefault();
    send(draft);
    setDraft("");
  }

  return (
    <main className="screen chat">
      <header className="chat-header">
        <button type="button" className="back-button" aria-label="Back to the list" onClick={onBack}>
          ←
        </button>
        <Avatar name={person.name} photoUrl={person.photo_url} />
        <h1>{person.name}</h1>
      </header>

      <ul className="messages" aria-label={`Conversation with ${person.name}`}>
        {messages.map((message, index) => (
          <li key={`${message.at}-${index}`} className="bubble">
            {message.text}
          </li>
        ))}
        <li ref={bottom} aria-hidden="true" />
      </ul>

      {messages.length === 0 && (
        <div className="say-hi">
          <p>Say hi to {person.name} to start the conversation.</p>
          <button type="button" className="secondary-button" onClick={() => send("Hi")}>
            Hi
          </button>
        </div>
      )}

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          aria-label="Type a message"
          placeholder="Type a message"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="send-button" disabled={draft.trim() === ""}>
          Send
        </button>
      </form>
    </main>
  );
}
