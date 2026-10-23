// A gentle 6-second loop of real airport photos that walks through the stages of a layover:
// clear security, check the departures screen, settle in the lounge.
import security from "../assets/sec.jpg";
import board from "../assets/board.jpg";
import lounge from "../assets/lounge.jpg";

const SLIDES = [
  { src: security, caption: "Clear security", alt: "Travelers passing through an airport security checkpoint" },
  { src: board, caption: "Check your gate", alt: "Departures screens at an airport" },
  { src: lounge, caption: "Settle in and meet people", alt: "Travelers waiting in an airport departure lounge" },
];

export default function TravelerSlides() {
  return (
    <div className="slides" role="group" aria-label="From security to the lounge: a layover at the airport">
      {SLIDES.map((slide, i) => (
        <figure className="slide" style={{ animationDelay: `${i * 2}s` }} key={slide.caption}>
          <img src={slide.src} alt={slide.alt} />
          <figcaption>{slide.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
