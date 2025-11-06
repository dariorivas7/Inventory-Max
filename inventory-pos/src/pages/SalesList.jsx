import { useEffect, useState } from 'react';
import { getSales } from '../api/saleService';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('all');
  const [loading, setLoading] = useState(true);

  // 🔁 Cargar ventas desde MongoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSales();

        // ✅ Obtener todas las fechas únicas, ordenadas de más reciente a más antigua
        const uniqueDates = Array.from(
          new Set(data
                      .map((s) => new Date(s.date))
                      .sort((a, b) => new Date(b) - new Date(a))
                      .map((d) => d.toLocaleDateString())));

        setDates(uniqueDates);
        setSales(data);
        setFilteredSales(data);
      } catch (error) {
        console.error('Error cargando ventas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🧮 Filtrar ventas por fecha seleccionada
  useEffect(() => {
    if (selectedDate === 'all') {
      setFilteredSales(sales);
    } else {
      const filtered = sales.filter(
        (s) => new Date(s.date).toLocaleDateString() === selectedDate
      );
      setFilteredSales(filtered);
    }
  }, [selectedDate, sales]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 text-lg mt-6 animate-pulse">
        Cargando ventas...
      </p>
    );
  }

  // 🧾 Calcular total del filtro actual
  const totalFiltrado = filteredSales.reduce((acc, sale) => acc + (sale.total || 0), 0);

  // 🧩 Flatten de todas las líneas de producto de todas las ventas
  const allItems = filteredSales.flatMap((sale) =>
    sale.items.map((item) => ({
      ...item,
      date: sale.date,
      saleId: sale._id,
      totalVenta: sale.total,
    }))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Historial de Ventas</h2>

      {/* 🔽 Filtro por fecha */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="font-medium text-gray-700">Filtrar por fecha:</label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">Todas las fechas</option>
          {dates.map((date, idx) => (
            <option key={idx} value={date}>
              {date}
            </option>
          ))}
        </select>

        <span className="ml-auto text-gray-700 font-semibold">
          💰 Total del filtro: ${totalFiltrado.toFixed(2)}
        </span>
      </div>

      {allItems.length === 0 ? (
        <p className="text-center text-gray-600">
          No hay ventas registradas para esta fecha.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 rounded-md shadow-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-2 px-3 text-left">Fecha</th>
                <th className="py-2 px-3 text-left">ID Venta</th>
                <th className="py-2 px-3 text-left">Categoría</th>
                <th className="py-2 px-3 text-left">Producto</th>
                <th className="py-2 px-3 text-left">Precio</th>
                <th className="py-2 px-3 text-left">Cantidad</th>
                <th className="py-2 px-3 text-left">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {allItems
                       .sort((a, b) => new Date(b.date) - new Date(a.date))
                       .map((item, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50 transition">
                  <td className="py-2 px-3">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-3 text-gray-500">#{item.saleId.slice(-5)}</td>
                  <td className="py-2 px-3">{item.category || '-'}</td>
                  <td className="py-2 px-3">{item.name}</td>
                  <td className="py-2 px-3">${item.price?.toFixed(2) || '-'}</td>
                  <td className="py-2 px-3">{item.quantity}</td>
                  <td className="py-2 px-3 font-medium">
                    ${item.subtotal?.toFixed(2) || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
