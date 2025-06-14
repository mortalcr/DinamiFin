import React, { useState, useEffect } from "react";
import { AddRecordForm } from "./AddRecord";
import { EditRecord } from "./EditRecord";
import EditIncomeModal from "./EditIncomeModal";
import {
  FaPlus,
  FaChartLine,
  FaWallet,
  FaPiggyBank,
  FaDollarSign,
  FaFileImport,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
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
  getCurrentMonthIncome,
  createIncome,
  updateIncome,
} from "../services/api";
import {
  fetchExpenseGoalHistory,
  fetchSavingGoalHistory,
  fetchInvestmentGoalHistory,
} from "../services/financeHistoryApi";

const GoalIndicators = ({ currentMonthTotals, loading, goals }) => {
  const calculatePercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const getStatusIcon = (percentage, target) => {
    if (percentage >= target) {
      return <FaCheck className="text-green-500" />;
    }
    return <FaTimes className="text-red-500" />;
  };

  const expensePercentage = calculatePercentage(currentMonthTotals.expenses, currentMonthTotals.income);
  const savingsPercentage = calculatePercentage(currentMonthTotals.savings, currentMonthTotals.income);
  const investmentPercentage = calculatePercentage(currentMonthTotals.investments, currentMonthTotals.income);

  // Obtener la meta actual del mes
  const getCurrentMonthGoal = (goalData) => {
    if (!goalData || goalData.length === 0) return 0;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const currentGoal = goalData.find(g => g.period === currentMonth);
    return currentGoal ? currentGoal.goal : 0;
  };

  const expenseGoal = getCurrentMonthGoal(goals.expense);
  const savingGoal = getCurrentMonthGoal(goals.saving);
  const investmentGoal = getCurrentMonthGoal(goals.investment);

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Indicadores de Cumplimiento de Metas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg bg-white animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Indicadores de Cumplimiento de Metas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-white">
          <h3 className="font-medium mb-2 text-gray-700">Meta de Gasto Mensual</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-800">{expensePercentage}%</span>
            {getStatusIcon(expensePercentage, expenseGoal)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(expensePercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Meta: {expenseGoal}% del ingreso</p>
        </div>

        <div className="p-4 border rounded-lg bg-white">
          <h3 className="font-medium mb-2 text-gray-700">Meta de Ahorro Mensual</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-800">{savingsPercentage}%</span>
            {getStatusIcon(savingsPercentage, savingGoal)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(savingsPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Meta: {savingGoal}% del ingreso</p>
        </div>

        <div className="p-4 border rounded-lg bg-white">
          <h3 className="font-medium mb-2 text-gray-700">Meta de Inversión Mensual</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-800">{investmentPercentage}%</span>
            {getStatusIcon(investmentPercentage, investmentGoal)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-purple-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(investmentPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Meta: {investmentGoal}% del ingreso</p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  // State for UI
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  
  // State for data
  const [records, setRecords] = useState([]);
  const [totals, setTotals] = useState({
    expenses: 0,
    savings: 0,
    investments: 0,
    income: 0
  });
  const [currentMonthTotals, setCurrentMonthTotals] = useState({
    expenses: 0,
    savings: 0,
    investments: 0,
    income: 0
  });
  const [goals, setGoals] = useState({
    expense: [],
    saving: [],
    investment: []
  });

  // Show notification helper function
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Función para obtener el primer y último día del mes actual
  const getCurrentMonthRange = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { firstDay, lastDay };
  };

  // Función para verificar si una fecha está en el mes actual
  const isDateInCurrentMonth = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // Function to load data
  const loadData = async () => {
    console.log('Usuario actual en Dashboard:', user);
    
    if (!user || user.id === undefined) {
      console.log('Usuario no autenticado o sin ID, no se pueden cargar los datos');
      setError('No se pudo cargar la información del usuario. Por favor, inicia sesión nuevamente.');
      setLoading(false);
      return;
    }
    
    console.log('Cargando datos para el usuario ID:', user.id);
    
    try {
      setLoading(true);
      setError(null);
      
      // Hacer todas las peticiones en paralelo
      const [
        expenses, 
        savings, 
        investments, 
        monthlyIncome,
        expenseGoals,
        savingGoals,
        investmentGoals
      ] = await Promise.all([
        getExpenses(user.id),
        getSavings(user.id),
        getInvestments(user.id),
        getCurrentMonthIncome(user.id),
        fetchExpenseGoalHistory(user.id, "1m"),
        fetchSavingGoalHistory(user.id, "1m"),
        fetchInvestmentGoalHistory(user.id, "1m")
      ]);
      
      console.log('Datos recibidos:', { 
        expenses, 
        savings, 
        investments, 
        monthlyIncome,
        expenseGoals,
        savingGoals,
        investmentGoals
      });

      // Actualizar las metas
      setGoals({
        expense: expenseGoals.data,
        saving: savingGoals.data,
        investment: investmentGoals.data
      });

      // Calcular totales generales
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalSavings = savings.reduce((sum, sav) => sum + sav.amount, 0);
      const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);

      setTotals({
        expenses: totalExpenses,
        savings: totalSavings,
        investments: totalInvestments,
        income: monthlyIncome || 0
      });

      // Calcular totales del mes actual
      const currentMonthExpenses = expenses
        .filter(exp => isDateInCurrentMonth(exp.date))
        .reduce((sum, exp) => sum + exp.amount, 0);

      const currentMonthSavings = savings
        .filter(sav => isDateInCurrentMonth(sav.date))
        .reduce((sum, sav) => sum + sav.amount, 0);

      const currentMonthInvestments = investments
        .filter(inv => isDateInCurrentMonth(inv.date))
        .reduce((sum, inv) => sum + inv.amount, 0);

      setCurrentMonthTotals({
        expenses: currentMonthExpenses,
        savings: currentMonthSavings,
        investments: currentMonthInvestments,
        income: monthlyIncome || 0
      });

      const allRecords = [
        ...expenses.map((exp) => ({
          id: `exp-${exp.date}`,
          type: 'gasto',
          amount: exp.amount,
          category: exp.category,
          date: exp.date.split('T')[0],
        })),
        ...savings.map((sav) => ({
          id: `sav-${sav.date}`,
          type: 'ahorro',
          amount: sav.amount,
          category: sav.category,
          date: sav.date.split('T')[0],
        })),
        ...investments.map((inv) => ({
          id: `inv-${inv.date}`,
          type: 'inversion',
          amount: inv.amount,
          category: inv.category,
          date: inv.date.split('T')[0],
        })),
      ];

      setRecords(allRecords);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos. ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos del dashboard cuando cambie el usuario
  useEffect(() => {
    loadData();
  }, [user?.id]); // Recargar cuando cambie el ID del usuario

  const handleAddRecord = async (data) => {
    if (!user || !user.id) {
      showNotification("No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.", "error");
      return;
    }
    
    try {
      // Asegurarse de que el ID del usuario esté incluido en los datos
      const recordData = {
        ...data,
        userId: user.id
      };
      
      if (data.type === 'gasto') {
        await createExpense(user.id, { 
          amount: data.amount, 
          category: data.category, 
          date: data.date 
        });
      } else if (data.type === 'ahorro') {
        await createSaving(user.id, { 
          amount: data.amount, 
          category: data.category, 
          date: data.date 
        });
      } else if (data.type === 'inversion') {
        await createInvestment(user.id, { 
          amount: data.amount, 
          category: data.category, 
          date: data.date 
        });
      }

      // Recargar los datos
      await loadData();
      await new Promise((resolve) => setTimeout(resolve, 300));
      await loadData();

      setIsAddFormOpen(false);
      showNotification("Registro guardado exitosamente");
    } catch (err) {
      console.error("Error al guardar registro:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Error al guardar el registro";
      showNotification(errorMessage, "error");
    }
  };

  const handleEditRecord = async (data) => {
    if (!user || !user.id) {
      showNotification("No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.", "error");
      return;
    }
    
    try {
      // Verificar que el registro pertenezca al usuario actual
      if (data.userId && data.userId !== user.id) {
        throw new Error("No tienes permiso para editar este registro");
      }
      
      const updateData = {
        amount: data.amount,
        category: data.category
      };
      
      if (data.type === 'gasto') {
        await updateExpense(user.id, data.originalDate || data.date, updateData);
      } else if (data.type === 'ahorro') {
        await updateSaving(user.id, data.originalDate || data.date, updateData);
      } else if (data.type === 'inversion') {
        await updateInvestment(user.id, data.originalDate || data.date, updateData);
      }

      await loadData();
      setSelectedRecord(null);
      showNotification("Registro actualizado exitosamente");
    } catch (err) {
      console.error("Error al actualizar registro:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Error al actualizar el registro";
      showNotification(errorMessage, "error");
    }
  };

  const handleDeleteRecord = async (record) => {
    if (!user || !user.id) {
      showNotification("No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.", "error");
      return;
    }
    
    try {
      // Verificar que el registro pertenezca al usuario actual
      if (record.userId && record.userId !== user.id) {
        throw new Error("No tienes permiso para eliminar este registro");
      }
      
      if (record.type === 'gasto') {
        await deleteExpense(user.id, record.originalDate || record.date);
      } else if (record.type === 'ahorro') {
        await deleteSaving(user.id, record.originalDate || record.date);
      } else if (record.type === 'inversion') {
        await deleteInvestment(user.id, record.originalDate || record.date);
      }

      await loadData();
      setSelectedRecord(null);
      showNotification("Registro eliminado exitosamente");
    } catch (err) {
      console.error("Error al eliminar registro:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Error al eliminar el registro";
      showNotification(errorMessage, "error");
    }
  };

  const handleIncomeSubmit = async (data) => {
    try {
      if (currentMonthTotals.income > 0) {
        await updateIncome(user.id, data.date, data);
      } else {
        await createIncome(user.id, data);
      }
      await loadData();
      showNotification("Ingreso mensual actualizado correctamente");
    } catch (err) {
      throw new Error(err.message || "Error al guardar el ingreso mensual");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F3F4] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F3B4D] mb-4"></div>
        <p className="text-[#1F3B4D] text-lg font-medium">Cargando datos...</p>
        <p className="text-[#95A5A6] text-sm mt-2">
          {user ? `Usuario ID: ${user.id || 'No disponible'}` : 'No hay usuario autenticado'}
        </p>
        {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F3F4] flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 w-full max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => {
            setError(null);
            loadData();
          }}
          className="bg-[#1F3B4D] hover:bg-[#F39C12] text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F3F4] pt-16 md:pt-20">
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-[#2ECC71]" : "bg-[#E74C3C]"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#1F3B4D]">DinamiFin</h1>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/importar")}
                className="flex items-center gap-2 bg-[#9B59B6] hover:bg-[#8E44AD] text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaFileImport className="w-4 h-4" />
                <span>Importar Datos</span>
              </button>
              <button
                onClick={() => setIsAddFormOpen(true)}
                className="flex items-center gap-2 bg-[#1F3B4D] hover:bg-[#1F3B4D]/90 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                <span>Agregar Registro</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div 
            className="bg-white rounded-xl shadow-md p-6 mb-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setIsIncomeModalOpen(true)}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[#1F3B4D] mb-2">
                  Ingreso Mensual Total
                </h2>
                {loading ? (
                  <p className="text-gray-500">Cargando...</p>
                ) : error ? (
                  <div className="space-y-2">
                    <p className="text-red-500">{error}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setError(null);
                        loadData();
                      }}
                      className="text-sm px-4 py-2 bg-[#1F3B4D] text-white rounded-lg hover:bg-[#1F3B4D]/90 transition-colors"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-[#2ECC71]">
                    ${currentMonthTotals.income.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#E74C3C]/10 rounded-lg">
                <FaWallet className="w-6 h-6 text-[#E74C3C]" />
              </div>
              <div>
                <p className="text-[#95A5A6] text-sm">Gastos del Mes</p>
                <p className="text-2xl font-bold text-[#1F3B4D]">
                  ${currentMonthTotals.expenses.toLocaleString('es-GT')}
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
                <p className="text-[#95A5A6] text-sm">Ahorros del Mes</p>
                <p className="text-2xl font-bold text-[#1F3B4D]">
                  ${currentMonthTotals.savings.toLocaleString('es-GT')}
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
                <p className="text-[#95A5A6] text-sm">Inversiones del Mes</p>
                <p className="text-2xl font-bold text-[#1F3B4D]">
                  ${currentMonthTotals.investments.toLocaleString('es-GT')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <GoalIndicators 
          currentMonthTotals={currentMonthTotals} 
          loading={loading} 
          goals={goals}
        />

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
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg hover:bg-[#F2F3F4] transition-colors cursor-pointer"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-lg ${
                          record.type === "gasto"
                            ? "bg-[#E74C3C]/10"
                            : record.type === "ahorro"
                            ? "bg-[#2ECC71]/10"
                            : "bg-[#F39C12]/10"
                        }`}
                      >
                        {record.type === "gasto" ? (
                          <FaWallet
                            className={`w-5 h-5 ${
                              record.type === "gasto"
                                ? "text-[#E74C3C]"
                                : record.type === "ahorro"
                                ? "text-[#2ECC71]"
                                : "text-[#F39C12]"
                            }`}
                          />
                        ) : record.type === "ahorro" ? (
                          <FaPiggyBank
                            className={`w-5 h-5 ${
                              record.type === "gasto"
                                ? "text-[#E74C3C]"
                                : record.type === "ahorro"
                                ? "text-[#2ECC71]"
                                : "text-[#F39C12]"
                            }`}
                          />
                        ) : (
                          <FaChartLine
                            className={`w-5 h-5 ${
                              record.type === "gasto"
                                ? "text-[#E74C3C]"
                                : record.type === "ahorro"
                                ? "text-[#2ECC71]"
                                : "text-[#F39C12]"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#1F3B4D] capitalize">
                          {record.category}
                        </p>
                        <p className="text-sm text-[#95A5A6]">{record.date}</p>
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

      <AddRecordForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSubmit={handleAddRecord}
      />

      <EditRecord
        isOpen={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        onSubmit={handleEditRecord}
        onDelete={() => handleDeleteRecord(selectedRecord)}
        record={selectedRecord}
      />

      <EditIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSubmit={handleIncomeSubmit}
        initialData={currentMonthTotals.income > 0 ? { 
          date: new Date().toISOString(), 
          amount: currentMonthTotals.income 
        } : null}
      />
    </div>
  );
};

export default Dashboard;
