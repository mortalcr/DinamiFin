import { PALETA } from "../utils/colors"

export default function ChartDescription({ historicoActual }) {
  return (
    <div
      className="rounded-lg p-4 mb-6 border"
      style={{
        backgroundColor: `${PALETA.grisClaro}CC`, 
        borderColor: `${PALETA.gris}33`            
      }}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full" style={{ backgroundColor: "#fff" }}>
          {historicoActual?.icon}
        </div>
        <div>
          <h3 className="font-medium" style={{ color: PALETA.azul }}>
            {historicoActual?.label}
          </h3>
          <p className="text-sm" style={{ color: PALETA.gris }}>
            {historicoActual?.description}
          </p>
        </div>
      </div>
    </div>
  )
}
