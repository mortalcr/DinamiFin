export default function ChartTypeSelector({ tiposGraficos, tipoGrafico, setTipoGrafico }) {
  return (
    <div className="flex rounded-lg border overflow-hidden gap-x-2 ">
      {tiposGraficos.map((tipo) => (
        <button
          key={tipo.value}
          onClick={() => setTipoGrafico(tipo.value)}
          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition ${
            tipoGrafico === tipo.value
              ? "bg-[#174D82] text-white shadow-md"
              : "bg-white text-[#174D82] hover:bg-[#E5EAF2]"
          }`}
          style={{ borderRadius: 8 }}
        >
          {tipo.icon}
          <span className="hidden sm:inline">{tipo.label}</span>
        </button>
      ))}
    </div>
  )
}
