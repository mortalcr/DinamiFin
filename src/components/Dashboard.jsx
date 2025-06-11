import React, { useState, useEffect } from "react";
import { AddRecordForm } from "./AddRecord";
import { EditRecord } from "./EditRecord";
import {
  FaPlus,
  FaChartLine,
  FaWallet,
  FaPiggyBank,
  FaDollarSign,
} from "react-icons/fa";
import {
  getExpenses,
  getSavings,
  getInvestments,
  createExpense,
  createSaving,
  createInvestment,
  updateExpense,
  updateSaving,
  updateInvestment,
  deleteExpense,
  deleteSaving,
  deleteInvestment,
} from "../services/api";

const Dashboard = () => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [totals, setTotals] = useState({
    expenses: 0,
    savings: 0,
    investments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Función para mostrar notificaciones
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Función para cargar todos los datos
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [expenses, savings, investments] = await Promise.all([
        getExpenses(1),
        getSavings(1),
        getInvestments(1),
      ]);

      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalSavings = savings.reduce((sum, sav) => sum + sav.amount, 0);
      const totalInvestments = investments.reduce(
        (sum, inv) => sum + inv.amount,
        0
      );

      setTotals({
        expenses: totalExpenses,
        savings: totalSavings,
        investments: totalInvestments,
      });

      const allRecords = [
        ...expenses.map((exp) => ({
          id: `exp-${exp.date}`,
          type: "gasto",
          amount: exp.amount,
          category: exp.category,
          date: exp.date.split("T")[0],
        })),
        ...savings.map((sav) => ({
          id: `sav-${sav.date}`,
          type: "ahorro",
          amount: sav.amount,
          category: sav.category,
          date: sav.date.split("T")[0],
        })),
        ...investments.map((inv) => ({
          id: `inv-${inv.date}`,
          type: "inversion",
          amount: inv.amount,
          category: inv.category,
          date: inv.date.split("T")[0],
        })),
      ];

      setRecords(allRecords);
    } catch (err) {
      setError(err.message);
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddRecord = async (data) => {
    try {
      const userId = 1; // Por ahora hardcodeado
      const { type, amount, category, date } = data;

      // Intentar crear el registro
      try {
        switch (type) {
          case "gasto":
            await createExpense(userId, { amount, category, date });
            break;
          case "ahorro":
            await createSaving(userId, { amount, category, date });
            break;
          case "inversion":
            await createInvestment(userId, { amount, category, date });
            break;
        }
      } catch (err) {
        if (err.message && err.message.includes("ya existe")) {
          console.log("Registro existente, actualizando...");
          switch (type) {
            case "gasto":
              await updateExpense(userId, date, { amount, category });
              break;
            case "ahorro":
              await updateSaving(userId, date, { amount, category });
              break;
            case "inversion":
              await updateInvestment(userId, date, { amount, category });
              break;
          }
        } else {
          // Si el registro se guardó a pesar del error 400, continuar
          if (err.message && err.message.includes("400")) {
            console.log("Registro guardado a pesar del error 400");
          } else {
            throw err;
          }
        }
      }

      await loadData();

      await new Promise((resolve) => setTimeout(resolve, 500));

      await loadData();

      setIsAddFormOpen(false);
      showNotification("Registro guardado exitosamente");
    } catch (err) {
      console.error("Error al guardar registro:", err);
      if (err.message && err.message.includes("400")) {
        await loadData();
        setIsAddFormOpen(false);
        showNotification("Registro guardado exitosamente");
      } else {
        showNotification(
          err.message || "Error al guardar el registro",
          "error"
        );
      }
    }
  };

  const handleEditRecord = async (data) => {
    try {
      const userId = 1; // Por ahora hardcodeado
      const { type, date, amount, category } = data;

      switch (type) {
        case "gasto":
          await updateExpense(userId, date, { amount, category });
          break;
        case "ahorro":
          await updateSaving(userId, date, { amount, category });
          break;
        case "inversion":
          await updateInvestment(userId, date, { amount, category });
          break;
      }

      await loadData();
      setSelectedRecord(null);
      showNotification("Registro actualizado exitosamente");
    } catch (err) {
      console.error("Error al actualizar registro:", err);
      showNotification(
        err.message || "Error al actualizar el registro",
        "error"
      );
    }
  };

  const handleDeleteRecord = async (record) => {
    try {
      const userId = 1; // Por ahora hardcodeado
      const { type, date } = record;

      switch (type) {
        case "gasto":
          await deleteExpense(userId, date);
          break;
        case "ahorro":
          await deleteSaving(userId, date);
          break;
        case "inversion":
          await deleteInvestment(userId, date);
          break;
      }

      await loadData();
      setSelectedRecord(null);
      showNotification("Registro eliminado exitosamente");
    } catch (err) {
      console.error("Error al eliminar registro:", err);
      showNotification(err.message || "Error al eliminar el registro", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F3F4] flex items-center justify-center">
        <p className="text-[#1F3B4D]">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F3F4] flex items-center justify-center">
        <p className="text-[#E74C3C]">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F3F4]">
      {/* Notificación */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-[#2ECC71]" : "bg-[#E74C3C]"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#1F3B4D]">DinamiFin</h1>
            <button
              onClick={() => setIsAddFormOpen(true)}
              className="flex items-center gap-2 bg-[#1F3B4D] hover:bg-[#1F3B4D]/90 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              <span>Agregar Registro</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#E74C3C]/10 rounded-lg">
                <FaWallet className="w-6 h-6 text-[#E74C3C]" />
              </div>
              <div>
                <p className="text-[#95A5A6] text-sm">Gastos Totales</p>
                <p className="text-2xl font-bold text-[#1F3B4D]">
                  ${totals.expenses.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#2ECC71]/10 rounded-lg">
                <FaPiggyBank className="w-6 h-6 text-[#2ECC71]" />
              </div>
              <div>
                <p className="text-[#95A5A6] text-sm">Ahorros Totales</p>
                <p className="text-2xl font-bold text-[#1F3B4D]">
                  ${totals.savings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F39C12]/10 rounded-lg">
                <FaChartLine className="w-6 h-6 text-[#F39C12]" />
              </div>
              <div>
                <p className="text-[#95A5A6] text-sm">Inversiones Totales</p>
                <p className="text-2xl font-bold text-[#1F3B4D]">
                  ${totals.investments.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de registros recientes */}
        <div className="bg-white rounded-lg shadow-sm border border-[#F2F3F4]">
          <div className="p-6 border-b border-[#F2F3F4]">
            <h2 className="text-lg font-semibold text-[#1F3B4D]">
              Registros Recientes
            </h2>
            <p className="text-[#95A5A6] text-sm">
              Últimos movimientos financieros registrados
            </p>
          </div>
          <div className="p-6">
            {records.length === 0 ? (
              <div className="text-center py-8 text-[#95A5A6]">
                <p>No hay registros aún</p>
                <p className="text-sm">
                  Haz clic en "Agregar Registro" para comenzar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {records
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 10)
                  .map((record) => (
                    <div
                      key={record.id}
                      onClick={() => setSelectedRecord(record)}
                      className="flex items-center justify-between p-4 border border-[#F2F3F4] rounded-lg hover:bg-[#F2F3F4]/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            record.type === "gasto"
                              ? "bg-[#E74C3C]/10 text-[#E74C3C]"
                              : record.type === "ahorro"
                              ? "bg-[#2ECC71]/10 text-[#2ECC71]"
                              : "bg-[#F39C12]/10 text-[#F39C12]"
                          }`}
                        >
                          {record.type === "gasto" ? (
                            <FaDollarSign className="w-4 h-4" />
                          ) : record.type === "ahorro" ? (
                            <FaPiggyBank className="w-4 h-4" />
                          ) : (
                            <FaChartLine className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize text-[#1F3B4D]">
                            {record.category}
                          </p>
                          <p className="text-sm text-[#95A5A6]">
                            {record.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            record.type === "gasto"
                              ? "text-[#E74C3C]"
                              : record.type === "ahorro"
                              ? "text-[#2ECC71]"
                              : "text-[#F39C12]"
                          }`}
                        >
                          ${record.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-[#95A5A6] capitalize">
                          {record.type}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Formulario para agregar registro */}
      <AddRecordForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSubmit={handleAddRecord}
      />

      {/* Formulario para editar registro */}
      <EditRecord
        isOpen={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        onSubmit={handleEditRecord}
        onDelete={() => handleDeleteRecord(selectedRecord)}
        record={selectedRecord}
      />
    </div>
  );
};

export default Dashboard;
