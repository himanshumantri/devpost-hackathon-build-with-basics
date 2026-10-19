import Avatar from "./Avatar.jsx";

// Two rows per person. Row 1: picture, name, Chat. Row 2: profession, interest tags,
// and their favorite place if they gave one.
export default function PersonCard({ person, onChat }) {
  return (
    <li className="person-card">
      <div className="person-row">
        <Avatar name={person.name} />
        <span className="person-name">{person.name}</span>
        <button
          type="button"
          className="chat-button"
          onClick={onChat ? () => onChat(person) : undefined}
          disabled={!onChat}
          title={onChat ? undefined : "Chat arrives in a later build step"}
        >
          Chat
        </button>
      </div>
      <div className="person-details">
        <span className="profession">{person.profession}</span>
        <ul className="tags" aria-label="Interests">
          {person.interests.map((interest) => (
            <li key={interest} className="tag">
              {interest}
            </li>
          ))}
        </ul>
        {person.favorite_place && (
          <span className="favorite">Favorite place: {person.favorite_place}</span>
        )}
      </div>
    </li>
  );
}
