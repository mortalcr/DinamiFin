import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Papa from 'papaparse';

const ImportarDatos = () => {
  const [tipoDato, setTipoDato] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const tiposDatos = [
    { value: 'ingresos', label: 'Ingresos', categorias: ['Salario', 'Freelance', 'Inversiones', 'Otros'] },
    { value: 'gastos', label: 'Gastos', categorias: ['Alimentación', 'Transporte', 'Vivienda', 'Entretenimiento', 'Otros'] },
    { value: 'ahorros', label: 'Ahorros', categorias: ['Cuenta de Ahorro', 'Fondo de Emergencia', 'Otros'] },
    { value: 'inversiones', label: 'Inversiones', categorias: ['Acciones', 'Bonos', 'Criptomonedas', 'Otros'] },
    { value: 'metas', label: 'Metas', categorias: ['Gasto', 'Ahorro', 'Inversión'] }
  ];

  const validarFecha = (fecha) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(fecha)) return false;
    
    const date = new Date(fecha);
    return date instanceof Date && !isNaN(date);
  };

  const validarMonto = (monto) => {
    const numero = parseFloat(monto);
    return !isNaN(numero) && numero >= 0;
  };

  const validarCategoria = (categoria, tipo) => {
    const tipoSeleccionado = tiposDatos.find(t => t.value === tipo);
    return tipoSeleccionado?.categorias.includes(categoria) || false;
  };

  const validarDatos = (datos, tipo) => {
    const errores = [];
    
    datos.forEach((fila, index) => {
      if (!validarFecha(fila.fecha)) {
        errores.push(`Fila ${index + 1}: Fecha inválida (${fila.fecha}). Debe ser YYYY-MM-DD`);
      }
      if (!validarMonto(fila.monto)) {
        errores.push(`Fila ${index + 1}: Monto inválido (${fila.monto}). Debe ser un número mayor o igual a 0`);
      }
      if (!validarCategoria(fila.categoria, tipo)) {
        errores.push(`Fila ${index + 1}: Categoría inválida (${fila.categoria}) para el tipo ${tipo}`);
      }
    });

    return errores;
  };

  const handleTipoDatoChange = (event) => {
    setTipoDato(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setArchivo(file);
    } else {
      setSnackbar({
        open: true,
        message: 'Por favor, seleccione un archivo CSV válido',
        severity: 'error'
      });
    }
  };

  const procesarCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  const handleImportar = async () => {
    if (!tipoDato || !archivo) {
      setSnackbar({
        open: true,
        message: 'Por favor, seleccione el tipo de dato y un archivo',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const datos = await procesarCSV(archivo);
      const errores = validarDatos(datos, tipoDato);

      if (errores.length > 0) {
        setSnackbar({
          open: true,
          message: `Errores encontrados:\n${errores.join('\n')}`,
          severity: 'error'
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', archivo);
      formData.append('tipo', tipoDato);
      formData.append('datos', JSON.stringify(datos));

      const response = await fetch('http://localhost:8000/api/importacion/importar', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al importar los datos');
      }

      const result = await response.json();
      setSnackbar({
        open: true,
        message: `${result.message}\nRegistros importados: ${result.registros_importados}`,
        severity: 'success'
      });

      // Limpiar el formulario
      setTipoDato('');
      setArchivo(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error al procesar el archivo: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Importar Datos
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="tipo-dato-label">Tipo de Dato</InputLabel>
          <Select
            labelId="tipo-dato-label"
            value={tipoDato}
            label="Tipo de Dato"
            onChange={handleTipoDatoChange}
          >
            {tiposDatos.map((tipo) => (
              <MenuItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          fullWidth
          disabled={loading}
        >
          Seleccionar Archivo CSV
          <input
            type="file"
            hidden
            accept=".csv"
            onChange={handleFileChange}
          />
        </Button>

        {archivo && (
          <Typography variant="body2" color="text.secondary">
            Archivo seleccionado: {archivo.name}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleImportar}
          disabled={!tipoDato || !archivo || loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Importar'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%', whiteSpace: 'pre-line' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ImportarDatos; 