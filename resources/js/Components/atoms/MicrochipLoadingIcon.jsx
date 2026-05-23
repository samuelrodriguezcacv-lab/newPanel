const GREEN = "rgb(22, 163, 74)";
const LIME = "rgb(167, 243, 20)";

export default function MicrochipLoadingIcon({
    size = 22,
    label = "Cargando",
    className = "",
    showLabel = false,
}) {
    return (
        <span
            className={`inline-flex items-center justify-center gap-2 align-middle ${className}`}
            role="status"
            aria-live="polite"
            aria-label={label}
        >
            <style>{`
                @keyframes microchipIconSpin {
                    to { transform: rotate(360deg); }
                }
                @keyframes microchipIconFloat {
                    0%, 100% { transform: translateY(0) rotate(-35deg); }
                    50% { transform: translateY(-1px) rotate(-35deg); }
                }
                .microchip-icon-ring {
                    transform-origin: 16px 16px;
                    animation: microchipIconSpin 1.15s linear infinite;
                }
                .microchip-icon-syringe {
                    transform-origin: 16px 16px;
                    animation: microchipIconFloat 1.4s ease-in-out infinite;
                }
            `}</style>
            <svg
                width={size}
                height={size}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <circle cx="16" cy="16" r="13" stroke="rgb(187, 247, 208)" strokeWidth="2" />
                <path
                    className="microchip-icon-ring"
                    d="M16 3a13 13 0 0 1 12.4 9.1"
                    stroke={GREEN}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <path
                    className="microchip-icon-ring"
                    d="M16 7a9 9 0 0 0-8.4 5.8"
                    stroke={LIME}
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ animationDirection: "reverse", animationDuration: "1.7s" }}
                />
                <g className="microchip-icon-syringe">
                    <rect x="14" y="9" width="4" height="12" rx="1.5" fill="#f8fafc" stroke={GREEN} strokeWidth="1" />
                    <rect x="13" y="8" width="6" height="2" rx="1" fill={LIME} />
                    <rect x="15" y="4" width="2" height="5" rx="1" fill="#94a3b8" />
                    <circle cx="16" cy="4" r="2.5" fill="#f0fdf4" stroke={GREEN} strokeWidth="1.5" />
                    <rect x="13" y="20" width="6" height="2" rx="1" fill={LIME} />
                    <path d="M16 22v5" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" />
                </g>
            </svg>
            {showLabel && <span>{label}</span>}
            <span className="sr-only">{label}</span>
        </span>
    );
}
