import { useState, useMemo } from "react";
import ChartTabs from "./components/ChartTabs";
import ChartTypeSelector from "./components/ChartTypeSelector";
import ResumenCards from "./components/ResumenCards";
import ChartDescription from "./components/ChartDescription";
import ChartApex from "./components/ChartApex";
import { useHistoricoFinancieroViewModel } from "./hooks/useHistoricoFinancieroViewModel";
import { PALETA } from "./utils/colors";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
  Check,
  X,
  Menu,
} from "lucide-react";
import { useUser } from "../../context/UserContext";
const periodos = [
  { label: "1 mes", value: "1m", days: 30 },
  { label: "6 meses", value: "6m", days: 180 },
  { label: "1 año", value: "1y", days: 365 },
  { label: "3 años", value: "3y", days: 1095 },
  { label: "5 años", value: "5y", days: 1825 },
];
const historicos = [
  {
    label: "Ingreso mensual",
    value: "ingreso",
    color: PALETA.verde,
    icon: <ArrowUpRight className="w-5 h-5" />,
    description: "Total de ingresos recibidos mensualmente",
  },
  {
    label: "Gasto mensual",
    value: "gasto",
    color: PALETA.rojo,
    icon: <ArrowDownRight className="w-5 h-5" />,
    description: "Total de gastos realizados mensualmente",
  },
  {
    label: "Ahorro mensual",
    value: "ahorro",
    color: PALETA.azul,
    icon: <TrendingUp className="w-5 h-5" />,
    description: "Total ahorrado mensualmente",
  },
  {
    label: "Inversión mensual",
    value: "inversion",
    color: PALETA.naranja,
    icon: <PieChart className="w-5 h-5" />,
    description: "Total invertido mensualmente",
  },
  {
    label: "Metas de gasto",
    value: "meta_gasto",
    color: PALETA.rojo,
    icon: <BarChart3 className="w-5 h-5" />,
    description: "Comparación entre gastos reales y metas establecidas",
  },
  {
    label: "Metas de ahorro",
    value: "meta_ahorro",
    color: PALETA.azul,
    icon: <BarChart3 className="w-5 h-5" />,
    description: "Comparación entre ahorros reales y metas establecidas",
  },
  {
    label: "Metas de inversión",
    value: "meta_inversion",
    color: PALETA.naranja,
    icon: <BarChart3 className="w-5 h-5" />,
    description: "Comparación entre inversiones reales y metas establecidas",
  },
];
const tiposGraficos = [
  { label: "Línea", value: "line", icon: <LineChart className="w-4 h-4" /> },
  { label: "Área", value: "area", icon: <LineChart className="w-4 h-4" /> },
  { label: "Barra", value: "bar", icon: <BarChart3 className="w-4 h-4" /> },
];
export default function HistoricoFinanciero() {
  const [periodo, setPeriodo] = useState("1y");
  const [historico, setHistorico] = useState("ingreso");
  const [tipoGrafico, setTipoGrafico] = useState("line");
  const { user } = useUser();
  const userId = user?.id;
  const {
    chartData,
    chartOptions,
    datos,
    totalMetaPeriodo,
    totalHistoricoPeriodo,
  } = useHistoricoFinancieroViewModel(
    historicos,
    tiposGraficos,
    periodo,
    historico,
    tipoGrafico,
    userId
  );
  const esMeta = historico.startsWith("meta_");
  const tipoMeta = esMeta ? historico.replace("meta_", "") : null;
  const historicoActual = historicos.find((h) => h.value === historico);
  const ultimoDato = datos[datos.length - 1] || {};
  const esMetaGasto = historico === "meta_gasto";
  const estadisticasMetas = useMemo(
    () =>
      esMeta
        ? datos.reduce(
            (acc, dato) => {
              if (esMetaGasto) {
                if ((dato.real ?? 0) <= (dato.goal ?? 0)) acc.cumplidas++;
                else acc.noCumplidas++;
              } else {
                if ((dato.real ?? 0) >= (dato.goal ?? 0)) acc.cumplidas++;
                else acc.noCumplidas++;
              }
              return acc;
            },
            { cumplidas: 0, noCumplidas: 0 }
          )
        : null,
    [datos, esMeta, esMetaGasto]
  );
  const cumplioMeta =
    esMeta && ultimoDato
      ? esMetaGasto
        ? (ultimoDato.real ?? 0) <= (ultimoDato.goal ?? 0)
        : (ultimoDato.real ?? 0) >= (ultimoDato.goal ?? 0)
      : false;

  const porcentajeCumplimiento =
    estadisticasMetas && datos.length > 0
      ? Math.round((estadisticasMetas.cumplidas / datos.length) * 100)
      : 0;
  const tendencia = useMemo(() => {
    if (datos.length < 2) return { valor: 0, positiva: true };
    let actual, anterior;
    if (esMeta) {
      actual = datos[datos.length - 1].real ?? 0;
      anterior = datos[datos.length - 2].real ?? 0;
    } else {
      actual = datos[datos.length - 1].total ?? 0;
      anterior = datos[datos.length - 2].total ?? 0;
    }
    if (typeof actual !== "number" || typeof anterior !== "number") {
      return { valor: 0, positiva: true };
    }
    const diferencia = actual - anterior;
    const porcentaje = anterior !== 0 ? (diferencia / anterior) * 100 : 0;
    return {
      valor: Math.abs(porcentaje).toFixed(1),
      positiva: diferencia >= 0,
    };
  }, [datos, esMeta]);
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      <div className="border-b shadow-sm bg-white w-full mb-4 lg:mt-18 mt-21">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-2 sm:px-6 w-full py-3">
          <div className="flex flex-col justify-center min-w-0">
            <h1
              className="text-xl sm:text-3xl font-bold truncate"
              style={{ color: PALETA.azul }}
            >
              Histórico Financiero
            </h1>
            <p
              className="mt-1 text-xs sm:text-sm text-[#345] truncate"
              style={{ color: PALETA.gris }}
            >
              Visualiza y analiza tu progreso financiero a lo largo del tiempo
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-0 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto max-w-full sm:max-w-[260px] min-w-[160px]">
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="w-full px-4 py-2 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2"
                style={{
                  borderColor: PALETA.gris,
                  color: PALETA.azul,
                  boxShadow: "none",
                }}
              >
                {periodos.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Calendar className="w-4 h-4" style={{ color: PALETA.azul }} />
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <ChartTypeSelector
                tiposGraficos={tiposGraficos}
                tipoGrafico={tipoGrafico}
                setTipoGrafico={setTipoGrafico}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-2 sm:px-4 py-4">
        <ResumenCards
          esMeta={esMeta}
          tipoMeta={tipoMeta}
          historico={historico}
          tendencia={tendencia}
          ultimoDato={ultimoDato}
          cumplioMeta={cumplioMeta}
          porcentajeCumplimiento={porcentajeCumplimiento}
          estadisticasMetas={estadisticasMetas}
          datos={datos}
          Check={Check}
          X={X}
          Calendar={Calendar}
          TrendingUp={TrendingUp}
          totalMetaPeriodo={totalMetaPeriodo}
          totalHistoricoPeriodo={totalHistoricoPeriodo}
        />
        <div className="mb-6 overflow-x-auto scrollbar-hide px-0 sm:px-0">
          <ChartTabs
            historicos={historicos}
            historico={historico}
            setHistorico={setHistorico}
          />
        </div>
        <div className="px-0 sm:px-0">
          <ChartDescription historicoActual={historicoActual} />
        </div>
        <div className="px-0 sm:px-0">
          <ChartApex
            chartOptions={chartOptions}
            chartData={chartData}
            tipoGrafico={tipoGrafico}
            esMeta={esMeta}
          />
        </div>
      </div>
    </div>
  );
}
