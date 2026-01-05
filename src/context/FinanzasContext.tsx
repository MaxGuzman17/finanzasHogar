import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Movimiento, Ingreso, Gasto, ResumenMensual, ConfiguracionHogar } from '../types/index';
import { format, parseISO, startOfMonth } from 'date-fns';

interface FinanzasContextType {
  // Estado
  ingresos: Ingreso[];
  gastos: Gasto[];
  mesSeleccionado: string; // YYYY-MM format
  configuracion: ConfiguracionHogar;
  
  // Acciones
  agregarIngreso: (ingreso: Omit<Ingreso, 'id' | 'mes'>) => void;
  agregarGasto: (gasto: Omit<Gasto, 'id' | 'mes'>) => void;
  editarIngreso: (id: string, ingreso: Omit<Ingreso, 'id' | 'mes'>) => void;
  editarGasto: (id: string, gasto: Omit<Gasto, 'id' | 'mes'>) => void;
  eliminarMovimiento: (id: string) => void;
  setMesSeleccionado: (mes: string) => void;
  actualizarConfiguracion: (config: ConfiguracionHogar) => void;
  
  // Computados
  resumenMensual: ResumenMensual;
  movimientosDelMes: Movimiento[];
  ingresosDelMes: Ingreso[];
  gastosDelMes: Gasto[];
}

const FinanzasContext = createContext<FinanzasContextType | undefined>(undefined);

const STORAGE_KEYS = {
  INGRESOS: 'finanzas-hogar-ingresos',
  GASTOS: 'finanzas-hogar-gastos',
  CONFIG: 'finanzas-hogar-config',
  MES: 'finanzas-hogar-mes',
};

// Función para obtener el mes actual en formato YYYY-MM
const getCurrentMonth = (): string => {
  return format(startOfMonth(new Date()), 'yyyy-MM');
};

// Función para obtener el mes de una fecha
const getMonthFromDate = (date: string): string => {
  return format(startOfMonth(parseISO(date)), 'yyyy-MM');
};

export function FinanzasProvider({ children }: { children: ReactNode }) {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [mesSeleccionado, setMesSeleccionadoState] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.MES);
    return stored || getCurrentMonth();
  });
  const [configuracion, setConfiguracion] = useState<ConfiguracionHogar>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      nombreHogar: 'Mi Hogar',
      personas: ['Persona 1', 'Persona 2'],
    };
  });

  // Cargar datos del localStorage al montar
  useEffect(() => {
    const storedIngresos = localStorage.getItem(STORAGE_KEYS.INGRESOS);
    const storedGastos = localStorage.getItem(STORAGE_KEYS.GASTOS);
    
    if (storedIngresos) {
      setIngresos(JSON.parse(storedIngresos));
    } else {
      // Datos mockeados iniciales
      const mockIngresos: Ingreso[] = [
        {
          id: '1',
          tipo: 'ingreso',
          monto: 50000,
          descripcion: 'Salario',
          categoria: 'Trabajo',
          fecha: new Date().toISOString(),
          mes: getCurrentMonth(),
        },
        {
          id: '2',
          tipo: 'ingreso',
          monto: 10000,
          descripcion: 'Freelance',
          categoria: 'Trabajo',
          fecha: new Date().toISOString(),
          mes: getCurrentMonth(),
        },
      ];
      setIngresos(mockIngresos);
      localStorage.setItem(STORAGE_KEYS.INGRESOS, JSON.stringify(mockIngresos));
    }
    
    if (storedGastos) {
      setGastos(JSON.parse(storedGastos));
    } else {
      // Datos mockeados iniciales
      const mockGastos: Gasto[] = [
        {
          id: '3',
          tipo: 'gasto',
          monto: 15000,
          descripcion: 'Supermercado',
          categoria: 'Alimentación',
          fecha: new Date().toISOString(),
          mes: getCurrentMonth(),
        },
        {
          id: '4',
          tipo: 'gasto',
          monto: 8000,
          descripcion: 'Servicios',
          categoria: 'Hogar',
          fecha: new Date().toISOString(),
          mes: getCurrentMonth(),
        },
      ];
      setGastos(mockGastos);
      localStorage.setItem(STORAGE_KEYS.GASTOS, JSON.stringify(mockGastos));
    }
  }, []);

  // Persistir ingresos en localStorage
  useEffect(() => {
    if (ingresos.length > 0) {
      localStorage.setItem(STORAGE_KEYS.INGRESOS, JSON.stringify(ingresos));
    }
  }, [ingresos]);

  // Persistir gastos en localStorage
  useEffect(() => {
    if (gastos.length > 0) {
      localStorage.setItem(STORAGE_KEYS.GASTOS, JSON.stringify(gastos));
    }
  }, [gastos]);

  // Persistir mes seleccionado
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MES, mesSeleccionado);
  }, [mesSeleccionado]);

  // Persistir configuración
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(configuracion));
  }, [configuracion]);

  const agregarIngreso = (ingreso: Omit<Ingreso, 'id' | 'mes'>) => {
    const nuevoIngreso: Ingreso = {
      ...ingreso,
      id: Date.now().toString(),
      mes: getMonthFromDate(ingreso.fecha),
    };
    setIngresos((prev) => [...prev, nuevoIngreso]);
  };

  const agregarGasto = (gasto: Omit<Gasto, 'id' | 'mes'>) => {
    const nuevoGasto: Gasto = {
      ...gasto,
      id: Date.now().toString(),
      mes: getMonthFromDate(gasto.fecha),
    };
    setGastos((prev) => [...prev, nuevoGasto]);
  };

  const editarIngreso = (id: string, ingreso: Omit<Ingreso, 'id' | 'mes'>) => {
    setIngresos((prev) =>
      prev.map((ing) =>
        ing.id === id
          ? {
              ...ing,
              ...ingreso,
              mes: getMonthFromDate(ingreso.fecha),
            }
          : ing
      )
    );
  };

  const editarGasto = (id: string, gasto: Omit<Gasto, 'id' | 'mes'>) => {
    setGastos((prev) =>
      prev.map((gas) =>
        gas.id === id
          ? {
              ...gas,
              ...gasto,
              mes: getMonthFromDate(gasto.fecha),
            }
          : gas
      )
    );
  };

  const eliminarMovimiento = (id: string) => {
    setIngresos((prev) => prev.filter((ing) => ing.id !== id));
    setGastos((prev) => prev.filter((gas) => gas.id !== id));
  };

  const setMesSeleccionado = (mes: string) => {
    setMesSeleccionadoState(mes);
  };

  const actualizarConfiguracion = (config: ConfiguracionHogar) => {
    setConfiguracion(config);
  };

  // Computados
  const ingresosDelMes = ingresos.filter((ing) => ing.mes === mesSeleccionado);
  const gastosDelMes = gastos.filter((gas) => gas.mes === mesSeleccionado);
  const movimientosDelMes: Movimiento[] = [
    ...ingresosDelMes,
    ...gastosDelMes,
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const resumenMensual: ResumenMensual = {
    ingresos: ingresosDelMes.reduce((sum, ing) => sum + ing.monto, 0),
    gastos: gastosDelMes.reduce((sum, gas) => sum + gas.monto, 0),
    balance: 0,
    mes: mesSeleccionado,
  };
  resumenMensual.balance = resumenMensual.ingresos - resumenMensual.gastos;

  return (
    <FinanzasContext.Provider
      value={{
        ingresos,
        gastos,
        mesSeleccionado,
        configuracion,
        agregarIngreso,
        agregarGasto,
        editarIngreso,
        editarGasto,
        eliminarMovimiento,
        setMesSeleccionado,
        actualizarConfiguracion,
        resumenMensual,
        movimientosDelMes,
        ingresosDelMes,
        gastosDelMes,
      }}
    >
      {children}
    </FinanzasContext.Provider>
  );
}

export function useFinanzas() {
  const context = useContext(FinanzasContext);
  if (context === undefined) {
    throw new Error('useFinanzas must be used within a FinanzasProvider');
  }
  return context;
}

