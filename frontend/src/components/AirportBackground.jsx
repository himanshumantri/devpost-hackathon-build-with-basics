// A bright, illustrated airport hall that sits behind every screen:
// check-in counter, security, cafe and lounge. Purely decorative.

const TILE_LINES_X = Array.from({ length: 17 }, (_, i) => i * 100);

function Cloud({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff" opacity="0.9">
      <ellipse cx="0" cy="0" rx="46" ry="16" />
      <ellipse cx="-24" cy="-10" rx="24" ry="14" />
      <ellipse cx="18" cy="-14" rx="28" ry="16" />
    </g>
  );
}

function Suitcase({ x, y, color, w = 40, h = 52 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-h} width={w} height={h} rx="7" fill={color} />
      <rect x={-w / 2 + 6} y={-h} width="4" height={h} fill="#ffffff" opacity="0.35" />
      <rect x={-8} y={-h - 9} width="16" height="9" rx="3" fill="none" stroke="#6b7785" strokeWidth="3" />
    </g>
  );
}

function Armchair({ x, y, color, dark }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-34" y="-72" width="68" height="52" rx="16" fill={color} />
      <rect x="-44" y="-44" width="20" height="38" rx="9" fill={dark} />
      <rect x="24" y="-44" width="20" height="38" rx="9" fill={dark} />
      <rect x="-30" y="-34" width="60" height="22" rx="8" fill={dark} opacity="0.55" />
      <rect x="-30" y="-8" width="6" height="12" fill="#8a7a62" />
      <rect x="24" y="-8" width="6" height="12" fill="#8a7a62" />
    </g>
  );
}

export default function AirportBackground() {
  return (
    <div className="airport-bg" aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e3f3ff" />
            <stop offset="1" stopColor="#fff7e6" />
          </linearGradient>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b9e2ff" />
            <stop offset="1" stopColor="#e8f6ff" />
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6ecd6" />
            <stop offset="1" stopColor="#fbf5e8" />
          </linearGradient>
        </defs>

        {/* hall wall and floor */}
        <rect width="1600" height="900" fill="url(#wall)" />
        <rect y="640" width="1600" height="260" fill="url(#floor)" />
        <rect y="636" width="1600" height="8" fill="#e6d8b8" />
        {TILE_LINES_X.map((x) => (
          <line
            key={x}
            x1={x}
            y1="644"
            x2={x < 800 ? x - (800 - x) * 0.5 : x + (x - 800) * 0.5}
            y2="900"
            stroke="#eadfc4"
            strokeWidth="2"
          />
        ))}
        <line x1="0" y1="740" x2="1600" y2="740" stroke="#eadfc4" strokeWidth="2" />
        <line x1="0" y1="830" x2="1600" y2="830" stroke="#eadfc4" strokeWidth="2" />

        {/* big windows with sky and a plane */}
        <rect x="0" y="60" width="1600" height="330" fill="url(#sky)" />
        <Cloud x={220} y={170} s={1.3} />
        <Cloud x={720} y={250} />
        <Cloud x={1180} y={150} s={1.2} />
        <Cloud x={1480} y={290} s={0.9} />
        <g transform="translate(980 220) rotate(-8)">
          <ellipse cx="0" cy="0" rx="80" ry="12" fill="#ffffff" />
          <path d="M-10 -2 L-40 -44 L-22 -44 L22 -2 Z" fill="#dcecf9" />
          <path d="M-10 4 L-40 42 L-22 42 L22 4 Z" fill="#dcecf9" />
          <path d="M-72 -4 L-86 -30 L-70 -30 L-52 -4 Z" fill="#ff8a65" />
          <rect x="40" y="-5" width="30" height="4" rx="2" fill="#7fb7e6" />
        </g>
        <g fill="#f4fafe">
          {[0, 200, 400, 600, 800, 1000, 1200, 1400, 1600].map((x) => (
            <rect key={x} x={x - 6} y="60" width="12" height="330" />
          ))}
          <rect x="0" y="52" width="1600" height="16" />
          <rect x="0" y="384" width="1600" height="14" />
        </g>
        <rect x="0" y="398" width="1600" height="238" fill="#fdf4e1" opacity="0.55" />

        {/* ===== check-in counter ===== */}
        <g>
          <rect x="60" y="430" width="360" height="52" rx="10" fill="#2e8bd8" />
          <text x="240" y="466" textAnchor="middle" fontSize="30" fontWeight="800" fill="#ffffff" letterSpacing="3">
            CHECK-IN
          </text>
          <rect x="120" y="482" width="6" height="40" fill="#9db3c8" />
          <rect x="354" y="482" width="6" height="40" fill="#9db3c8" />
          <rect x="50" y="560" width="380" height="80" rx="8" fill="#ffffff" />
          <rect x="50" y="548" width="380" height="18" rx="8" fill="#cfe6f8" />
          <rect x="80" y="578" width="150" height="46" rx="6" fill="#e8f3fb" />
          <rect x="250" y="578" width="150" height="46" rx="6" fill="#e8f3fb" />
          <rect x="100" y="506" width="66" height="44" rx="5" fill="#3b4a5a" />
          <rect x="106" y="512" width="54" height="32" rx="3" fill="#bfe3ff" />
          <rect x="290" y="506" width="66" height="44" rx="5" fill="#3b4a5a" />
          <rect x="296" y="512" width="54" height="32" rx="3" fill="#bfe3ff" />
          <Suitcase x={458} y={640} color="#56b4a4" w={46} h={60} />
          <Suitcase x={510} y={640} color="#a78bd6" w={38} h={50} />
        </g>

        {/* ===== security counter ===== */}
        <g>
          <rect x="600" y="430" width="300" height="52" rx="10" fill="#f2b632" />
          <text x="750" y="466" textAnchor="middle" fontSize="30" fontWeight="800" fill="#3d2f06" letterSpacing="3">
            SECURITY
          </text>
          {/* walk-through gate */}
          <rect x="650" y="500" width="16" height="140" rx="4" fill="#9fb4c7" />
          <rect x="834" y="500" width="16" height="140" rx="4" fill="#9fb4c7" />
          <rect x="644" y="490" width="212" height="26" rx="8" fill="#b9cbdb" />
          <circle cx="750" cy="503" r="7" fill="#58c27d" />
          {/* x-ray belt */}
          <rect x="560" y="590" width="100" height="22" rx="6" fill="#4b5968" />
          <rect x="568" y="578" width="84" height="14" rx="3" fill="#e9eef3" />
          <rect x="574" y="560" width="72" height="20" rx="5" fill="#7a8ea3" />
          <rect x="566" y="612" width="6" height="28" fill="#8d9fb1" />
          <rect x="648" y="612" width="6" height="28" fill="#8d9fb1" />
          {/* officer desk */}
          <rect x="880" y="570" width="90" height="70" rx="6" fill="#ffffff" />
          <rect x="880" y="562" width="90" height="12" rx="5" fill="#cdd9e4" />
          <rect x="896" y="530" width="48" height="34" rx="4" fill="#3b4a5a" />
          <rect x="901" y="535" width="38" height="24" rx="2" fill="#bfe3ff" />
          {/* queue posts */}
          {[490, 540].map((x) => (
            <g key={x}>
              <rect x={x} y="590" width="6" height="50" fill="#8d9fb1" />
              <circle cx={x + 3} cy="588" r="7" fill="#e86a5a" />
            </g>
          ))}
          <path d="M496 598 Q518 616 540 598" stroke="#e86a5a" strokeWidth="4" fill="none" />
        </g>

        {/* ===== cafe ===== */}
        <g>
          <rect x="1000" y="430" width="300" height="52" rx="10" fill="#8a5a3c" />
          <text x="1150" y="466" textAnchor="middle" fontSize="30" fontWeight="800" fill="#fff4e2" letterSpacing="4">
            CAFÉ
          </text>
          {/* striped awning */}
          {Array.from({ length: 10 }, (_, i) => (
            <path key={i} d={`M${1000 + i * 30} 486 h30 v28 q-15 12 -30 0 z`} fill={i % 2 ? "#ffffff" : "#ef6b57"} />
          ))}
          <rect x="1010" y="530" width="280" height="14" fill="#f3e3c8" />
          <rect x="1010" y="544" width="280" height="96" rx="6" fill="#d7a874" />
          <rect x="1010" y="544" width="280" height="14" rx="6" fill="#b98355" />
          {/* menu board */}
          <rect x="1030" y="556" width="70" height="52" rx="4" fill="#2f3b45" />
          <line x1="1040" y1="570" x2="1090" y2="570" stroke="#f0f4f7" strokeWidth="3" />
          <line x1="1040" y1="582" x2="1082" y2="582" stroke="#f0f4f7" strokeWidth="3" />
          <line x1="1040" y1="594" x2="1088" y2="594" stroke="#f0f4f7" strokeWidth="3" />
          {/* espresso machine and cup */}
          <rect x="1180" y="506" width="70" height="38" rx="6" fill="#aeb8c2" />
          <rect x="1190" y="516" width="16" height="22" rx="3" fill="#7d8a97" />
          <rect x="1260" y="520" width="20" height="24" rx="4" fill="#ffffff" />
          <path d="M1280 526 h8 a6 6 0 0 1 0 12 h-8" fill="none" stroke="#ffffff" strokeWidth="3" />
          {/* cafe tables */}
          {[1060, 1230].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy="660" rx="40" ry="10" fill="#fffaf0" stroke="#d8c7a3" strokeWidth="2" />
              <rect x={x - 3} y="660" width="6" height="56" fill="#9aa5b0" />
              <ellipse cx={x} cy="720" rx="22" ry="6" fill="#b9c3cc" />
              <rect x={x - 6} y="646" width="12" height="12" rx="2" fill="#ffffff" />
              <rect x={x - 62} y="676" width="26" height="6" rx="3" fill="#ef6b57" />
              <rect x={x - 52} y="682" width="5" height="34" fill="#9aa5b0" />
              <rect x={x + 36} y="676" width="26" height="6" rx="3" fill="#ef6b57" />
              <rect x={x + 47} y="682" width="5" height="34" fill="#9aa5b0" />
            </g>
          ))}
        </g>

        {/* ===== lounge ===== */}
        <g>
          <text x="1450" y="466" textAnchor="middle" fontSize="28" fontWeight="800" fill="#2a8c82" letterSpacing="3">
            LOUNGE
          </text>
          <rect x="1370" y="480" width="160" height="6" rx="3" fill="#7bd0c6" />
          <Armchair x={1390} y={640} color="#6fcfc3" dark="#4eb5a8" />
          <Armchair x={1500} y={640} color="#f6a86b" dark="#e48d4a" />
          <rect x="1425" y="618" width="36" height="22" rx="4" fill="#ffffff" />
          {/* plant */}
          <rect x="1558" y="598" width="32" height="42" rx="5" fill="#d98c5f" />
          <path d="M1574 598 q-34 -30 -22 -72 q18 22 22 72" fill="#4caf72" />
          <path d="M1574 598 q30 -26 22 -68 q-20 20 -22 68" fill="#6cc98c" />
          {/* floor lamp */}
          <rect x="1334" y="530" width="5" height="110" fill="#9aa5b0" />
          <path d="M1318 530 l36 0 l-8 -30 l-20 0 z" fill="#ffe29a" />
        </g>

        {/* a light wash over the floor keeps the whole scene bright */}
        <rect y="640" width="1600" height="260" fill="#ffffff" opacity="0.25" />
      </svg>
    </div>
  );
}
