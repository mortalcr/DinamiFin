export default function ChartTypeSelector({ tiposGraficos, tipoGrafico, setTipoGrafico }) {
  return (
    <div className="flex flex-col sm:flex-row rounded-lg border overflow-hidden gap-y-2 sm:gap-y-0 sm:gap-x-2 w-full sm:w-auto">
      {tiposGraficos.map((tipo) => (
        <button
          key={tipo.value}
          onClick={() => setTipoGrafico(tipo.value)}
          className={`w-full sm:w-auto px-3 py-2 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 transition ${
            tipoGrafico === tipo.value
              ? "bg-[#174D82] text-white shadow-md"
              : "bg-white text-[#174D82] hover:bg-[#E5EAF2]"
          }`}
          style={{ borderRadius: 8 }}
        >
          {tipo.icon}
          <span>{tipo.label}</span>
        </button>
      ))}
    </div>
  );
}
