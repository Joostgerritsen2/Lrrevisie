// Technische SVG blauwdruk-illustraties per categorie
// Stijl: dunne groene lijnen op donker, CAD/engineering aesthetic

interface Props {
  slug: string
  className?: string
}

export function CategoryIllustration({ slug, className = '' }: Props) {
  const props = {
    viewBox: '0 0 200 200',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className,
  }

  switch (slug) {
    // ── Versnellingsbak — twee tandwielen in elkaar ──────────────────────────
    case 'gereviseerde-versnellingsbakken':
      return (
        <svg {...props}>
          {/* Groot tandwiel links */}
          <circle cx="75" cy="105" r="48" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="75" cy="105" r="32" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
          <circle cx="75" cy="105" r="8" stroke="currentColor" strokeWidth="1.5" />
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => {
            const rad = (a * Math.PI) / 180
            const x1 = 75 + 48 * Math.cos(rad); const y1 = 105 + 48 * Math.sin(rad)
            const x2 = 75 + 56 * Math.cos(rad); const y2 = 105 + 56 * Math.sin(rad)
            return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
          })}
          {/* Klein tandwiel rechts */}
          <circle cx="143" cy="68" r="30" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="143" cy="68" r="18" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
          <circle cx="143" cy="68" r="5" stroke="currentColor" strokeWidth="1.5" />
          {[0,40,80,120,160,200,240,280,320].map(a => {
            const rad = (a * Math.PI) / 180
            const x1 = 143 + 30 * Math.cos(rad); const y1 = 68 + 30 * Math.sin(rad)
            const x2 = 143 + 37 * Math.cos(rad); const y2 = 68 + 37 * Math.sin(rad)
            return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="3.5" strokeLinecap="square" />
          })}
          {/* As */}
          <line x1="75" y1="105" x2="75" y2="165" stroke="currentColor" strokeWidth="3" />
          <line x1="60" y1="165" x2="90" y2="165" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )

    // ── Tussenbak — as met 3-weg verdeling ──────────────────────────────────
    case 'gereviseerde-tussenbakken':
      return (
        <svg {...props}>
          {/* Hoofd behuizing */}
          <rect x="60" y="60" width="80" height="80" rx="4" stroke="currentColor" strokeWidth="1.5" />
          <rect x="70" y="70" width="60" height="60" rx="2" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
          {/* Input as links */}
          <line x1="15" y1="100" x2="60" y2="100" stroke="currentColor" strokeWidth="3" />
          <circle cx="15" cy="100" r="8" stroke="currentColor" strokeWidth="1.5" />
          {/* Output as rechts (high) */}
          <line x1="140" y1="85" x2="185" y2="70" stroke="currentColor" strokeWidth="3" />
          <circle cx="185" cy="70" r="7" stroke="currentColor" strokeWidth="1.5" />
          {/* Output as rechts (low) */}
          <line x1="140" y1="115" x2="185" y2="130" stroke="currentColor" strokeWidth="3" />
          <circle cx="185" cy="130" r="7" stroke="currentColor" strokeWidth="1.5" />
          {/* Labels */}
          <text x="100" y="104" textAnchor="middle" stroke="currentColor" fill="currentColor" fontSize="9" fontFamily="monospace">LT230</text>
          {/* H/L selector */}
          <line x1="100" y1="140" x2="100" y2="160" stroke="currentColor" strokeWidth="2" />
          <rect x="88" y="158" width="24" height="14" stroke="currentColor" strokeWidth="1.5" />
          <text x="100" y="168" textAnchor="middle" fill="currentColor" stroke="none" fontSize="7" fontFamily="monospace">H/L</text>
          {/* Kruisje midden */}
          <circle cx="100" cy="100" r="10" stroke="currentColor" strokeWidth="1.5" />
          <line x1="93" y1="100" x2="107" y2="100" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="93" x2="100" y2="107" stroke="currentColor" strokeWidth="1" />
        </svg>
      )

    // ── Differentieel — spinnenwiel arrangement ──────────────────────────────
    case 'gereviseerde-differentielen':
      return (
        <svg {...props}>
          {/* Buitenring */}
          <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1.5" />
          {/* Tandwiel tanden */}
          {[0,18,36,54,72,90,108,126,144,162,180,198,216,234,252,270,288,306,324,342].map(a => {
            const rad = (a * Math.PI) / 180
            const x1 = 100 + 70 * Math.cos(rad); const y1 = 100 + 70 * Math.sin(rad)
            const x2 = 100 + 78 * Math.cos(rad); const y2 = 100 + 78 * Math.sin(rad)
            return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
          })}
          {/* Binnenring */}
          <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
          {/* Spider gears — 4 kleine cirkels op kruispunten */}
          {[[100,55],[145,100],[100,145],[55,100]].map(([cx,cy],i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="12" stroke="currentColor" strokeWidth="1.5" />
              <circle cx={cx} cy={cy} r="5" stroke="currentColor" strokeWidth="1" />
            </g>
          ))}
          {/* Kruisas */}
          <line x1="100" y1="55" x2="100" y2="145" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="55" y1="100" x2="145" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          {/* Centrum */}
          <circle cx="100" cy="100" r="12" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="4" fill="currentColor" />
          {/* Output assen */}
          <line x1="20" y1="100" x2="55" y2="100" stroke="currentColor" strokeWidth="3" />
          <line x1="145" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="3" />
        </svg>
      )

    // ── Stuurhuis — worm gear + sector as ───────────────────────────────────
    case 'gereviseerde-stuurhuizen':
      return (
        <svg {...props}>
          {/* Stuurkolom */}
          <line x1="100" y1="20" x2="100" y2="80" stroke="currentColor" strokeWidth="3" />
          <circle cx="100" cy="20" r="12" stroke="currentColor" strokeWidth="1.5" />
          {/* Worm gear behuizing */}
          <rect x="60" y="80" width="80" height="55" rx="3" stroke="currentColor" strokeWidth="1.5" />
          {/* Worm tandwiel schematisch */}
          {[85,93,101,109,117,125].map(x => (
            <line key={x} x1={x} y1="80" x2={x} y2="135" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          ))}
          {/* Sector as */}
          <line x1="100" y1="135" x2="100" y2="170" stroke="currentColor" strokeWidth="3" />
          {/* Pitman arm */}
          <line x1="100" y1="155" x2="145" y2="178" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="148" cy="180" r="6" stroke="currentColor" strokeWidth="1.5" />
          {/* Stuur uiteinden */}
          <circle cx="100" cy="20" r="25" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" />
          {/* Detail lijnen */}
          <line x1="60" y1="107" x2="45" y2="107" stroke="currentColor" strokeWidth="1.5" />
          <line x1="140" y1="107" x2="155" y2="107" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="45" cy="107" r="5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="155" cy="107" r="5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )

    // ── Cilinderkop — cross-section met kleppen ──────────────────────────────
    case 'gereviseerde-cilinderkoppen':
      return (
        <svg {...props}>
          {/* Hoofd blok */}
          <rect x="30" y="70" width="140" height="80" stroke="currentColor" strokeWidth="1.5" />
          {/* Verbrandingskamer curve */}
          <path d="M50 70 Q70 45 100 42 Q130 45 150 70" stroke="currentColor" strokeWidth="1.5" fill="none" />
          {/* 4 cilinders */}
          {[50,80,110,140].map(x => (
            <g key={x}>
              <ellipse cx={x} cy="70" rx="12" ry="6" stroke="currentColor" strokeWidth="1" />
              <line x1={x} y1="64" x2={x} y2="150" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 3" />
            </g>
          ))}
          {/* Kleppen */}
          {[44,56,74,86,104,116,134,146].map((x,i) => (
            <g key={x}>
              <line x1={x} y1="70" x2={x} y2="90" stroke="currentColor" strokeWidth="1.5" />
              <line x1={x-5} y1={i%2===0?70:90} x2={x+5} y2={i%2===0?70:90} stroke="currentColor" strokeWidth="2" />
            </g>
          ))}
          {/* Nokkenas */}
          <line x1="30" y1="55" x2="170" y2="55" stroke="currentColor" strokeWidth="2" />
          {[50,80,110,140].map(x => (
            <ellipse key={x} cx={x} cy="55" rx="7" ry="9" stroke="currentColor" strokeWidth="1" />
          ))}
          {/* Boutgaten */}
          {[38,95,105,162].map(x => (
            <circle key={x} cx={x} cy="150" r="4" stroke="currentColor" strokeWidth="1.5" />
          ))}
        </svg>
      )

    // ── Onderdelen — lager doorsnede + bout ─────────────────────────────────
    case 'onderdelen':
      return (
        <svg {...props}>
          {/* Kogellager — groot centraal */}
          <circle cx="100" cy="95" r="55" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="95" r="40" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="95" r="22" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="95" r="8" stroke="currentColor" strokeWidth="1.5" />
          {/* Kogels */}
          {[0,51.4,102.8,154.2,205.6,257,308.4].map(a => {
            const rad = (a * Math.PI) / 180
            const cx = 100 + 31 * Math.cos(rad); const cy = 95 + 31 * Math.sin(rad)
            return <circle key={a} cx={cx} cy={cy} r="5" stroke="currentColor" strokeWidth="1.2" />
          })}
          {/* Bout rechtsboven */}
          <rect x="148" y="30" width="14" height="50" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="144" y="28" width="22" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
          {[35,42,49,56,63,70].map(y => (
            <line key={y} x1="148" y1={y} x2="162" y2={y} stroke="currentColor" strokeWidth="0.8" />
          ))}
          {/* O-ring */}
          <circle cx="40" cy="155" r="18" stroke="currentColor" strokeWidth="2" />
          <circle cx="40" cy="155" r="12" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
          {/* Pakking */}
          <rect x="130" y="145" width="40" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="135" y="150" width="30" height="18" rx="1" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
        </svg>
      )

    // ── Sper/lock differentieel ──────────────────────────────────────────────
    case 'sper-en-lock-differentielen':
      return (
        <svg {...props}>
          {/* Differentieel behuizing */}
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="44" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
          {/* Tandwiel tanden buitenring */}
          {[0,24,48,72,96,120,144,168,192,216,240,264,288,312,336].map(a => {
            const rad = (a * Math.PI) / 180
            return <line key={a} x1={100+60*Math.cos(rad)} y1={100+60*Math.sin(rad)} x2={100+68*Math.cos(rad)} y2={100+68*Math.sin(rad)} stroke="currentColor" strokeWidth="3.5" strokeLinecap="square" />
          })}
          {/* Lock pins — 4 stuks */}
          {[[100,56],[144,100],[100,144],[56,100]].map(([cx,cy],i) => (
            <g key={i}>
              <rect x={cx-5} y={cy-10} width="10" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" transform={`rotate(${i*90} ${cx} ${cy})`} />
              <circle cx={cx} cy={cy} r="3" fill="currentColor" />
            </g>
          ))}
          {/* Lock mechanisme ring */}
          <circle cx="100" cy="100" r="20" stroke="currentColor" strokeWidth="2" />
          {/* ARB label */}
          <text x="100" y="103" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontFamily="monospace" fontWeight="bold">LOCK</text>
          {/* Assen */}
          <line x1="20" y1="100" x2="40" y2="100" stroke="currentColor" strokeWidth="3" />
          <line x1="160" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="3" />
          {/* Air line (voor ARB) */}
          <path d="M100 40 Q130 20 155 35" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" fill="none" />
          <circle cx="155" cy="35" r="4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )

    // ── Accessoires — moersleutel + gereedschap ──────────────────────────────
    default:
      return (
        <svg {...props}>
          {/* Moersleutel */}
          <path d="M40 160 L80 120 L90 105 Q95 90 110 85 Q130 78 145 88 Q160 98 158 118 Q156 135 142 142 Q128 150 112 145 L98 138 L55 175 Z"
            stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="130" cy="112" r="18" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
          <circle cx="130" cy="112" r="9" stroke="currentColor" strokeWidth="1.5" />
          {/* Ringsleutel */}
          <circle cx="65" cy="55" r="28" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="65" cy="55" r="18" stroke="currentColor" strokeWidth="1" />
          {[0,60,120,180,240,300].map(a => {
            const rad=(a*Math.PI)/180
            return <line key={a} x1={65+18*Math.cos(rad)} y1={55+18*Math.sin(rad)} x2={65+28*Math.cos(rad)} y2={55+28*Math.sin(rad)} stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
          })}
          <line x1="65" y1="83" x2="65" y2="120" stroke="currentColor" strokeWidth="4" />
          {/* Schroevendraaier */}
          <line x1="150" y1="30" x2="170" y2="170" stroke="currentColor" strokeWidth="2.5" />
          <line x1="145" y1="30" x2="175" y2="30" stroke="currentColor" strokeWidth="4" />
          <line x1="162" y1="160" x2="175" y2="175" stroke="currentColor" strokeWidth="2" />
          <line x1="162" y1="175" x2="175" y2="160" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
  }
}
