import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import AddProduct from './pages/AddProduct'; 
import NotFound from './pages/NotFound';
import SalesList from './pages/SalesList';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sales" element={<SalesList />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/add-product" element={<AddProduct />} /> 
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
