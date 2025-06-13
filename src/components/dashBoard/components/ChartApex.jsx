import { PALETA } from "../utils/colors"
import ReactApexChart from "react-apexcharts"

export default function ChartApex({ chartOptions, chartData, tipoGrafico, esMeta }) {
  return (
    <div
      className="rounded-xl shadow-lg border p-6 mb-6"
      style={{
        backgroundColor: PALETA.grisClaro,
        borderColor: PALETA.gris,
      }}
    >
      {chartData && chartOptions ? (
        <div className="h-[500px]">
          <ReactApexChart
            options={chartOptions}
            series={chartData}
            type={tipoGrafico === "bar" && esMeta ? "line" : tipoGrafico}
            height="100%"
            width="100%"
          />
        </div>
      ) : (
        <div className="h-[500px] flex items-center justify-center">
          <p style={{ color: PALETA.gris }}>Cargando gráfico...</p>
        </div>
      )}
    </div>
  )
}
