import HistoricoFinanciero from "./components/dashBoard/HistoricoFinanciero";
export default function HistoricoPage() {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6 text-[#1F3B4D]">Histórico de Datos Financieros</h1>
      <HistoricoFinanciero />
    </div>
  )
}
