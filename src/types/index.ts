// Tipos principales de la aplicación

export type TipoMovimiento = 'ingreso' | 'gasto';

export interface Movimiento {
  id: string;
  tipo: TipoMovimiento;
  monto: number;
  descripcion: string;
  categoria: string;
  fecha: string; // ISO date string
  mes: string; // YYYY-MM format
}

export interface Ingreso extends Movimiento {
  tipo: 'ingreso';
}

export interface Gasto extends Movimiento {
  tipo: 'gasto';
}

export interface ConfiguracionHogar {
  nombreHogar: string;
  personas: string[];
}

export interface ResumenMensual {
  ingresos: number;
  gastos: number;
  balance: number;
  mes: string;
}
