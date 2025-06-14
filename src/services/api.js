const API_BASE_URL = "http://localhost:8000";

// Función para decodificar el token JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return null;
  }
};

// Función para manejar el inicio de sesión
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error en el inicio de sesión (${response.status})`);
  }
  
  const data = await response.json();
  
  // Decodificar el token para obtener el user_id
  if (data.access_token) {
    const tokenData = parseJwt(data.access_token);
    if (tokenData && tokenData.user_id) {
      data.user_id = tokenData.user_id;
    }
  }
  
  return data;
};

// Función auxiliar para manejar las respuestas de la API
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error en la petición");
  }
  return response.json();
};

// Servicios para Ingresos
export const getCurrentMonthIncome = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/incomes/${userId}/current-month`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener los ingresos del mes actual");
  }
  
  return response.json();
};

export const createIncome = async (userId, data) => {
  const response = await fetch(`${API_BASE_URL}/api/incomes/${userId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al crear el ingreso");
  }

  return response.json();
};

export const updateIncome = async (userId, date, data) => {
  const response = await fetch(`${API_BASE_URL}/api/incomes/${userId}/${date}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al actualizar el ingreso");
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
