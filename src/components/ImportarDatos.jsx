import React, { useState } from "react";
import { importarDatos } from "../services/importService";
import { FaFileUpload, FaSpinner, FaInfoCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ImportarDatos = () => {
  const [file, setFile] = useState(null);
  const [tipo, setTipo] = useState("expense");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showExample, setShowExample] = useState(false);
  const userId = 1;
  const navigate = useNavigate();

  const getExampleCSV = () => {
    switch (tipo) {
      case "expense":
        return "date,amount,category\n2024-03-20,150.50,Alimentación\n2024-03-20,75.25,Transporte";
      case "income":
        return "date,amount\n2024-03-20,2500.00\n2024-03-20,500.00";
      case "saving":
        return "date,amount,category\n2024-03-20,1000.00,Emergencia\n2024-03-20,500.00,Vacaciones";
      case "investment":
        return "date,amount,category\n2024-03-20,2000.00,Acciones\n2024-03-20,1500.00,Bonos";
      case "expense_goal":
      case "saving_goal":
      case "investment_goal":
        return "date,value\n2024-03-20,5000.00\n2024-03-20,10000.00";
      default:
        return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: "error", text: "Por favor, selecciona un archivo" });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await importarDatos(file, tipo, userId);
      setMessage({ 
        type: "success", 
        text: `Importación exitosa: ${res.registros_importados} registros importados correctamente` 
      });
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.message || "Error al importar los datos" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv") {
        setMessage({ type: "error", text: "Por favor, selecciona un archivo CSV" });
        e.target.value = null;
        setFile(null);
      } else if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
        setMessage({ type: "error", text: "El archivo no debe superar los 10MB" });
        e.target.value = null;
        setFile(null);
      } else {
        setFile(selectedFile);
        setMessage(null);
      }
    }
  };

  const handleTipoChange = (e) => {
    setTipo(e.target.value);
    setShowExample(false);
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F2F3F4] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="mb-8">
            <button
              onClick={handleBackToDashboard}
              className="inline-flex items-center gap-2 text-[#3498DB] hover:text-[#2980B9] transition-colors mb-4"
            >
              <FaArrowLeft />
              <span>Volver</span>
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#1F3B4D] mb-2">
                Importar Datos
              </h1>
              <p className="text-[#95A5A6]">
                Sube tu archivo CSV para importar tus datos financieros
              </p>
            </div>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-[#2ECC71]/10 text-[#2ECC71]"
                  : "bg-[#E74C3C]/10 text-[#E74C3C]"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#F8F9FA] p-4 rounded-lg">
              <label
                htmlFor="tipo"
                className="block text-sm font-medium text-[#1F3B4D] mb-2"
              >
                Tipo de Datos
              </label>
              <select
                id="tipo"
                value={tipo}
                onChange={handleTipoChange}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#3498DB] focus:border-transparent bg-white"
              >
                <option value="expense">Gastos</option>
                <option value="income">Ingresos</option>
                <option value="saving">Ahorros</option>
                <option value="investment">Inversiones</option>
                <option value="expense_goal">Meta de Gastos</option>
                <option value="saving_goal">Meta de Ahorros</option>
                <option value="investment_goal">Meta de Inversiones</option>
              </select>
            </div>

            <div className="bg-[#F8F9FA] p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-[#1F3B4D]"
                >
                  Archivo CSV
                </label>
                <button
                  type="button"
                  onClick={() => setShowExample(!showExample)}
                  className="text-sm text-[#3498DB] hover:text-[#2980B9] flex items-center gap-1"
                >
                  <FaInfoCircle />
                  {showExample ? "Ocultar ejemplo" : "Ver ejemplo"}
                </button>
              </div>

              {showExample && (
                <div className="mb-4 p-4 bg-white rounded-lg border border-[#E2E8F0]">
                  <p className="text-sm text-[#1F3B4D] mb-2">Ejemplo de formato CSV:</p>
                  <pre className="text-xs text-[#95A5A6] whitespace-pre-wrap bg-[#F8F9FA] p-2 rounded">
                    {getExampleCSV()}
                  </pre>
                </div>
              )}

              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#E2E8F0] border-dashed rounded-lg hover:border-[#3498DB] transition-colors bg-white">
                <div className="space-y-1 text-center">
                  <FaFileUpload className="mx-auto h-12 w-12 text-[#95A5A6]" />
                  <div className="flex text-sm text-[#95A5A6]">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-[#3498DB] hover:text-[#2980B9] focus-within:outline-none"
                    >
                      <span>Sube un archivo</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">o arrastra y suelta</p>
                  </div>
                  <p className="text-xs text-[#95A5A6]">
                    Solo archivos CSV hasta 10MB
                  </p>
                </div>
              </div>
              {file && (
                <p className="mt-2 text-sm text-[#1F3B4D]">
                  Archivo seleccionado: {file.name}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleBackToDashboard}
                className="flex-1 px-4 py-2 border border-[#E2E8F0] rounded-lg text-[#1F3B4D] hover:bg-[#F8F9FA] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !file}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                  loading || !file
                    ? "bg-[#95A5A6] cursor-not-allowed"
                    : "bg-[#3498DB] hover:bg-[#2980B9]"
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Importando...</span>
                  </>
                ) : (
                  <span>Importar Datos</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImportarDatos;
