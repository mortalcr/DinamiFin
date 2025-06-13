import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaWallet, FaPiggyBank, FaChartLine, FaDollarSign, FaCheck, FaTimes } from "react-icons/fa";
// Aquí luego conectarás los servicios de API
// import { getMesActual } from "../services/api";

const MesActual = () => {
  const navigate = useNavigate();

  // Estado temporal de prueba, lo reemplazarás por el fetch real del backend
  const [data, setData] = useState({
    ingreso: 120000,
    gastos: 60000,
    ahorros: 30000,
    inversiones: 15000,
    metaGasto: 50,
    metaAhorro: 20,
    metaInversion: 10,
    cumplimientoGasto: 50,
    cumplimientoAhorro: 25,
    cumplimientoInversion: 12
  });

  // useEffect(() => {
  //   // Aquí cargarás los datos reales desde el backend
  //   const cargarDatos = async () => {
  //     const response = await getMesActual(1);
  //     setData(response);
  //   };
  //   cargarDatos();
  // }, []);

  return (
    <div className="min-h-screen bg-[#F2F3F4]">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1F3B4D]">Datos del Mes Actual</h1>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-[#3498DB] hover:bg-[#2980B9] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Regresar</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Totales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card icon={<FaDollarSign />} title="Ingreso Mensual" color="[#1F3B4D]" value={data.ingreso} />
          <Card icon={<FaWallet />} title="Gastos Totales" color="[#E74C3C]" value={data.gastos} />
          <Card icon={<FaPiggyBank />} title="Ahorros Totales" color="[#2ECC71]" value={data.ahorros} />
          <Card icon={<FaChartLine />} title="Inversiones Totales" color="[#F39C12]" value={data.inversiones} />
        </div>

        {/* Cumplimiento de metas */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#1F3B4D] mb-4">Cumplimiento de Metas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetaCard
              titulo="Meta Gasto"
              porcentaje={data.cumplimientoGasto}
              meta={data.metaGasto}
              positivo={data.cumplimientoGasto <= data.metaGasto}
              color="#E74C3C"
            />
            <MetaCard
              titulo="Meta Ahorro"
              porcentaje={data.cumplimientoAhorro}
              meta={data.metaAhorro}
              positivo={data.cumplimientoAhorro >= data.metaAhorro}
              color="#2ECC71"
            />
            <MetaCard
              titulo="Meta Inversión"
              porcentaje={data.cumplimientoInversion}
              meta={data.metaInversion}
              positivo={data.cumplimientoInversion >= data.metaInversion}
              color="#F39C12"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// Componente reutilizable de card de totales
const Card = ({ icon, title, color, value }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
    <div className={`p-3 bg-[${color}]/10 rounded-lg text-[${color}]`}>{icon}</div>
    <div>
      <p className="text-[#95A5A6] text-sm">{title}</p>
      <p className="text-2xl font-bold text-[#1F3B4D]">${value.toLocaleString()}</p>
    </div>
  </div>
);

// Componente reutilizable para metas
const MetaCard = ({ titulo, porcentaje, meta, positivo, color }) => (
  <div className="border rounded-lg p-4 flex justify-between items-center">
    <div>
      <p className="font-semibold text-[#1F3B4D]">{titulo}</p>
      <p className="text-[#95A5A6] text-sm">Meta: {meta}%</p>
      <p className="text-xl font-bold text-[#1F3B4D]">{porcentaje}%</p>
    </div>
    <div className={`text-4xl ${positivo ? "text-[#2ECC71]" : "text-[#E74C3C]"}`}>
      {positivo ? <FaCheck /> : <FaTimes />}
    </div>
  </div>
);

export default MesActual;
