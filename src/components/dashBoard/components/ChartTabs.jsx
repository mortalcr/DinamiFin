import { PALETA } from "../utils/colors"

export default function ChartTabs({ historicos, historico, setHistorico }) {
  return (
    <div className="flex space-x-3 min-w-max">
      {historicos.map((h) => (
        <button
          key={h.value}
          onClick={() => setHistorico(h.value)}
          className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            historico === h.value
              ? "shadow-md"
              : "hover:bg-gray-300 border border-gray-300"
          }`}
          style={{
            backgroundColor: historico === h.value ? "#60A5FA" : "#E5E7EB", // azul claro y gris oscuro
            color: historico === h.value ? "#fff" : "#1E293B",
            borderLeft: historico === h.value ? `4px solid ${h.color}` : "none"
          }}
        >
          <div
            className="p-1 rounded-full"
            style={{ backgroundColor: `${h.color}20` }}
          >
            <div style={{ color: PALETA.azul }}>{h.icon}</div>
          </div>
          {h.label}
        </button>
      ))}
    </div>
  )
}