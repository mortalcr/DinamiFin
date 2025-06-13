import { PALETA } from "../utils/colors"

export default function ResumenCards({
  esMeta,
  tipoMeta,
  historico,
  tendencia,
  ultimoDato,
  cumplioMeta,
  porcentajeCumplimiento,
  estadisticasMetas,
  datos,
  Check,
  X,
  Calendar,
  TrendingUp,
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${esMeta ? "4" : "1"} gap-5 mb-6`}>
      {/* Tarjeta principal */}
      <div className="bg-[#F2F3F4] rounded-xl shadow-sm border border-[#95A5A6]/60 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[#95A5A6] text-sm">
            Último {esMeta ? tipoMeta : historico}
          </span>
          <div className={`p-2 rounded-full ${tendencia.positiva ? "bg-[#2ECC71]/10" : "bg-[#E74C3C]/10"}`}>
            {tendencia.positiva ? (
              <Check className="w-4 h-4" style={{ color: PALETA.verde }} />
            ) : (
              <X className="w-4 h-4" style={{ color: PALETA.rojo }} />
            )}
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-bold" style={{ color: PALETA.azul }}>
            ${ultimoDato[esMeta ? tipoMeta : historico]?.toLocaleString()}
          </h3>
          <p className={`text-sm ${tendencia.positiva ? "text-[#2ECC71]" : "text-[#E74C3C]"}`}>
            {tendencia.positiva ? "+" : "-"}
            {tendencia.valor}% vs periodo anterior
          </p>
        </div>
      </div>
      {esMeta && (
        <>
          {/* Meta actual */}
          <div className="bg-[#F2F3F4] rounded-xl shadow-sm border border-[#95A5A6]/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[#95A5A6] text-sm">Meta actual</span>
              <div className={`p-2 rounded-full ${cumplioMeta ? "bg-[#2ECC71]/10" : "bg-[#E74C3C]/10"}`}>
                {cumplioMeta ? (
                  <Check className="w-4 h-4" style={{ color: PALETA.verde }} />
                ) : (
                  <X className="w-4 h-4" style={{ color: PALETA.rojo }} />
                )}
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold" style={{ color: PALETA.azul }}>
                ${ultimoDato[historico]?.toLocaleString()}
              </h3>
              <p className={`text-sm ${cumplioMeta ? "text-[#2ECC71]" : "text-[#E74C3C]"}`}>
                {cumplioMeta ? "Meta cumplida" : "Meta no alcanzada"}
              </p>
            </div>
          </div>
          {/* Tasa de cumplimiento */}
          <div className="bg-[#F2F3F4] rounded-xl shadow-sm border border-[#95A5A6]/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[#95A5A6] text-sm">Tasa de cumplimiento</span>
              <div className="p-2 rounded-full bg-[#1F3B4D]/10">
                <TrendingUp className="w-4 h-4" style={{ color: PALETA.azul }} />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold" style={{ color: PALETA.azul }}>
                {porcentajeCumplimiento}%
              </h3>
              <div className="w-full bg-[#95A5A6]/20 rounded-full h-1.5 mt-2">
                <div
                  className={`h-1.5 rounded-full ${
                    porcentajeCumplimiento >= 75
                      ? "bg-[#2ECC71]"
                      : porcentajeCumplimiento >= 50
                        ? "bg-[#F39C12]"
                        : "bg-[#E74C3C]"
                  }`}
                  style={{ width: `${porcentajeCumplimiento}%` }}
                ></div>
              </div>
            </div>
          </div>
          {/* Periodos cumplidos */}
          <div className="bg-[#F2F3F4] rounded-xl shadow-sm border border-[#95A5A6]/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[#95A5A6] text-sm">Periodos cumplidos</span>
              <div className="p-2 rounded-full bg-[#F39C12]/10">
                <Calendar className="w-4 h-4" style={{ color: PALETA.naranja }} />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold" style={{ color: PALETA.azul }}>
                {estadisticasMetas?.cumplidas || 0}/{datos.length}
              </h3>
              <p className="text-sm" style={{ color: PALETA.gris }}>periodos analizados</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
