import { PALETA } from "../utils/colors";

export default function ChartTabs({ historicos, historico, setHistorico }) {
  return (
    <div className="w-full">
      <div
        className="
          grid grid-cols-2 gap-2
          sm:flex sm:justify-center sm:space-x-3 sm:gap-0
          overflow-x-auto
          pb-2
          scrollbar-hide
        "
      >
        {historicos.map((h) => (
          <button
            key={h.value}
            onClick={() => setHistorico(h.value)}
            className={`
              px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0
              ${historico === h.value
                ? "shadow-md"
                : "hover:bg-gray-300 border border-gray-300"
              }
              w-full sm:w-auto
            `}
            style={{
              backgroundColor: historico === h.value ? "#60A5FA" : "#E5E7EB",
              color: historico === h.value ? "#fff" : "#1E293B",
              borderLeft: historico === h.value ? `4px solid ${h.color}` : "none"
            }}
          >
            <div
              className="p-1 rounded-full"
              style={{ backgroundColor: `${h.color}20` }}
            >
              {h.icon}
            </div>
            <span>{h.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
