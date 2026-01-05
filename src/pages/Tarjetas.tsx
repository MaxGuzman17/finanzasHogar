import { useFinanzas } from '@/context/FinanzasContext';
import { FormularioIngreso } from '@/components/FormularioIngreso';
import { ListaMovimientos } from '@/components/ListaMovimientos';
import { format, parseISO } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Ingresos() {
  const { ingresosDelMes } = useFinanzas();

  const formatearMes = (mes: string) => {
    const fecha = parseISO(mes + '-01');
    return format(fecha, 'MMMM yyyy');
  };

  const totalIngresos = ingresosDelMes.reduce((sum, ing) => sum + ing.monto, 0);
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
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Tarjetas
          </h2>
          <p className="text-muted-foreground text-lg">
            Gestiona las tarjetas del hogar
          </p>
        </div>
        <FormularioIngreso />
      </div>

      {ingresosDelMes.length > 0 && (
        <Card className="border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              Resumen de {formatearMes(ingresosDelMes[0]?.mes || new Date().toISOString().slice(0, 7))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatearMonto(totalIngresos)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {ingresosDelMes.length} {ingresosDelMes.length === 1 ? 'ingreso' : 'ingresos'} registrado{ingresosDelMes.length === 1 ? '' : 's'}
            </p>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">
          Lista de Ingresos
        </h3>
        <ListaMovimientos movimientos={ingresosDelMes} />
      </div>
    </div>
  );
}
