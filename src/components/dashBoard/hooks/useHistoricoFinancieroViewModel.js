import { useEffect, useState } from "react"
import {
  fetchIncomeHistory,
  fetchExpenseHistory,
  fetchSavingHistory,
  fetchInvestmentHistory,
  fetchExpenseGoalHistory,
  fetchSavingGoalHistory,
  fetchInvestmentGoalHistory,
} from "../utils/financeApi"
import { PALETA } from "../utils/colors"

export function useHistoricoFinancieroViewModel(historicos, tiposGraficos, periodo, historico, tipoGrafico, userId) {
  const [chartData, setChartData] = useState(null)
  const [chartOptions, setChartOptions] = useState(null)
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(true)

  const colores = {
    ingreso: PALETA.verde,
    gasto: PALETA.rojo,
    ahorro: PALETA.azul,
    inversion: PALETA.naranja,
    meta_gasto: PALETA.rojo,
    meta_ahorro: PALETA.azul,
    meta_inversion: PALETA.naranja,
  }

  const esMeta = historico.startsWith("meta_")
  const tipoMeta = esMeta ? historico.replace("meta_", "") : null

  useEffect(() => {
    let fetcher
    if (esMeta) {
      switch (historico) {
        case "meta_gasto": fetcher = fetchExpenseGoalHistory; break
        case "meta_ahorro": fetcher = fetchSavingGoalHistory; break
        case "meta_inversion": fetcher = fetchInvestmentGoalHistory; break
        default: break
      }
    } else {
      switch (historico) {
        case "ingreso": fetcher = fetchIncomeHistory; break
        case "gasto": fetcher = fetchExpenseHistory; break
        case "ahorro": fetcher = fetchSavingHistory; break
        case "inversion": fetcher = fetchInvestmentHistory; break
        default: break
      }
    }
    setLoading(true)
    fetcher(userId, periodo)
      .then((resp) => {
        setDatos(resp.data)
      })
      .catch(() => setDatos([]))
      .finally(() => setLoading(false))
  }, [userId, periodo, historico])

  useEffect(() => {
    if (!datos.length) {
      setChartData([])
      setChartOptions({})
      return
    }

    // Prepara datos para la gráfica
    let series = []
    let categorias = datos.map((d) => d.period)
    if (esMeta) {
      series = [
        {
          name: "Real",
          data: datos.map((d) => d.real),
        },
        {
          name: "Meta",
          data: datos.map((d) => d.goal),
        },
      ]
    } else {
      series = [
        {
          name: historico,
          data: datos.map((d) => d.total),
        },
      ]
    }

    const baseOptions = {
      chart: {
        id: "historico-financiero",
        fontFamily: "Inter, sans-serif",
        toolbar: { show: false },
        background: PALETA.grisClaro,
      },
      colors: esMeta ? [colores[tipoMeta], PALETA.gris] : [colores[historico]],
      xaxis: {
        categories: categorias,
        labels: {
          style: { colors: PALETA.azul, fontSize: "12px", fontFamily: "Inter, sans-serif" },
        },
        axisBorder: { show: true, color: PALETA.gris },
        axisTicks: { show: true, borderType: "solid", color: PALETA.gris },
      },
      yaxis: {
        labels: {
          formatter: (val) => "$" + val.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          style: { colors: PALETA.azul, fontSize: "12px", fontFamily: "Inter, sans-serif" },
        },
      },
      grid: { borderColor: PALETA.gris, strokeDashArray: 3, opacity: 0.2 },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
        markers: { width: 12, height: 12, radius: 12 },
        itemMargin: { horizontal: 10, vertical: 0 },
      },
      tooltip: {
        theme: "light",
        x: { show: true },
        y: {
          formatter: (val) => "$" + val.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          title: { formatter: (seriesName) => seriesName },
        },
        marker: { show: true },
        style: { fontSize: "12px", fontFamily: "Inter, sans-serif" },
      },
      stroke: {
        width: esMeta ? [3, 2] : 3,
        curve: "smooth",
        dashArray: esMeta ? [0, 5] : 0,
      },
      dataLabels: { enabled: false },
      markers: {
        size: 5,
        colors: esMeta ? [colores[tipoMeta], PALETA.gris] : [colores[historico]],
        strokeWidth: 0,
        hover: { size: 7 },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: { height: 300 },
            legend: { position: "bottom", horizontalAlign: "center" },
          },
        },
      ],
    }

    let specificOptions = {}
    if (tipoGrafico === "line") {
      specificOptions = { chart: { type: "line" }, fill: { opacity: 1 } }
    } else if (tipoGrafico === "area") {
      specificOptions = {
        chart: { type: "area" },
        fill: {
          opacity: 0.3,
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.5,
            opacityFrom: 0.7,
            opacityTo: 0.2,
            stops: [0, 90, 100],
            colorStops: [],
          },
        },
      }
    } else if (tipoGrafico === "bar") {
      specificOptions = {
        chart: { type: "bar" },
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: "60%",
            dataLabels: { position: "top" },
          },
        },
        fill: { opacity: 1 },
      }
      if (esMeta) {
        specificOptions.chart.type = "line"
        specificOptions.stroke = {
          width: [0, 2],
          curve: "straight",
          dashArray: [0, 5],
        }
        specificOptions.fill = { opacity: [1, 0] }
        series[0].type = "column"
        series[1].type = "line"
      }
    }

    setChartData(series)
    setChartOptions({ ...baseOptions, ...specificOptions })
  }, [datos, tipoGrafico, esMeta, tipoMeta, historico, historicos, tiposGraficos])

  return { chartData, chartOptions, datos, loading }
}
