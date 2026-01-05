import { useFinanzas } from '@/context/FinanzasContext';
import { FormularioGasto } from '@/components/FormularioGasto';
import { ListaMovimientos } from '@/components/ListaMovimientos';
import { format, parseISO } from 'date-fns';
import { TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Gastos() {
  const { gastosDelMes } = useFinanzas();

  const formatearMes = (mes: string) => {
    const fecha = parseISO(mes + '-01');
    return format(fecha, 'MMMM yyyy');
  };

  const totalGastos = gastosDelMes.reduce((sum, gas) => sum + gas.monto, 0);
  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(monto);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
            Gastos
          </h2>
          <p className="text-muted-foreground text-lg">
            Gestiona los gastos del hogar
          </p>
        </div>
        <FormularioGasto />
      </div>

      {gastosDelMes.length > 0 && (
        <Card className="border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              Resumen de {formatearMes(gastosDelMes[0]?.mes || new Date().toISOString().slice(0, 7))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {formatearMonto(totalGastos)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {gastosDelMes.length} {gastosDelMes.length === 1 ? 'gasto' : 'gastos'} registrado{gastosDelMes.length === 1 ? '' : 's'}
            </p>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">
          Lista de Gastos
        </h3>
        <ListaMovimientos movimientos={gastosDelMes} />
      </div>
    </div>
  );
}
