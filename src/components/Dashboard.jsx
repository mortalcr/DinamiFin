"use client"

import { useState, useEffect, useRef } from "react"
import { AddRecordForm } from "./AddRecord"
import { EditRecord } from "./EditRecord"
import EditIncomeModal from "./EditIncomeModal"
import { FaPlus, FaChartLine, FaWallet, FaPiggyBank, FaFileImport, FaFilter, FaCheck, FaTimes } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"
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
} from "../services/api"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import {
  fetchExpenseGoalHistory,
  fetchSavingGoalHistory,
  fetchInvestmentGoalHistory,
} from "../services/financeHistoryApi"

const categories = {
  gasto: ["vivienda", "alimentación", "transporte", "salud", "educación", "entretenimiento", "ropa", "otros"],
  ahorro: ["fondo de emergencia", "jubilación", "vacaciones", "mantenimiento", "otros"],
  inversion: ["fondo de inversión", "acciones", "bienes raíces", "cripto", "negocio", "otros"],
}

const COLORS = {
  gasto: ["#FF6B6B", "#FF8E8E", "#FFB1B1", "#FFD4D4", "#FF9999", "#FFCCCC", "#FFE6E6", "#FFF0F0"],
  ahorro: ["#51CF66", "#74D687", "#97DEA8", "#BAE5C9", "#DDEDEA", "#E8F5E8", "#F4FAF4", "#FAFCFA"],
  inversion: ["#FCC419", "#FFD43B", "#FFE066", "#FFEB99", "#FFF3CC", "#FFF9E6", "#FFFCF0", "#FFFEFA"],
}

const GoalIndicators = ({ currentMonthTotals, loading, goals }) => {
  const calculatePercentage = (value, total) => {
    if (!total || total === 0) return 0
    return Math.round((value / total) * 100)
  }

  const getStatusIcon = (percentage, target) => {
    if (percentage >= target) {
      return <FaCheck className="text-green-500" />
    }
    return <FaTimes className="text-red-500" />
  }

  const expensePercentage = calculatePercentage(currentMonthTotals.expenses, currentMonthTotals.income)
  const savingsPercentage = calculatePercentage(currentMonthTotals.savings, currentMonthTotals.income)
  const investmentPercentage = calculatePercentage(currentMonthTotals.investments, currentMonthTotals.income)

  // Obtener la meta actual del mes
  const getCurrentMonthGoal = (goalData) => {
    if (!goalData || goalData.length === 0) return 0
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const currentGoal = goalData.find((g) => g.period === currentMonth)
    return currentGoal ? currentGoal.goal : 0
  }

  const expenseGoal = getCurrentMonthGoal(goals.expense)
  const savingGoal = getCurrentMonthGoal(goals.saving)
  const investmentGoal = getCurrentMonthGoal(goals.investment)

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-[#F2F3F4]">
        <h2 className="text-lg font-semibold mb-4 text-[#1F3B4D]">Indicadores de Cumplimiento de Metas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg bg-[#F8F9FA] animate-pulse">
              <div className="h-6 bg-[#E5E7EB] rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-[#E5E7EB] rounded w-1/2 mb-2"></div>
              <div className="h-2 bg-[#E5E7EB] rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-[#F2F3F4]">
      <h2 className="text-lg font-semibold mb-4 text-[#1F3B4D]">Indicadores de Cumplimiento de Metas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-[#E5E7EB] rounded-lg bg-[#F8F9FA]">
          <h3 className="font-medium mb-2 text-[#1F3B4D]">Meta de Gasto Mensual</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[#1F3B4D]">{expensePercentage}%</span>
            {getStatusIcon(expensePercentage, expenseGoal)}
          </div>
          <div className="w-full bg-[#E5E7EB] rounded-full h-2.5 mt-2">
            <div
              className="bg-[#E74C3C] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(expensePercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-[#95A5A6] mt-1">Meta: {expenseGoal}% del ingreso</p>
        </div>

        <div className="p-4 border border-[#E5E7EB] rounded-lg bg-[#F8F9FA]">
          <h3 className="font-medium mb-2 text-[#1F3B4D]">Meta de Ahorro Mensual</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[#1F3B4D]">{savingsPercentage}%</span>
            {getStatusIcon(savingsPercentage, savingGoal)}
          </div>
          <div className="w-full bg-[#E5E7EB] rounded-full h-2.5 mt-2">
            <div
              className="bg-[#2ECC71] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(savingsPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-[#95A5A6] mt-1">Meta: {savingGoal}% del ingreso</p>
        </div>

        <div className="p-4 border border-[#E5E7EB] rounded-lg bg-[#F8F9FA]">
          <h3 className="font-medium mb-2 text-[#1F3B4D]">Meta de Inversión Mensual</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[#1F3B4D]">{investmentPercentage}%</span>
            {getStatusIcon(investmentPercentage, investmentGoal)}
          </div>
          <div className="w-full bg-[#E5E7EB] rounded-full h-2.5 mt-2">
            <div
              className="bg-[#F39C12] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(investmentPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-[#95A5A6] mt-1">Meta: {investmentGoal}% del ingreso</p>
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  // State for UI
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false)

  // New state for filtering and pagination
  const [recordFilter, setRecordFilter] = useState("todos")
  const [visibleRecords, setVisibleRecords] = useState(4)
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // State for data
  const [records, setRecords] = useState([])
  const [totals, setTotals] = useState({
    expenses: 0,
    savings: 0,
    investments: 0,
    income: 0,
  })
  const [currentMonthTotals, setCurrentMonthTotals] = useState({
    expenses: 0,
    savings: 0,
    investments: 0,
    income: 0,
  })

  const [goals, setGoals] = useState({
    expense: [],
    saving: [],
    investment: [],
  })

  // Show notification helper function
  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Function to calculate chart data for pie charts
  const getChartData = (type) => {
    const typeRecords = records.filter((record) => record.type === type)
    const categoryTotals = {}

    // Initialize all categories with 0
    categories[type].forEach((category) => {
      categoryTotals[category] = 0
    })

    // Sum amounts by category
    typeRecords.forEach((record) => {
      if (categoryTotals.hasOwnProperty(record.category)) {
        categoryTotals[record.category] += record.amount
      }
    })

    // Convert to chart format and filter out zero values
    const chartData = Object.entries(categoryTotals)
      .filter(([_, value]) => value > 0)
      .map(([category, amount]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: amount,
        percentage: 0, // Will be calculated below
      }))

    // Calculate percentages
    const total = chartData.reduce((sum, item) => sum + item.value, 0)
    if (total > 0) {
      chartData.forEach((item) => {
        item.percentage = ((item.value / total) * 100).toFixed(1)
      })
    }

    return chartData
  }

  // Función para obtener el primer y último día del mes actual
  const getCurrentMonthRange = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return { firstDay, lastDay }
  }

  // Función para verificar si una fecha está en el mes actual
  const isDateInCurrentMonth = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter records based on selected filter
  const getFilteredRecords = () => {
    let filtered = records

    if (recordFilter !== "todos") {
      filtered = records.filter((record) => {
        switch (recordFilter) {
          case "gastos":
            return record.type === "gasto"
          case "ahorros":
            return record.type === "ahorro"
          case "inversiones":
            return record.type === "inversion"
          default:
            return true
        }
      })
    }

    // Sort by date (most recent first) and limit to visible records
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, visibleRecords)
  }

  // Get record counts by category
  const getRecordCounts = () => {
    return {
      todos: records.length,
      gastos: records.filter((r) => r.type === "gasto").length,
      ahorros: records.filter((r) => r.type === "ahorro").length,
      inversiones: records.filter((r) => r.type === "inversion").length,
    }
  }

  // Function to load data
  const loadData = async () => {
    console.log("Usuario actual en Dashboard:", user)

    if (!user || user.id === undefined) {
      console.log("Usuario no autenticado o sin ID, no se pueden cargar los datos")
      setError("No se pudo cargar la información del usuario. Por favor, inicia sesión nuevamente.")
      setLoading(false)
      return
    }

    console.log("Cargando datos para el usuario ID:", user.id)

    try {
      setLoading(true)
      setError(null)

      // Hacer todas las peticiones en paralelo
      const [expenses, savings, investments, monthlyIncome, expenseGoals, savingGoals, investmentGoals] =
        await Promise.all([
          getExpenses(user.id),
          getSavings(user.id),
          getInvestments(user.id),
          getCurrentMonthIncome(user.id),
          fetchExpenseGoalHistory(user.id, "1m").catch((err) => {
            console.warn("Error cargando metas de gastos:", err)
            return { data: [] }
          }),
          fetchSavingGoalHistory(user.id, "1m").catch((err) => {
            console.warn("Error cargando metas de ahorros:", err)
            return { data: [] }
          }),
          fetchInvestmentGoalHistory(user.id, "1m").catch((err) => {
            console.warn("Error cargando metas de inversiones:", err)
            return { data: [] }
          }),
        ])

      console.log("Datos recibidos:", {
        expenses,
        savings,
        investments,
        monthlyIncome,
        expenseGoals,
        savingGoals,
        investmentGoals,
      })

      // Actualizar las metas
      setGoals({
        expense: expenseGoals?.data || [],
        saving: savingGoals?.data || [],
        investment: investmentGoals?.data || [],
      })

      // Calcular totales generales
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
      const totalSavings = savings.reduce((sum, sav) => sum + sav.amount, 0)
      const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0)

      setTotals({
        expenses: totalExpenses,
        savings: totalSavings,
        investments: totalInvestments,
        income: monthlyIncome || 0,
      })

      // Calcular totales del mes actual
      const currentMonthExpenses = expenses
        .filter((exp) => isDateInCurrentMonth(exp.date))
        .reduce((sum, exp) => sum + exp.amount, 0)

      const currentMonthSavings = savings
        .filter((sav) => isDateInCurrentMonth(sav.date))
        .reduce((sum, sav) => sum + sav.amount, 0)

      const currentMonthInvestments = investments
        .filter((inv) => isDateInCurrentMonth(inv.date))
        .reduce((sum, inv) => sum + inv.amount, 0)

      setCurrentMonthTotals({
        expenses: currentMonthExpenses,
        savings: currentMonthSavings,
        investments: currentMonthInvestments,
        income: monthlyIncome || 0,
      })

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
      ]

      setRecords(allRecords)
    } catch (err) {
      console.error("Error cargando datos:", err)
      setError("Error al cargar los datos. " + (err.message || ""))
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos del dashboard cuando cambie el usuario
  useEffect(() => {
    loadData()
  }, [user?.id]) // Recargar cuando cambie el ID del usuario

  const handleAddRecord = async (data) => {
    if (!user || !user.id) {
      showNotification("No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.", "error")
      return
    }

    try {
      // Asegurarse de que el ID del usuario esté incluido en los datos
      const recordData = {
        ...data,
        userId: user.id,
      }

      if (data.type === "gasto") {
        await createExpense(user.id, {
          amount: data.amount,
          category: data.category,
          date: data.date,
        })
      } else if (data.type === "ahorro") {
        await createSaving(user.id, {
          amount: data.amount,
          category: data.category,
          date: data.date,
        })
      } else if (data.type === "inversion") {
        await createInvestment(user.id, {
          amount: data.amount,
          category: data.category,
          date: data.date,
        })
      }

      // Recargar los datos
      await loadData()
      await new Promise((resolve) => setTimeout(resolve, 300))
      await loadData()

      setIsAddFormOpen(false)
      showNotification("Registro guardado exitosamente")
    } catch (err) {
      console.error("Error al guardar registro:", err)
      const errorMessage = err.response?.data?.detail || err.message || "Error al guardar el registro"
      showNotification(errorMessage, "error")
    }
  }

  const handleEditRecord = async (data) => {
    if (!user || !user.id) {
      showNotification("No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.", "error")
      return
    }

    try {
      // Verificar que el registro pertenezca al usuario actual
      if (data.userId && data.userId !== user.id) {
        throw new Error("No tienes permiso para editar este registro")
      }

      const updateData = {
        amount: data.amount,
        category: data.category,
      }

      if (data.type === "gasto") {
        await updateExpense(user.id, data.originalDate || data.date, updateData)
      } else if (data.type === "ahorro") {
        await updateSaving(user.id, data.originalDate || data.date, updateData)
      } else if (data.type === "inversion") {
        await updateInvestment(user.id, data.originalDate || data.date, updateData)
      }

      await loadData()
      setSelectedRecord(null)
      showNotification("Registro actualizado exitosamente")
    } catch (err) {
      console.error("Error al actualizar registro:", err)
      const errorMessage = err.response?.data?.detail || err.message || "Error al actualizar el registro"
      showNotification(errorMessage, "error")
    }
  }

  const handleDeleteRecord = async (record) => {
    if (!user || !user.id) {
      showNotification("No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.", "error")
      return
    }

    try {
      // Verificar que el registro pertenezca al usuario actual
      if (record.userId && record.userId !== user.id) {
        throw new Error("No tienes permiso para eliminar este registro")
      }

      if (record.type === "gasto") {
        await deleteExpense(user.id, record.originalDate || record.date)
      } else if (record.type === "ahorro") {
        await deleteSaving(user.id, record.originalDate || record.date)
      } else if (record.type === "inversion") {
        await deleteInvestment(user.id, record.originalDate || record.date)
      }

      await loadData()
      setSelectedRecord(null)
      showNotification("Registro eliminado exitosamente")
    } catch (err) {
      console.error("Error al eliminar registro:", err)
      const errorMessage = err.response?.data?.detail || err.message || "Error al eliminar el registro"
      showNotification(errorMessage, "error")
    }
  }

  const handleIncomeSubmit = async (data) => {
    try {
      if (currentMonthTotals.income > 0) {
        await updateIncome(user.id, data.date, data)
      } else {
        await createIncome(user.id, data)
      }
      await loadData()
      showNotification("Ingreso mensual actualizado correctamente")
    } catch (err) {
      throw new Error(err.message || "Error al guardar el ingreso mensual")
    }
  }

  const handleLoadMore = () => {
    setVisibleRecords((prev) => prev + 4)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F3F4] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F3B4D] mb-4"></div>
        <p className="text-[#1F3B4D] text-lg font-medium">Cargando datos...</p>
        <p className="text-[#95A5A6] text-sm mt-2">
          {user ? `Usuario ID: ${user.id || "No disponible"}` : "No hay usuario autenticado"}
        </p>
        {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      </div>
    )
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
            setError(null)
            loadData()
          }}
          className="bg-[#1F3B4D] hover:bg-[#F39C12] text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  const filteredRecords = getFilteredRecords()

  return (
    <div className="min-h-screen bg-[#F2F3F4] pt-16 md:pt-20">
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            notification.type === "success" ? "bg-[#2ECC71]" : "bg-[#E74C3C]"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      {/* Enhanced Header */}
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
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Income Card */}
          <div
            className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setIsIncomeModalOpen(true)}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[#1F3B4D] mb-2">Ingreso Mensual Total</h2>
                <p className="text-2xl font-bold text-[#2ECC71]">
                  $
                  {currentMonthTotals.income.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-[#95A5A6] mt-2">Click para editar</p>
              </div>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#E74C3C]/10 rounded-lg">
                <FaWallet className="w-6 h-6 text-[#E74C3C]" />
              </div>
              <div>
                <p className="text-[#95A5A6] text-sm">Gastos del Mes</p>
                <p className="text-2xl font-bold text-[#1F3B4D]">
                  ${currentMonthTotals.expenses.toLocaleString("es-GT")}
                </p>
              </div>
            </div>
          </div>

          {/* Savings Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#2ECC71]/10 rounded-lg">
                <FaPiggyBank className="w-6 h-6 text-[#2ECC71]" />
              </div>
              <div>
                <p className="text-[#95A5A6] text-sm">Ahorros del Mes</p>
                <p className="text-2xl font-bold text-[#1F3B4D]">
                  ${currentMonthTotals.savings.toLocaleString("es-GT")}
                </p>
              </div>
            </div>
          </div>

          {/* Investments Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F39C12]/10 rounded-lg">
                <FaChartLine className="w-6 h-6 text-[#F39C12]" />
              </div>
              <div>
                <p className="text-[#95A5A6] text-sm">Inversiones del Mes</p>
                <p className="text-2xl font-bold text-[#1F3B4D]">
                  ${currentMonthTotals.investments.toLocaleString("es-GT")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <GoalIndicators currentMonthTotals={currentMonthTotals} loading={loading} goals={goals} />

        {/* New layout with records on the left and space for charts on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Records section - takes 2/3 of the space */}
          <div className="lg:col-span-2">
            {/* Recent Records Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB]">
              <div className="p-6 border-b border-[#F1F3F4]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#1F3B4D] flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#9B59B6] rounded-full"></div>
                      Actividad Reciente
                    </h2>
                    <p className="text-[#95A5A6] text-sm mt-1">Últimos movimientos financieros</p>
                  </div>

                  {/* Enhanced Filter Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                      className="flex items-center gap-3 px-4 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl hover:border-[#1F3B4D] hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1F3B4D] focus:ring-opacity-20"
                    >
                      <div className="flex items-center gap-2">
                        {recordFilter === "gastos" && <FaWallet className="w-4 h-4 text-[#E74C3C]" />}
                        {recordFilter === "ahorros" && <FaPiggyBank className="w-4 h-4 text-[#3498DB]" />}
                        {recordFilter === "inversiones" && <FaChartLine className="w-4 h-4 text-[#F39C12]" />}
                        {recordFilter === "todos" && <FaFilter className="w-4 h-4 text-[#95A5A6]" />}
                        <span className="text-sm font-medium text-[#1F3B4D] capitalize">
                          {recordFilter === "inversiones"
                            ? "Inversiones"
                            : recordFilter === "todos"
                              ? "Todos"
                              : recordFilter}
                        </span>
                        <span className="text-xs bg-[#1F3B4D] text-white px-2 py-1 rounded-full">
                          {getRecordCounts()[recordFilter]}
                        </span>
                      </div>
                      <svg
                        className={`w-4 h-4 text-[#95A5A6] transition-transform duration-200 ${
                          isFilterDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isFilterDropdownOpen && (
                      <div className="absolute top-full right-0 mt-1 w-full sm:w-64 bg-[#1F3B4D] border border-[#2C3E50] rounded-lg shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        <div className="p-1">
                          {[
                            {
                              key: "todos",
                              label: "Todos los registros",
                              icon: FaFilter,
                              color: "text-white",
                              bgColor: "bg-white/10",
                            },
                            {
                              key: "gastos",
                              label: "Gastos",
                              icon: FaWallet,
                              color: "text-[#FF6B6B]",
                              bgColor: "bg-[#E74C3C]/20",
                            },
                            {
                              key: "ahorros",
                              label: "Ahorros",
                              icon: FaPiggyBank,
                              color: "text-[#51CF66]",
                              bgColor: "bg-[#2ECC71]/20",
                            },
                            {
                              key: "inversiones",
                              label: "Inversiones",
                              icon: FaChartLine,
                              color: "text-[#FCC419]",
                              bgColor: "bg-[#F39C12]/20",
                            },
                          ].map((filter) => {
                            const IconComponent = filter.icon
                            const count = getRecordCounts()[filter.key]
                            const isActive = recordFilter === filter.key

                            return (
                              <button
                                key={filter.key}
                                onClick={() => {
                                  setRecordFilter(filter.key)
                                  setVisibleRecords(4)
                                  setIsFilterDropdownOpen(false)
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-md transition-all duration-150 ${
                                  isActive ? "bg-white/10 border border-white/20" : "hover:bg-white/5"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-md ${isActive ? "bg-white/20" : filter.bgColor}`}>
                                    <IconComponent className={`w-4 h-4 ${isActive ? "text-white" : filter.color}`} />
                                  </div>
                                  <div className="text-left">
                                    <p className="text-sm font-medium text-white">{filter.label}</p>
                                    <p className="text-xs text-white/60">
                                      {count} {count === 1 ? "registro" : "registros"}
                                    </p>
                                  </div>
                                </div>
                                {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-8 text-[#95A5A6]">
                    <p>{recordFilter === "todos" ? "No hay registros aún" : `No hay registros de ${recordFilter}`}</p>
                    <p className="text-sm">Haz clic en "Agregar Registro" para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {filteredRecords.map((record) => (
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
                                <FaWallet className="w-4 h-4 text-[#E74C3C]" />
                              ) : record.type === "ahorro" ? (
                                <FaPiggyBank className="w-4 h-4 text-[#2ECC71]" />
                              ) : (
                                <FaChartLine className="w-4 h-4 text-[#F39C12]" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-[#1F3B4D] capitalize">{record.category}</p>
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
                            <p className="text-[#1F3B4D] capitalize">{record.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Load more button */}
                    {records.filter((record) => {
                      if (recordFilter === "todos") return true
                      switch (recordFilter) {
                        case "gastos":
                          return record.type === "gasto"
                        case "ahorros":
                          return record.type === "ahorro"
                        case "inversiones":
                          return record.type === "inversion"
                        default:
                          return true
                      }
                    }).length > visibleRecords && (
                      <div className="text-center mt-4">
                        <button
                          onClick={handleLoadMore}
                          className="text-[#1F3B4D] hover:text-[#F39C12] text-sm font-medium transition-colors"
                        >
                          Ver más registros
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 border border-[#E5E7EB]">
            <h3 className="text-lg font-semibold text-[#1F3B4D] mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#F39C12] rounded-full"></div>
              Distribución por Categorías
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {/* Expenses Chart */}
              <div className="text-center">
                <h4 className="text-sm font-medium text-[#E74C3C] mb-3 flex items-center justify-center gap-2">
                  <FaWallet className="w-4 h-4" />
                  Gastos
                </h4>
                {getChartData("gasto").length > 0 ? (
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getChartData("gasto")}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {getChartData("gasto").map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS.gasto[index % COLORS.gasto.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                          labelFormatter={(label) => `${label}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-[#95A5A6] text-sm">Sin datos</div>
                )}
              </div>

              {/* Savings Chart */}
              <div className="text-center">
                <h4 className="text-sm font-medium text-[#3498DB] mb-3 flex items-center justify-center gap-2">
                  <FaPiggyBank className="w-4 h-4" />
                  Ahorros
                </h4>
                {getChartData("ahorro").length > 0 ? (
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getChartData("ahorro")}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {getChartData("ahorro").map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS.ahorro[index % COLORS.ahorro.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                          labelFormatter={(label) => `${label}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-[#95A5A6] text-sm">Sin datos</div>
                )}
              </div>

              {/* Investments Chart */}
              <div className="text-center">
                <h4 className="text-sm font-medium text-[#F39C12] mb-3 flex items-center justify-center gap-2">
                  <FaChartLine className="w-4 h-4" />
                  Inversiones
                </h4>
                {getChartData("inversion").length > 0 ? (
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getChartData("inversion")}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {getChartData("inversion").map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS.inversion[index % COLORS.inversion.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                          labelFormatter={(label) => `${label}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-[#95A5A6] text-sm">Sin datos</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddRecordForm isOpen={isAddFormOpen} onClose={() => setIsAddFormOpen(false)} onSubmit={handleAddRecord} />

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
        initialData={
          currentMonthTotals.income > 0
            ? {
                date: new Date().toISOString(),
                amount: currentMonthTotals.income,
              }
            : null
        }
      />
    </div>
  )
}

export default Dashboard
