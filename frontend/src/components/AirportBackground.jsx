// A real airport photo, with reduced contrast so it sets the mood
// without competing with the screen content. Purely decorative.
import concourse from "../assets/bg.jpg";

export default function AirportBackground() {
  return (
    <div className="airport-bg" aria-hidden="true">
      <img src={concourse} alt="" />
    </div>
  );
}
