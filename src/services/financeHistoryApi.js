import axios from "axios"

const API_URL = "http://localhost:8000/history"

export const fetchIncomeHistory = (userId, periodo = "1y") =>
  axios.get(`${API_URL}/income/${userId}`, { params: { periodo } })

export const fetchExpenseHistory = (userId, periodo = "1y") =>
  axios.get(`${API_URL}/expense/${userId}`, { params: { periodo } })

export const fetchSavingHistory = (userId, periodo = "1y") =>
  axios.get(`${API_URL}/saving/${userId}`, { params: { periodo } })

export const fetchInvestmentHistory = (userId, periodo = "1y") =>
  axios.get(`${API_URL}/investment/${userId}`, { params: { periodo } })

export const fetchExpenseGoalHistory = (userId, periodo = "1y") =>
  axios.get(`${API_URL}/expense_goal/${userId}`, { params: { periodo } })

export const fetchSavingGoalHistory = (userId, periodo = "1y") =>
  axios.get(`${API_URL}/saving_goal/${userId}`, { params: { periodo } })

export const fetchInvestmentGoalHistory = (userId, periodo = "1y") =>
  axios.get(`${API_URL}/investment_goal/${userId}`, { params: { periodo } })
