import Avatar from "./Avatar.jsx";

// Row 1: picture, name (with age if shared) over profession, and the Chat button.
// Below: one line of capsules (boarding gate in blue, interests and venues in green), their
// favorite place if they gave one, and where they are originally from if they shared it.
export default function PersonCard({ person, onChat }) {
  return (
    <li className="person-card">
      <div className="person-row">
        <Avatar name={person.name} photoUrl={person.photo_url} />
        <div className="person-heading">
          <span className="person-name">
            {person.name}
            {person.age != null && <span className="person-age">, {person.age} yrs</span>}
          </span>
          <span className="profession">{person.profession}</span>
        </div>
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
        <ul className="tags" aria-label="Boarding gate, interests and preferred places">
          {person.gate && <li className="gate">Boarding gate {person.gate}</li>}
          {person.interests.map((interest) => (
            <li key={interest} className="tag">
              {interest}
            </li>
          ))}
          {(person.venues || []).map((venue) => (
            <li key={venue} className="tag">
              {venue}
            </li>
          ))}
        </ul>
        {person.favorite_place && (
          <span className="favorite">Favorite place: {person.favorite_place}</span>
        )}
        {person.native_city && (
          <span className="origin">
            {person.name} is originally from {person.native_city}
          </span>
        )}
      </div>
    </li>
  );
}
