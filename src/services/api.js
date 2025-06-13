const API_BASE_URL = "http://localhost:8000";

// Función auxiliar para manejar las respuestas de la API
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error en la petición");
  }
  return response.json();
};

// Servicios para Gastos
export const getExpenses = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/datos/gastos/${userId}`);
  return handleResponse(response);
};

export const createExpense = async (userId, data) => {
  const response = await fetch(`${API_BASE_URL}/datos/gastos/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: data.amount,
      category: data.category,
      expense_date: data.date,
    }),
  });
  return handleResponse(response);
};

export const updateExpense = async (userId, date, data) => {
  const response = await fetch(
    `${API_BASE_URL}/datos/gastos/${userId}/${date}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: data.amount,
        category: data.category,
      }),
    }
  );
  return handleResponse(response);
};

export const deleteExpense = async (userId, date) => {
  const response = await fetch(
    `${API_BASE_URL}/datos/gastos/${userId}/${date}`,
    {
      method: "DELETE",
    }
  );
  return handleResponse(response);
};

// Servicios para Ahorros
export const getSavings = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/datos/ahorros/${userId}`);
  return handleResponse(response);
};

export const createSaving = async (userId, data) => {
  const response = await fetch(`${API_BASE_URL}/datos/ahorros/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: data.amount,
      category: data.category,
      income_date: data.date,
    }),
  });
  return handleResponse(response);
};

export const updateSaving = async (userId, date, data) => {
  const response = await fetch(
    `${API_BASE_URL}/datos/ahorros/${userId}/${date}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: data.amount,
        category: data.category,
      }),
    }
  );
  return handleResponse(response);
};

export const deleteSaving = async (userId, date) => {
  const response = await fetch(
    `${API_BASE_URL}/datos/ahorros/${userId}/${date}`,
    {
      method: "DELETE",
    }
  );
  return handleResponse(response);
};

// Servicios para Inversiones
export const getInvestments = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/datos/inversiones/${userId}`);
  return handleResponse(response);
};

export const createInvestment = async (userId, data) => {
  const response = await fetch(`${API_BASE_URL}/datos/inversiones/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: data.amount,
      category: data.category,
      investment_date: data.date,
    }),
  });
  return handleResponse(response);
};

export const updateInvestment = async (userId, date, data) => {
  const response = await fetch(
    `${API_BASE_URL}/datos/inversiones/${userId}/${date}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: data.amount,
        category: data.category,
      }),
    }
  );
  return handleResponse(response);
};

export const deleteInvestment = async (userId, date) => {
  const response = await fetch(
    `${API_BASE_URL}/datos/inversiones/${userId}/${date}`,
    {
      method: "DELETE",
    }
  );
  return handleResponse(response);
};
