"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Check, X, HelpCircle } from "lucide-react"

// Opciones de periodos de tiempo
const periodos = [
  { label: "1 mes", value: "1m" },
  { label: "6 meses", value: "6m" },
  { label: "1 año", value: "1y" },
  { label: "3 años", value: "3y" },
  { label: "5 años", value: "5y" },
]

// Opciones de históricos
const historicos = [
  { label: "Ingreso mensual", value: "ingreso", color: "#2ECC71" },
  { label: "Gasto mensual", value: "gasto", color: "#E74C3C" },
  { label: "Ahorro mensual", value: "ahorro", color: "#1F3B4D" },
  { label: "Inversión mensual", value: "inversion", color: "#F39C12" },
  { label: "Metas de gasto", value: "meta_gasto", color: "#E74C3C" },
  { label: "Metas de ahorro", value: "meta_ahorro", color: "#1F3B4D" },
  { label: "Metas de inversión", value: "meta_inversion", color: "#F39C12" },
]

// Opciones de tipos de gráficos
const tiposGraficos = [
  { label: "Línea", value: "linea", icon: "📈" },
  { label: "Área", value: "area", icon: "📊" },
  { label: "Barra", value: "barra", icon: "📊" },
]

// Datos de ejemplo (simulados)
const generarDatosEjemplo = (periodo) => {
  const cantidadMeses = {
    "1m": 1,
    "6m": 6,
    "1y": 12,
    "3y": 36,
    "5y": 60,
  }[periodo]

  const fechaActual = new Date()
  const datos = []

  for (let i = cantidadMeses - 1; i >= 0; i--) {
    const fecha = new Date(fechaActual)
    fecha.setMonth(fechaActual.getMonth() - i)

    const mes = fecha.toLocaleString("default", { month: "short" })
    const año = fecha.getFullYear().toString().slice(2)
    const etiquetaFecha = `${mes} ${año}`

    // Generamos datos aleatorios pero con cierta lógica
    const ingreso = 1000 + Math.floor(Math.random() * 500)
    const meta_gasto = 800 + Math.floor(Math.random() * 100)
    const gasto = meta_gasto - 50 + Math.floor(Math.random() * 200) // A veces supera la meta
    const meta_ahorro = 200 + Math.floor(Math.random() * 50)
    const ahorro = meta_ahorro - 30 + Math.floor(Math.random() * 100) // A veces supera la meta
    const meta_inversion = 150 + Math.floor(Math.random() * 50)
    const inversion = meta_inversion - 20 + Math.floor(Math.random() * 80) // A veces supera la meta

    datos.push({
      fecha: etiquetaFecha,
      ingreso,
      gasto,
      ahorro,
      inversion,
      meta_gasto,
      meta_ahorro,
      meta_inversion,
    })
  }

  return datos
}

// Configuración de colores para los gráficos
const colores = {
  ingreso: "#2ECC71",
  gasto: "#E74C3C",
  ahorro: "#1F3B4D",
  inversion: "#F39C12",
  meta_gasto: "#E74C3C",
  meta_ahorro: "#1F3B4D",
  meta_inversion: "#F39C12",
}

// Componente personalizado para el tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-[#95A5A6] rounded-lg shadow-lg">
        <p className="font-medium text-[#1F3B4D]">{label}</p>
        <div className="mt-2 space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <p className="text-sm">
                <span className="font-medium">{entry.name}: </span>
                <span className="font-bold">${entry.value.toLocaleString()}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export default function HistoricoFinanciero() {
  const [periodo, setPeriodo] = useState("1y")
  const [historico, setHistorico] = useState("ingreso")
  const [tipoGrafico, setTipoGrafico] = useState("linea")

  // Generamos datos según el periodo seleccionado
  const datos = generarDatosEjemplo(periodo)

  // Verificamos si es un histórico de meta
  const esMeta = historico.startsWith("meta_")
  const tipoMeta = esMeta ? historico.replace("meta_", "") : null

  // Calculamos el cumplimiento de metas para el último periodo
  const ultimoDato = datos[datos.length - 1]
  const cumplioMeta = esMeta && ultimoDato ? ultimoDato[tipoMeta] >= ultimoDato[historico] : false

  // Calculamos estadísticas de cumplimiento de metas
  const estadisticasMetas = esMeta
    ? datos.reduce(
        (acc, dato) => {
          if (dato[tipoMeta] >= dato[historico]) {
            acc.cumplidas++
          } else {
            acc.noCumplidas++
          }
          return acc
        },
        { cumplidas: 0, noCumplidas: 0 },
      )
    : null

  // Porcentaje de cumplimiento
  const porcentajeCumplimiento = estadisticasMetas ? Math.round((estadisticasMetas.cumplidas / datos.length) * 100) : 0

  // Función para renderizar el gráfico según el tipo seleccionado
  const renderizarGrafico = () => {
    const config = {
      data: datos,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    }

    // Configuración común para los ejes
    const ejes = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="#95A5A6" opacity={0.4} />
        <XAxis
          dataKey="fecha"
          tick={{ fill: "#1F3B4D" }}
          tickLine={{ stroke: "#95A5A6" }}
          axisLine={{ stroke: "#95A5A6" }}
        />
        <YAxis
          tick={{ fill: "#1F3B4D" }}
          tickLine={{ stroke: "#95A5A6" }}
          axisLine={{ stroke: "#95A5A6" }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: "10px" }}
          formatter={(value) => <span className="text-[#1F3B4D] font-medium">{value}</span>}
        />
      </>
    )

    // Renderizamos diferentes tipos de gráficos según la selección
    switch (tipoGrafico) {
      case "linea":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...config}>
              {ejes}
              {!esMeta ? (
                <Line
                  type="monotone"
                  dataKey={historico}
                  stroke={colores[historico]}
                  strokeWidth={3}
                  dot={{ r: 5, fill: colores[historico], strokeWidth: 1 }}
                  activeDot={{ r: 7, strokeWidth: 1 }}
                  name={historicos.find((h) => h.value === historico)?.label || historico}
                />
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey={tipoMeta}
                    stroke={colores[tipoMeta]}
                    strokeWidth={3}
                    dot={{ r: 5, fill: colores[tipoMeta], strokeWidth: 1 }}
                    activeDot={{ r: 7, strokeWidth: 1 }}
                    name={`Real ${historicos.find((h) => h.value === tipoMeta)?.label || tipoMeta}`}
                  />
                  <Line
                    type="monotone"
                    dataKey={historico}
                    stroke="#95A5A6"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#95A5A6", strokeWidth: 1 }}
                    name={`Meta ${historicos.find((h) => h.value === historico)?.label.replace("Metas de ", "") || historico}`}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...config}>
              {ejes}
              {!esMeta ? (
                <Area
                  type="monotone"
                  dataKey={historico}
                  stroke={colores[historico]}
                  fill={colores[historico]}
                  fillOpacity={0.3}
                  name={historicos.find((h) => h.value === historico)?.label || historico}
                />
              ) : (
                <>
                  <Area
                    type="monotone"
                    dataKey={tipoMeta}
                    stroke={colores[tipoMeta]}
                    fill={colores[tipoMeta]}
                    fillOpacity={0.3}
                    name={`Real ${historicos.find((h) => h.value === tipoMeta)?.label || tipoMeta}`}
                  />
                  <Line
                    type="monotone"
                    dataKey={historico}
                    stroke="#95A5A6"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#95A5A6", strokeWidth: 1 }}
                    name={`Meta ${historicos.find((h) => h.value === historico)?.label.replace("Metas de ", "") || historico}`}
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        )

      case "barra":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...config}>
              {ejes}
              {!esMeta ? (
                <Bar
                  dataKey={historico}
                  fill={colores[historico]}
                  radius={[4, 4, 0, 0]}
                  name={historicos.find((h) => h.value === historico)?.label || historico}
                />
              ) : (
                <>
                  <Bar
                    dataKey={tipoMeta}
                    fill={colores[tipoMeta]}
                    radius={[4, 4, 0, 0]}
                    name={`Real ${historicos.find((h) => h.value === tipoMeta)?.label || tipoMeta}`}
                  />
                  <Line
                    type="monotone"
                    dataKey={historico}
                    stroke="#95A5A6"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#95A5A6", strokeWidth: 1 }}
                    name={`Meta ${historicos.find((h) => h.value === historico)?.label.replace("Metas de ", "") || historico}`}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className="w-full bg-[#F2F3F4] rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-[#95A5A6]/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1F3B4D]">Histórico Financiero</h2>
            <p className="text-[#95A5A6] mt-1">Visualiza tu progreso financiero a lo largo del tiempo</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Selector de periodo */}
            <div className="relative">
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="w-full sm:w-40 px-4 py-2 bg-white border border-[#95A5A6]/30 rounded-lg text-[#1F3B4D] appearance-none focus:outline-none focus:ring-2 focus:ring-[#1F3B4D]/50"
              >
                {periodos.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-[#1F3B4D]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            {/* Selector de tipo de gráfico */}
            <div className="flex rounded-lg border border-[#95A5A6]/30 overflow-hidden">
              {tiposGraficos.map((tipo) => (
                <button
                  key={tipo.value}
                  onClick={() => setTipoGrafico(tipo.value)}
                  className={`px-4 py-2 text-sm font-medium ${
                    tipoGrafico === tipo.value
                      ? "bg-[#1F3B4D] text-white"
                      : "bg-white text-[#1F3B4D] hover:bg-[#F2F3F4]"
                  }`}
                >
                  {tipo.icon} {tipo.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs para seleccionar histórico */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {historicos.map((h) => (
              <button
                key={h.value}
                onClick={() => setHistorico(h.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  historico === h.value ? "bg-[#1F3B4D] text-white" : "bg-white text-[#1F3B4D] hover:bg-[#F2F3F4]"
                }`}
                style={{
                  borderLeft: historico === h.value ? `4px solid ${h.color}` : "none",
                }}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>

        {/* Área del gráfico con leyenda explicativa */}
        <div className="bg-white p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-[#1F3B4D]">{historicos.find((h) => h.value === historico)?.label || ""}</h3>

            {esMeta && (
              <div className="flex items-center text-sm text-[#95A5A6]">
                <HelpCircle className="w-4 h-4 mr-1" />
                <span>La línea punteada representa la meta establecida</span>
              </div>
            )}
          </div>

          {renderizarGrafico()}
        </div>

        {/* Resumen de cumplimiento de metas */}
        {esMeta && estadisticasMetas && (
          <div className="mt-6 bg-white p-6 rounded-lg border-l-4 border-[#1F3B4D]">
            <h3 className="text-lg font-bold text-[#1F3B4D] mb-4">Resumen de Cumplimiento</h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    cumplioMeta ? "bg-[#2ECC71]/20" : "bg-[#E74C3C]/20"
                  }`}
                >
                  {cumplioMeta ? (
                    <Check className="w-6 h-6 text-[#2ECC71]" />
                  ) : (
                    <X className="w-6 h-6 text-[#E74C3C]" />
                  )}
                </div>
                <div>
                  <p className={`font-bold ${cumplioMeta ? "text-[#2ECC71]" : "text-[#E74C3C]"}`}>
                    {cumplioMeta ? "Meta alcanzada" : "Meta no alcanzada"}
                  </p>
                  <p className="text-sm text-[#95A5A6]">en el último periodo</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-auto">
                <div className="bg-[#F2F3F4] p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#2ECC71]"></div>
                    <span className="text-sm text-[#1F3B4D]">Metas cumplidas</span>
                  </div>
                  <p className="text-xl font-bold text-[#1F3B4D] mt-1">{estadisticasMetas.cumplidas}</p>
                </div>

                <div className="bg-[#F2F3F4] p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#E74C3C]"></div>
                    <span className="text-sm text-[#1F3B4D]">No cumplidas</span>
                  </div>
                  <p className="text-xl font-bold text-[#1F3B4D] mt-1">{estadisticasMetas.noCumplidas}</p>
                </div>

                <div className="bg-[#F2F3F4] p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#1F3B4D]">Tasa de cumplimiento</span>
                  </div>
                  <p className="text-xl font-bold text-[#1F3B4D] mt-1">{porcentajeCumplimiento}%</p>
                </div>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="mt-6">
              <div className="w-full bg-[#F2F3F4] rounded-full h-2.5">
                <div className="bg-[#2ECC71] h-2.5 rounded-full" style={{ width: `${porcentajeCumplimiento}%` }}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-[#95A5A6]">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
