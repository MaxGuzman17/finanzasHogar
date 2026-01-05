import { format, parseISO } from 'date-fns';
import type { Movimiento } from '../types/index';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, TrendingUp, TrendingDown, Edit2 } from 'lucide-react';
import { useFinanzas } from '@/context/FinanzasContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { FormularioIngreso } from './FormularioIngreso';
import { FormularioGasto } from './FormularioGasto';

interface ListaMovimientosProps {
  movimientos: Movimiento[];
  mostrarEliminar?: boolean;
  mostrarEditar?: boolean;
}

export function ListaMovimientos({
  movimientos,
  mostrarEliminar = true,
  mostrarEditar = true,
}: ListaMovimientosProps) {
  const { eliminarMovimiento } = useFinanzas();
  const [movimientoEditando, setMovimientoEditando] = useState<Movimiento | null>(null);

  if (movimientos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No hay movimientos registrados</p>
        <p className="text-sm mt-2">Agrega tu primer ingreso o gasto para comenzar</p>
      </div>
    );
  }

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(monto);
  };

  const handleEditar = (movimiento: Movimiento) => {
    setMovimientoEditando(movimiento);
  };

  return (
    <>
      <div className="rounded-lg border-2 shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Fecha</TableHead>
              <TableHead className="font-semibold">Descripción</TableHead>
              <TableHead className="font-semibold">Categoría</TableHead>
              <TableHead className="text-right font-semibold">Monto</TableHead>
              {(mostrarEliminar || mostrarEditar) && (
                <TableHead className="text-right font-semibold">Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {movimientos.map((movimiento) => {
              const fecha = parseISO(movimiento.fecha);
              const esIngreso = movimiento.tipo === 'ingreso';

              return (
                <TableRow 
                  key={movimiento.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{format(fecha, 'dd/MM/yyyy')}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(fecha, 'EEE')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        esIngreso ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      {movimiento.descripcion}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {movimiento.categoria}
                    </span>
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-bold text-lg',
                      esIngreso ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    <div className="flex items-center justify-end gap-2">
                      {esIngreso ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                      <span>
                        {esIngreso ? '+' : '-'}
                        {formatearMonto(movimiento.monto)}
                      </span>
                    </div>
                  </TableCell>
                  {(mostrarEliminar || mostrarEditar) && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {mostrarEditar && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditar(movimiento)}
                            className="h-9 w-9 text-primary hover:text-primary hover:bg-primary/10"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        {mostrarEliminar && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => eliminarMovimiento(movimiento.id)}
                            className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Diálogos de edición */}
      {movimientoEditando && movimientoEditando.tipo === 'ingreso' && (
        <FormularioIngreso
          movimiento={movimientoEditando as import('../types/index').Ingreso}
          onClose={() => setMovimientoEditando(null)}
        />
      )}
      {movimientoEditando && movimientoEditando.tipo === 'gasto' && (
        <FormularioGasto
          movimiento={movimientoEditando as import('../types/index').Gasto}
          onClose={() => setMovimientoEditando(null)}
        />
      )}
    </>
  );
}
