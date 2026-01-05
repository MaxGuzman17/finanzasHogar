import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FinanzasProvider } from '@/context/FinanzasContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Ingresos } from '@/pages/Ingresos';
import { Gastos } from '@/pages/Gastos';
import { Historial } from '@/pages/Historial';
import { Configuracion } from '@/pages/Configuracion';

function App() {
  return (
    <ThemeProvider>
      <FinanzasProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="ingresos" element={<Ingresos />} />
              <Route path="gastos" element={<Gastos />} />
              <Route path="historial" element={<Historial />} />
              <Route path="configuracion" element={<Configuracion />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FinanzasProvider>
    </ThemeProvider>
  );
}

export default App;
