import { useState, useEffect } from "react";
import {
  fetchIncomeHistory,
  fetchExpenseHistory,
  fetchSavingHistory,
  fetchInvestmentHistory,
  fetchExpenseGoalHistory,
  fetchSavingGoalHistory,
  fetchInvestmentGoalHistory,
} from "../../../services/financeHistoryApi";
import { PALETA } from "../utils/colors";

export function useHistoricoFinancieroViewModel(
  historicos,
  tiposGraficos,
  periodo,
  historico,
  tipoGrafico,
  userId
) {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  const colores = {
    ingreso: PALETA.verde,
    gasto: PALETA.rojo,
    ahorro: PALETA.azul,
    inversion: PALETA.naranja,
    meta_gasto: PALETA.rojo,
    meta_ahorro: PALETA.azul,
    meta_inversion: PALETA.naranja,
  };

  const esMeta = historico.startsWith("meta_");
  const tipoMeta = esMeta ? historico.replace("meta_", "") : null;

  useEffect(() => {
    let fetcher = null;
    if (esMeta) {
      switch (historico) {
        case "meta_gasto":
          fetcher = fetchExpenseGoalHistory;
          break;
        case "meta_ahorro":
          fetcher = fetchSavingGoalHistory;
          break;
        case "meta_inversion":
          fetcher = fetchInvestmentGoalHistory;
          break;
        default:
          break;
      }
    } else {
      switch (historico) {
        case "ingreso":
          fetcher = fetchIncomeHistory;
          break;
        case "gasto":
          fetcher = fetchExpenseHistory;
          break;
        case "ahorro":
          fetcher = fetchSavingHistory;
          break;
        case "inversion":
          fetcher = fetchInvestmentHistory;
          break;
        default:
          break;
      }
    }
    setLoading(true);
    if (userId && fetcher) {
      fetcher(userId, periodo)
        .then((resp) => setDatos(resp.data))
        .catch(() => setDatos([]))
        .finally(() => setLoading(false));
    } else {
      setDatos([]);
      setLoading(false);
    }
  }, [userId, periodo, historico, esMeta]);
  
  useEffect(() => {
    if (!datos.length) {
      setChartData([]);
      setChartOptions({});
      return;
    }
    let series = [];
    const meses = [...new Set(datos.map((d) => d.period))].sort();

    if (esMeta) {
      // Cálculo de porcentaje real respecto al ingreso mensual
      const realPercent = datos.map((d) =>
        d.income > 0 ? (d.real / d.income) * 100 : 0
      );
      const goalPercent = datos.map((d) => d.goal ?? 0);
      series = [
        { name: "Real (%)", data: realPercent },
        { name: "Meta (%)", data: goalPercent },
      ];
    } else {
      series = [{ name: historico, data: datos.map((d) => d.total ?? 0) }];
    }
    const valueFormatter = esMeta
      ? (val) => val.toFixed(1) + " %"
      : (val) => "$" + val.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    const baseOptions = {
      chart: {
        id: "historico-financiero",
        fontFamily: "Inter, sans-serif",
        toolbar: { show: false },
        zoom: { enabled: false },
        background: PALETA.grisClaro,
      },
      colors: esMeta ? [colores[tipoMeta], PALETA.gris] : [colores[historico]],
      xaxis: {
        categories: meses,
        labels: {
          style: {
            colors: PALETA.azul,
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          },
        },
        axisBorder: { show: true, color: PALETA.gris },
        axisTicks: { show: true, borderType: "solid", color: PALETA.gris },
      },
      yaxis: {
        labels: {
          formatter: valueFormatter,
          style: {
            colors: PALETA.azul,
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          },
        },
        min: 0,
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
        theme: "dark",
        x: { show: true },
        y: {
          formatter: valueFormatter,
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
        colors: esMeta
          ? [colores[tipoMeta], PALETA.gris]
          : [colores[historico]],
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
    };

    let specificOptions = {};
    if (tipoGrafico === "line") {
      specificOptions = { chart: { type: "line" }, fill: { opacity: 1 } };
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
      };
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
      };
      if (esMeta) {
        specificOptions.chart.type = "line";
        specificOptions.stroke = {
          width: [0, 2],
          curve: "straight",
          dashArray: [0, 5],
        };
        specificOptions.fill = { opacity: [1, 0] };
        series[0].type = "column";
        series[1].type = "line";
      }
    }

    setChartData(series);
    setChartOptions({
      ...baseOptions,
      ...specificOptions,
      chart: {
        ...baseOptions.chart,
        ...specificOptions.chart,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      tooltip: { enabled: true },
    });
  }, 
  
  
  [
    datos,
    tipoGrafico,
    esMeta,
    tipoMeta,
    historico,
    historicos,
    tiposGraficos,
  ]);
  const totalMetaPeriodo = esMeta
    ? datos.reduce(
        (sum, d) => sum + (d.income > 0 ? (d.income * (d.goal ?? 0) / 100) : 0),
        0
      )
    : null;
  const totalHistoricoPeriodo = esMeta
  ? datos.reduce((sum, d) => sum + (d.real ?? 0), 0)
  : datos.reduce((sum, d) => sum + (d.total ?? 0), 0)


  return { chartData, chartOptions, datos, loading, totalMetaPeriodo, totalHistoricoPeriodo };
}

export default useHistoricoFinancieroViewModel;
