// A short looping cartoon (about 6 seconds): a traveler with a sleek laptop bag walks through
// security, looks up at the departures screen, then settles into the lounge.

const LOOP_SECONDS = 6;
// Parts of the loop (in percent) when he is walking.
const WALKS = [
  [0, 35],
  [62, 80],
];

// Legs and arms swing while he walks and stay still while he stands.
function swingFrames(name, sign) {
  const frames = [];
  for (const [start, end] of WALKS) {
    frames.push(`${start}%{transform:rotate(0deg)}`);
    let p = start + 2.5;
    let dir = 1;
    while (p < end - 1) {
      frames.push(`${p}%{transform:rotate(${sign * dir * 28}deg)}`);
      dir = -dir;
      p += 5;
    }
    frames.push(`${end}%{transform:rotate(0deg)}`);
  }
  return `@keyframes ${name}{${frames.join("")}}`;
}

const CSS = `
.ts-walker{animation:ts-move ${LOOP_SECONDS}s linear infinite}
.ts-seated{animation:ts-sit ${LOOP_SECONDS}s linear infinite}
.ts-legA{animation:ts-legA ${LOOP_SECONDS}s ease-in-out infinite}
.ts-legB{animation:ts-legB ${LOOP_SECONDS}s ease-in-out infinite}
.ts-armA{animation:ts-legB ${LOOP_SECONDS}s ease-in-out infinite}
.ts-armB{animation:ts-legA ${LOOP_SECONDS}s ease-in-out infinite}
.ts-head{animation:ts-head ${LOOP_SECONDS}s ease-in-out infinite}
.ts-gate{animation:ts-gate ${LOOP_SECONDS}s linear infinite}
.ts-blink{animation:ts-blink 1.2s steps(2,jump-none) infinite}
.ts-legA,.ts-legB,.ts-armA,.ts-armB,.ts-head{transform-origin:0 0}
@keyframes ts-move{
  0%{transform:translateX(30px);opacity:0}
  3%{transform:translateX(48px);opacity:1}
  35%{transform:translateX(330px);opacity:1}
  62%{transform:translateX(330px);opacity:1}
  80%{transform:translateX(505px);opacity:1}
  80.5%{transform:translateX(505px);opacity:0}
  100%{transform:translateX(505px);opacity:0}
}
@keyframes ts-sit{
  0%,80%{opacity:0}
  81%{opacity:1}
  95%{opacity:1}
  99%,100%{opacity:0}
}
@keyframes ts-head{
  0%,38%{transform:rotate(0deg)}
  43%,58%{transform:rotate(-20deg)}
  63%,100%{transform:rotate(0deg)}
}
@keyframes ts-gate{
  0%,15%{fill:#d0d7de}
  18%,24%{fill:#3ec16f}
  27%,100%{fill:#d0d7de}
}
@keyframes ts-blink{from{opacity:1}to{opacity:0.25}}
${swingFrames("ts-legA", 1)}
${swingFrames("ts-legB", -1)}
@media (prefers-reduced-motion: reduce){
  .ts-walker,.ts-seated,.ts-legA,.ts-legB,.ts-armA,.ts-armB,.ts-head,.ts-gate,.ts-blink{animation:none}
  .ts-walker{transform:translateX(330px)}
}
`;

function Traveler() {
  return (
    <g>
      {/* far leg and arm */}
      <g transform="translate(0 -45)">
        <g className="ts-legB">
          <rect x="-4.5" y="0" width="9" height="40" rx="4" fill="#2a3550" />
          <rect x="-5" y="38" width="15" height="7" rx="3.5" fill="#1b2230" />
        </g>
      </g>
      <g transform="translate(0 -77)">
        <g className="ts-armB">
          <rect x="-4" y="0" width="8" height="30" rx="4" fill="#1f3a68" />
        </g>
      </g>
      {/* body: navy blazer over a white shirt */}
      <rect x="-11" y="-82" width="22" height="40" rx="9" fill="#243f73" />
      <path d="M-3 -80 L3 -80 L0 -62 Z" fill="#ffffff" />
      {/* near leg */}
      <g transform="translate(0 -45)">
        <g className="ts-legA">
          <rect x="-4.5" y="0" width="9" height="40" rx="4" fill="#34415f" />
          <rect x="-5" y="38" width="15" height="7" rx="3.5" fill="#1b2230" />
        </g>
      </g>
      {/* head */}
      <g transform="translate(0 -83)">
        <g className="ts-head">
          <rect x="-3" y="-2" width="6" height="6" fill="#e7b995" />
          <circle cx="0" cy="-10" r="10" fill="#f0c6a2" />
          <path d="M-10 -11 q1 -12 11 -11 q9 1 9 9 q-7 -6 -20 2 z" fill="#2b2118" />
        </g>
      </g>
      {/* near arm */}
      <g transform="translate(0 -77)">
        <g className="ts-armA">
          <rect x="-4" y="0" width="8" height="30" rx="4" fill="#243f73" />
          <circle cx="0" cy="31" r="4" fill="#f0c6a2" />
        </g>
      </g>
      {/* sleek laptop bag on the shoulder */}
      <path d="M-2 -80 L12 -56" stroke="#1d242c" strokeWidth="3.5" strokeLinecap="round" />
      <g transform="translate(2 -62)">
        <rect x="-4" y="0" width="30" height="21" rx="4" fill="#2a323b" />
        <rect x="-4" y="7" width="30" height="2" fill="#4a5662" />
        <rect x="14" y="3" width="8" height="2.5" rx="1" fill="#c8d2dc" />
      </g>
    </g>
  );
}

function SeatedTraveler() {
  return (
    <g transform="scale(-1 1)">
      {/* thigh and shin */}
      <rect x="-4" y="-34" width="32" height="10" rx="5" fill="#34415f" />
      <rect x="20" y="-34" width="10" height="36" rx="4" fill="#34415f" />
      <rect x="20" y="-2" width="16" height="7" rx="3.5" fill="#1b2230" />
      {/* torso, relaxed against the sofa */}
      <rect x="-12" y="-72" width="22" height="42" rx="9" fill="#243f73" />
      <path d="M-4 -70 L2 -70 L-1 -52 Z" fill="#ffffff" />
      {/* bag resting on his lap */}
      <g transform="translate(2 -50)">
        <rect x="0" y="0" width="30" height="20" rx="4" fill="#2a323b" />
        <rect x="0" y="7" width="30" height="2" fill="#4a5662" />
        <rect x="19" y="3" width="8" height="2.5" rx="1" fill="#c8d2dc" />
      </g>
      <circle cx="-1" cy="-83" r="10" fill="#f0c6a2" />
      <path d="M-11 -84 q1 -12 11 -11 q9 1 9 9 q-7 -6 -20 2 z" fill="#2b2118" />
    </g>
  );
}

export default function TravelerScene() {
  return (
    <svg
      className="traveler-scene"
      viewBox="0 0 600 300"
      role="img"
      aria-label="A traveler with a laptop bag walks through security, checks the departures screen, and relaxes in the airport lounge"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{CSS}</style>
      <defs>
        <linearGradient id="ts-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6edff" />
          <stop offset="1" stopColor="#fff6e4" />
        </linearGradient>
      </defs>

      {/* hall */}
      <rect width="600" height="300" fill="url(#ts-wall)" />
      <rect y="250" width="600" height="50" fill="#f3e8cf" />
      <rect y="247" width="600" height="5" fill="#e3d4b3" />
      <rect x="0" y="20" width="600" height="8" fill="#ffffff" opacity="0.7" />

      {/* security: x-ray belt and walk-through gate */}
      <rect x="62" y="215" width="76" height="20" rx="5" fill="#4b5968" />
      <rect x="68" y="203" width="64" height="12" rx="3" fill="#e9eef3" />
      <rect x="74" y="186" width="50" height="18" rx="4" fill="#7a8ea3" />
      <rect x="150" y="96" width="76" height="18" rx="5" fill="#f2b632" />
      <text x="188" y="109" textAnchor="middle" fontSize="11" fontWeight="800" fill="#3d2f06" letterSpacing="1">
        SECURITY
      </text>
      <rect x="150" y="124" width="9" height="124" rx="3" fill="#9fb4c7" />
      <rect x="217" y="124" width="9" height="124" rx="3" fill="#9fb4c7" />
      <rect x="146" y="116" width="84" height="14" rx="5" fill="#b9cbdb" />
      <circle className="ts-gate" cx="188" cy="123" r="4.5" fill="#d0d7de" />

      {/* departures screen */}
      <rect x="296" y="52" width="140" height="84" rx="6" fill="#17324e" />
      <rect x="302" y="58" width="128" height="14" rx="3" fill="#2b5b8a" />
      <text x="366" y="69" textAnchor="middle" fontSize="9" fontWeight="800" fill="#ffffff" letterSpacing="1.5">
        DEPARTURES
      </text>
      {[80, 94, 108, 122].map((y, i) => (
        <g key={y}>
          <rect x="308" y={y} width="30" height="5" rx="2" fill="#9ecbf0" />
          <rect x="346" y={y} width="48" height="5" rx="2" fill="#dbe9f6" />
          <rect
            className={i === 1 ? "ts-blink" : undefined}
            x="402"
            y={y}
            width="20"
            height="5"
            rx="2"
            fill={i === 1 ? "#ffb347" : "#7fdc9b"}
          />
        </g>
      ))}
      <rect x="360" y="136" width="12" height="16" fill="#9fb4c7" />

      {/* lounge sofa and plant */}
      <text x="508" y="96" textAnchor="middle" fontSize="12" fontWeight="800" fill="#2a8c82" letterSpacing="2">
        LOUNGE
      </text>
      <rect x="454" y="176" width="112" height="60" rx="16" fill="#6fcfc3" />
      <rect x="444" y="204" width="24" height="42" rx="10" fill="#4eb5a8" />
      <rect x="552" y="204" width="24" height="42" rx="10" fill="#4eb5a8" />
      <rect x="462" y="224" width="96" height="22" rx="9" fill="#4eb5a8" opacity="0.7" />
      <rect x="460" y="246" width="6" height="6" fill="#8a7a62" />
      <rect x="554" y="246" width="6" height="6" fill="#8a7a62" />
      <rect x="578" y="214" width="20" height="30" rx="4" fill="#d98c5f" />
      <path d="M588 214 q-22 -20 -14 -48 q12 14 14 48" fill="#4caf72" />
      <path d="M588 214 q20 -18 14 -46 q-13 13 -14 46" fill="#6cc98c" />

      {/* the traveler */}
      <g transform="translate(0 250)">
        <g className="ts-walker">
          <Traveler />
        </g>
        <g transform="translate(505 0)">
          <g className="ts-seated" style={{ opacity: 0 }}>
            <SeatedTraveler />
          </g>
        </g>
      </g>
    </svg>
  );
}
