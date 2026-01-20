import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-100 shadow-md p-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
          Local de Limpieza
          <span className="text-blue-600 ml-1">- Inventario y Caja</span>
        </h1>

        {/* Navegación */}
        <nav className="space-x-4">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Caja Registradora
          </Link>
          <Link
            to="/sales"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Ventas
          </Link>
          <Link
            to="/inventory"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Gestionar Inventario
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
