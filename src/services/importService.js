import axios from "axios";

const BASE_URL = "http://localhost:8000";  

export const importarDatos = async (file, tipo, userId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tipo", tipo);
  formData.append("user_id", userId);

  try {
    console.log("Intentando conectar a:", `${BASE_URL}/importar`);
    const response = await axios.post(`${BASE_URL}/importar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error completo:", error);
    
    if (error.response) {
      // El servidor respondió con un código de error
      console.error("Respuesta del servidor:", error.response.data);
      const errorData = error.response.data;
      if (typeof errorData === 'object' && errorData.detail) {
        if (typeof errorData.detail === 'object' && errorData.detail.errores) {
          throw new Error(errorData.detail.errores.join('\n'));
        }
        throw new Error(errorData.detail);
      }
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error("No se recibió respuesta del servidor");
      throw new Error("No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en http://localhost:8000");
    } else {
      // Algo ocurrió al configurar la petición
      console.error("Error al configurar la petición:", error.message);
      throw new Error(`Error al preparar la petición: ${error.message}`);
    }
    
    throw new Error("Error al conectar con el servidor. Por favor, intenta de nuevo.");
  }
};
