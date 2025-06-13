import { useState, useMemo } from "react"
import ChartTabs from "./components/ChartTabs"
import ChartTypeSelector from "./components/ChartTypeSelector"
import ResumenCards from "./components/ResumenCards"
import ChartDescription from "./components/ChartDescription"
import ChartApex from "./components/ChartApex"
import { useHistoricoFinancieroViewModel } from "./hooks/useHistoricoFinancieroViewModel"
import generarDatosEjemplo from "./utils/generarDatosEjemplo"
import { PALETA } from "./utils/colors"
import {
  ArrowUpRight, ArrowDownRight, TrendingUp, Calendar,
  BarChart3, LineChart, PieChart, Check, X,
} from "lucide-react"

// --- Paleta aplicada aquí --- //
const periodos = [
  { label: "1 mes", value: "1m", days: 30 },
  { label: "6 meses", value: "6m", days: 180 },
  { label: "1 año", value: "1y", days: 365 },
  { label: "3 años", value: "3y", days: 1095 },
  { label: "5 años", value: "5y", days: 1825 },
]

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
]

const tiposGraficos = [
  { label: "Línea", value: "line", icon: <LineChart className="w-4 h-4" /> },
  { label: "Área", value: "area", icon: <LineChart className="w-4 h-4" /> },
  { label: "Barra", value: "bar", icon: <BarChart3 className="w-4 h-4" /> },
]

export default function HistoricoFinanciero() {
  const [periodo, setPeriodo] = useState("1y")
  const [historico, setHistorico] = useState("ingreso")
  const [tipoGrafico, setTipoGrafico] = useState("line")

  // Datos generados y cálculo de estados
  const { datos } = useMemo(() => generarDatosEjemplo(periodo), [periodo])
  const esMeta = historico.startsWith("meta_")
  const tipoMeta = esMeta ? historico.replace("meta_", "") : null
  const historicoActual = historicos.find((h) => h.value === historico)
  const ultimoDato = datos[datos.length - 1] || {}

  // Estadísticas de metas
  const estadisticasMetas = useMemo(() => esMeta
    ? datos.reduce(
        (acc, dato) => {
          if (dato[tipoMeta] >= dato[historico]) acc.cumplidas++
          else acc.noCumplidas++
          return acc
        },
        { cumplidas: 0, noCumplidas: 0 }
      )
    : null, [datos, esMeta, tipoMeta, historico])

  const cumplioMeta = esMeta && ultimoDato ? ultimoDato[tipoMeta] >= ultimoDato[historico] : false
  const porcentajeCumplimiento = estadisticasMetas ? Math.round((estadisticasMetas.cumplidas / datos.length) * 100) : 0

  // Tendencia respecto al periodo anterior
  const tendencia = useMemo(() => {
    if (datos.length < 2) return { valor: 0, positiva: true }
    const actual = ultimoDato[esMeta ? tipoMeta : historico]
    const anterior = datos[datos.length - 2][esMeta ? tipoMeta : historico]
    const diferencia = actual - anterior
    const porcentaje = anterior !== 0 ? (diferencia / anterior) * 100 : 0
    return { valor: Math.abs(porcentaje).toFixed(1), positiva: diferencia >= 0 }
  }, [datos, ultimoDato, esMeta, tipoMeta, historico])

  // ViewModel del gráfico
  const { chartData, chartOptions } = useHistoricoFinancieroViewModel(
    historicos,
    tiposGraficos,
    periodo,
    historico,
    tipoGrafico
  )

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: PALETA.grisClaro }}>
    {/* Header y filtros */}
    <div
      className="fixed top-0 left-0 right-0 z-20 border-b shadow-sm w-full"
      style={{
        backgroundColor: "#fff",
        borderColor: PALETA.gris + "33", // 20% opacity
      }}
    >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-8 py-4 w-full">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: PALETA.azul }}>Histórico Financiero</h1>
            <p className="mt-1" style={{ color: PALETA.gris }}>
              Visualiza y analiza tu progreso financiero a lo largo del tiempo
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Selector de periodo */}
            <div className="relative">
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="w-full min-w-[140px] px-4 py-2 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2"
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
            {/* Selector de tipo de gráfico */}
            <ChartTypeSelector
              tiposGraficos={tiposGraficos}
              tipoGrafico={tipoGrafico}
              setTipoGrafico={setTipoGrafico}
            />
          </div>
        </div>
      </div>
      {/* Contenido principal a todo el ancho */}
      <div className="w-full px-0 py-6" style={{ paddingTop: "120px" }}>
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
        />
        {/* Tabs de históricos */}
        <div className="mb-6 overflow-x-auto scrollbar-hide px-8">
          <ChartTabs historicos={historicos} historico={historico} setHistorico={setHistorico} />
        </div>
        {/* Descripción del gráfico */}
        <div className="px-8">
          <ChartDescription historicoActual={historicoActual} />
        </div>
        {/* Gráfico */}
        <div className="px-8">
          <ChartApex
            chartOptions={chartOptions}
            chartData={chartData}
            tipoGrafico={tipoGrafico}
            esMeta={esMeta}
          />
        </div>
      </div>
    </div>
  )
}
