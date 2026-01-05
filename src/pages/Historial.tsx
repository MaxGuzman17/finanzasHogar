import { useFinanzas } from '@/context/FinanzasContext';
import { ListaMovimientos } from '@/components/ListaMovimientos';
import { format, parseISO } from 'date-fns';
import { History } from 'lucide-react';

export function Historial() {
  const { movimientosDelMes } = useFinanzas();

  const formatearMes = (mes: string) => {
    if (!movimientosDelMes[0]) return '';
    const fecha = parseISO(mes + '-01');
    return format(fecha, 'MMMM yyyy');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
          <History className="h-8 w-8 text-primary" />
          Historial
        </h2>
        <p className="text-muted-foreground text-lg">
          Todos los movimientos de {movimientosDelMes[0] ? formatearMes(movimientosDelMes[0].mes) : 'este mes'}
        </p>
      </div>

      <ListaMovimientos movimientos={movimientosDelMes} />
    </div>
  );
}
