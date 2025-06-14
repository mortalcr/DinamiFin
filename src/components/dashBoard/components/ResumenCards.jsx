import { PALETA } from "../utils/colors";

export default function ResumenCards({
  esMeta,
  tipoMeta,
  historico,
  cumplioMeta,
  porcentajeCumplimiento,
  estadisticasMetas,
  datos,
  totalMetaPeriodo,
  totalHistoricoPeriodo,
  Check,
  X,
  Calendar,
  TrendingUp,
}) {
  const cols = esMeta ? "lg:grid-cols-4" : "lg:grid-cols-1";
  const valorMeta = esMeta ? totalMetaPeriodo ?? 0 : null;
  const valorHistoricoPeriodo = totalHistoricoPeriodo ?? 0;
  const nombres = {
    ingreso: "ingresos",
    gasto: "gastos",
    ahorro: "ahorros",
    inversion: "inversiones",
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-4 sm:gap-6 px-2 sm:px-4 lg:px-0 mb-6`}
    >
      <div className="bg-[#F2F3F4] rounded-xl shadow-sm border border-[#95A5A6]/60 p-4 flex flex-col justify-between min-h-[120px]">
        <div className="flex items-center justify-between">
          <span className="text-[#95A5A6] text-sm">
            {esMeta
              ? "Ingreso total"
              : `Total ${nombres[historico] || historico} del periodo`}
          </span>
        </div>
        <div className="mt-2">
          <h3
            className="text-2xl font-bold break-words mb-2"
            style={{ color: PALETA.azul }}
          >
            ${valorHistoricoPeriodo.toLocaleString()}
          </h3>
        </div>
      </div>
      {esMeta && (
        <div className="bg-[#F2F3F4] rounded-xl shadow-sm border border-[#95A5A6]/60 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[#95A5A6] text-sm">Meta</span>
            <div
              className={`p-2 rounded-full ${
                cumplioMeta ? "bg-[#2ECC71]/10" : "bg-[#E74C3C]/10"
              }`}
            >
              {cumplioMeta ? (
                <Check className="w-4 h-4" style={{ color: PALETA.verde }} />
              ) : (
                <X className="w-4 h-4" style={{ color: PALETA.rojo }} />
              )}
            </div>
          </div>
          <div className="mt-2">
            <h3
              className="text-2xl font-bold break-words"
              style={{ color: PALETA.azul }}
            >
              ${valorMeta.toLocaleString()}
            </h3>
            <p
              className={`text-sm ${
                cumplioMeta ? "text-[#2ECC71]" : "text-[#E74C3C]"
              }`}
            >
              {cumplioMeta ? "Meta cumplida" : "Meta no alcanzada"}
            </p>
          </div>
        </div>
      )}
      {esMeta && (
        <div className="bg-[#F2F3F4] rounded-xl shadow-sm border border-[#95A5A6]/60 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[#95A5A6] text-sm">Tasa de cumplimiento</span>
            <div className="p-2 rounded-full bg-[#1F3B4D]/10">
              <TrendingUp className="w-4 h-4" style={{ color: PALETA.azul }} />
            </div>
          </div>
          <div className="mt-2">
            <h3
              className="text-2xl font-bold break-words"
              style={{ color: PALETA.azul }}
            >
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
      )}
      {esMeta && (
        <div className="bg-[#F2F3F4] rounded-xl shadow-sm border border-[#95A5A6]/60 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[#95A5A6] text-sm">Periodos cumplidos</span>
            <div className="p-2 rounded-full bg-[#F39C12]/10">
              <Calendar className="w-4 h-4" style={{ color: PALETA.naranja }} />
            </div>
          </div>
          <div className="mt-2">
            <h3
              className="text-2xl font-bold break-words"
              style={{ color: PALETA.azul }}
            >
              {estadisticasMetas?.cumplidas || 0}/{datos.length}
            </h3>
            <p className="text-sm" style={{ color: PALETA.gris }}>
              periodos analizados
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
