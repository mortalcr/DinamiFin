import { PALETA } from "../utils/colors"
import ReactApexChart from "react-apexcharts"
import { useEffect, useState } from "react"

export default function ChartApex({ chartOptions, chartData, tipoGrafico, esMeta }) {
  const [chartHeight, setChartHeight] = useState(500);
  
  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 640) {
        setChartHeight(300);
      } else if (window.innerWidth < 1024) {
        setChartHeight(400);
      } else {
        setChartHeight(500);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div
      className="rounded-xl shadow-lg border p-3 sm:p-6 mb-6"
      style={{
        backgroundColor: PALETA.grisClaro,
        borderColor: PALETA.gris,
      }}
    >
      {chartData && chartOptions ? (
        <div className="h-[300px] sm:h-[400px] lg:h-[500px]">
          <ReactApexChart
            options={chartOptions}
            series={chartData}
            type={tipoGrafico === "bar" && esMeta ? "line" : tipoGrafico}
            height="100%"
            width="100%"
          />
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center">
          <p style={{ color: PALETA.gris }}>Cargando gráfico...</p>
        </div>
      )}
    </div>
  );
}