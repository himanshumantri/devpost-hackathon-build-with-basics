import PersonCard from "../components/PersonCard.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";

// Shows what App found: loading, an error, nobody, or up to five people.
export default function NearbyPeople({ matchState, onRetry, onStartOver, onChat }) {
  const { status, matches } = matchState;

  return (
    <main className="screen">
      <h1>Nearby people</h1>

      {status === "loading" && <p className="hint">Finding people at your airport…</p>}

      {status === "error" && (
        <div className="error">
          <p>Can't reach the server. Is the backend running?</p>
          <button type="button" className="link-button" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}

      {status === "done" && matches.length === 0 && (
        <>
          <p className="no-matches">
            No matches found. Start over and try expanding your interests &amp; choices
          </p>
          <PrimaryButton onClick={onStartOver}>Start Over</PrimaryButton>
        </>
      )}

      {status === "done" && matches.length > 0 && (
        <ul className="person-list">
          {matches.map((person) => (
            <PersonCard key={person.id} person={person} onChat={onChat} />
          ))}
        </ul>
      )}
    </main>
  );
}
