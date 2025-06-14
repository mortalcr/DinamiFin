import { useState, useEffect } from "react";
import { FaTimes, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";

const EditIncomeModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date.split("T")[0],
        amount: initialData.amount.toString(),
      });
    } else {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        amount: "",
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) {
      newErrors.date = "La fecha es obligatoria";
    }
    if (!formData.amount) {
      newErrors.amount = "El monto es obligatorio";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) < 0) {
      newErrors.amount = "El monto debe ser un número positivo";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        date: formData.date,
        amount: parseFloat(formData.amount),
      });
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || "Error al guardar los cambios" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#1F3B4D]">
            Editar Ingreso Mensual
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Fecha */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1F3B4D] uppercase tracking-wide">
              <FaCalendarAlt className="w-4 h-4 text-[#3498DB]" />
              Fecha de Creación *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                if (errors.date) {
                  setErrors((prev) => ({ ...prev, date: undefined }));
                }
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#3498DB]/20 focus:border-[#3498DB] transition-all duration-200 text-[#1F3B4D] ${
                errors.date ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1F3B4D] uppercase tracking-wide">
              <FaMoneyBillWave className="w-4 h-4 text-[#2ECC71]" />
              Monto Actual *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => {
                setFormData({ ...formData, amount: e.target.value });
                if (errors.amount) {
                  setErrors((prev) => ({ ...prev, amount: undefined }));
                }
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#3498DB]/20 focus:border-[#3498DB] transition-all duration-200 text-[#1F3B4D] ${
                errors.amount ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-[#1F3B4D] hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#3498DB] text-white rounded-lg hover:bg-[#2980B9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIncomeModal; 