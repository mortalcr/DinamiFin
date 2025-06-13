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
  const fechas = []

  for (let i = cantidadMeses - 1; i >= 0; i--) {
    const fecha = new Date(fechaActual)
    fecha.setMonth(fechaActual.getMonth() - i)
    const mes = fecha.toLocaleString("default", { month: "short" })
    const año = fecha.getFullYear().toString().slice(2)
    const etiquetaFecha = `${mes} ${año}`
    fechas.push(etiquetaFecha)
    const ingreso = 1000 + Math.floor(Math.random() * 500)
    const meta_gasto = 800 + Math.floor(Math.random() * 100)
    const gasto = meta_gasto - 50 + Math.floor(Math.random() * 200)
    const meta_ahorro = 200 + Math.floor(Math.random() * 50)
    const ahorro = meta_ahorro - 30 + Math.floor(Math.random() * 100)
    const meta_inversion = 150 + Math.floor(Math.random() * 50)
    const inversion = meta_inversion - 20 + Math.floor(Math.random() * 80)
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

  return { datos, fechas }
}
export default generarDatosEjemplo
