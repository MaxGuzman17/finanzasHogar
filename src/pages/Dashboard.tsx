import { useFinanzas } from '@/context/FinanzasContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Calendar,
  Activity,
  Target,
  Percent,
  PieChart,
  BarChart3,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { format, parseISO, subMonths, startOfMonth, endOfMonth, differenceInDays, eachDayOfInterval, getDate } from 'date-fns';
import { ListaMovimientos } from '@/components/ListaMovimientos';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

const CHART_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

export function Dashboard() {
  const { resumenMensual, ingresos, gastos, ingresosDelMes, gastosDelMes, movimientosDelMes } = useFinanzas();

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(monto);
  };

  const formatearMontoCorto = (monto: number) => {
    if (monto >= 1000000) {
      return `$${(monto / 1000000).toFixed(1)}M`;
    }
    if (monto >= 1000) {
      return `$${(monto / 1000).toFixed(0)}k`;
    }
    return formatearMonto(monto);
  };

  const formatearMes = (mes: string) => {
    const fecha = parseISO(mes + '-01');
    return format(fecha, 'MMMM yyyy');
  };

  // Calcular estadísticas adicionales
  const esPositivo = resumenMensual.balance >= 0;
  const fechaActual = parseISO(resumenMensual.mes + '-01');
  const diasTranscurridos = differenceInDays(new Date(), startOfMonth(fechaActual)) + 1;
  const diasTotales = differenceInDays(endOfMonth(fechaActual), startOfMonth(fechaActual)) + 1;
  
  // Promedios diarios
  const promedioIngresosDiario = resumenMensual.ingresos / diasTranscurridos;
  const promedioGastosDiario = resumenMensual.gastos / diasTranscurridos;
  
  // Porcentaje de ahorro
  const porcentajeAhorro = resumenMensual.ingresos > 0 
    ? (resumenMensual.balance / resumenMensual.ingresos) * 100 
    : 0;

  // Comparación con mes anterior
  const mesAnterior = format(subMonths(fechaActual, 1), 'yyyy-MM');
  const ingresosMesAnterior = ingresos
    .filter(ing => ing.mes === mesAnterior)
    .reduce((sum, ing) => sum + ing.monto, 0);
  const gastosMesAnterior = gastos
    .filter(gas => gas.mes === mesAnterior)
    .reduce((sum, gas) => sum + gas.monto, 0);
  
  const diferenciaIngresos = resumenMensual.ingresos - ingresosMesAnterior;
  const diferenciaGastos = resumenMensual.gastos - gastosMesAnterior;

  // Calcular porcentaje de progreso del mes
  const progresoMes = (diasTranscurridos / diasTotales) * 100;

  // Datos para gráfico de pastel - Categorías de gastos
  const categoriasGastos = gastosDelMes.reduce((acc, gasto) => {
    acc[gasto.categoria] = (acc[gasto.categoria] || 0) + gasto.monto;
    return acc;
  }, {} as Record<string, number>);
  
  const datosPieChart = Object.entries(categoriasGastos)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const topCategoriaGasto = Object.entries(categoriasGastos)
    .sort(([, a], [, b]) => b - a)[0];

  // Datos para gráfico de barras - Comparación mensual
  const datosComparacionMensual = [
    {
      mes: format(subMonths(fechaActual, 1), 'MMM'),
      Ingresos: ingresosMesAnterior,
      Gastos: gastosMesAnterior,
    },
    {
      mes: format(fechaActual, 'MMM'),
      Ingresos: resumenMensual.ingresos,
      Gastos: resumenMensual.gastos,
    },
  ];

  // Datos para gráfico de línea - Evolución diaria del mes
  const diasDelMes = eachDayOfInterval({
    start: startOfMonth(fechaActual),
    end: endOfMonth(fechaActual),
  });

  const datosEvolucionDiaria = diasDelMes.map(dia => {
    const diaStr = format(dia, 'yyyy-MM-dd');
    const ingresosDia = ingresosDelMes
      .filter(ing => format(parseISO(ing.fecha), 'yyyy-MM-dd') === diaStr)
      .reduce((sum, ing) => sum + ing.monto, 0);
    const gastosDia = gastosDelMes
      .filter(gas => format(parseISO(gas.fecha), 'yyyy-MM-dd') === diaStr)
      .reduce((sum, gas) => sum + gas.monto, 0);
    
    return {
      dia: getDate(dia),
      Ingresos: ingresosDia,
      Gastos: gastosDia,
      Balance: ingresosDia - gastosDia,
    };
  });

  // Últimos 5 movimientos
  const ultimosMovimientos = movimientosDelMes.slice(0, 5);

  // Custom tooltip para los gráficos
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold mb-2">{payload[0].payload.name || `Día ${payload[0].payload.dia}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatearMonto(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <p className="text-muted-foreground text-lg">
          Resumen financiero de <span className="font-semibold text-foreground">{formatearMes(resumenMensual.mes)}</span>
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Día {diasTranscurridos} de {diasTotales} ({Math.round(progresoMes)}% del mes)</span>
        </div>
      </div>

      {/* Cards principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card Ingresos */}
        <Card className="border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-400">
              Ingresos del Mes
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
              {formatearMonto(resumenMensual.ingresos)}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-green-600/70 dark:text-green-400/70 font-medium">
                {ingresosDelMes.length} {ingresosDelMes.length === 1 ? 'ingreso' : 'ingresos'} registrado{ingresosDelMes.length === 1 ? '' : 's'}
              </p>
              {ingresosMesAnterior > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  {diferenciaIngresos >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                  )}
                  <span className={diferenciaIngresos >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {diferenciaIngresos >= 0 ? '+' : ''}{formatearMonto(diferenciaIngresos)} vs mes anterior
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card Gastos */}
        <Card className="border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-400">
              Gastos del Mes
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700 dark:text-red-400 mb-2">
              {formatearMonto(resumenMensual.gastos)}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-red-600/70 dark:text-red-400/70 font-medium">
                {gastosDelMes.length} {gastosDelMes.length === 1 ? 'gasto' : 'gastos'} registrado{gastosDelMes.length === 1 ? '' : 's'}
              </p>
              {gastosMesAnterior > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  {diferenciaGastos <= 0 ? (
                    <ArrowDownRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3 text-red-600" />
                  )}
                  <span className={diferenciaGastos <= 0 ? 'text-green-600' : 'text-red-600'}>
                    {diferenciaGastos >= 0 ? '+' : ''}{formatearMonto(diferenciaGastos)} vs mes anterior
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card Balance */}
        <Card className={`border-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] ${
          esPositivo 
            ? 'border-green-300 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30' 
            : 'border-red-300 dark:border-red-800 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className={`text-sm font-semibold ${
              esPositivo ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
            }`}>
              Balance
            </CardTitle>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              esPositivo 
                ? 'bg-green-100 dark:bg-green-900/50' 
                : 'bg-red-100 dark:bg-red-900/50'
            }`}>
              {esPositivo ? (
                <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-2 ${
              esPositivo ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
            }`}>
              {formatearMonto(resumenMensual.balance)}
            </div>
            <div className="space-y-1">
              <p className={`text-xs font-medium ${
                esPositivo ? 'text-green-600/70 dark:text-green-400/70' : 'text-red-600/70 dark:text-red-400/70'
              }`}>
                {esPositivo ? 'Saldo positivo ✓' : 'Saldo negativo'}
              </p>
              {porcentajeAhorro > 0 && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Percent className="h-3 w-3" />
                  <span>{porcentajeAhorro.toFixed(1)}% de ahorro</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas adicionales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Promedio Diario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Ingresos:</span>
                <span className="text-sm font-semibold text-green-600">{formatearMonto(promedioIngresosDiario)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Gastos:</span>
                <span className="text-sm font-semibold text-red-600">{formatearMonto(promedioGastosDiario)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Movimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movimientosDelMes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total del mes</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Ahorro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${esPositivo ? 'text-green-600' : 'text-red-600'}`}>
              {porcentajeAhorro.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {esPositivo ? 'del total de ingresos' : 'Gastos superan ingresos'}
            </p>
          </CardContent>
        </Card>

        {topCategoriaGasto && (
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Mayor Gasto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{topCategoriaGasto[0]}</div>
              <p className="text-xs text-muted-foreground mt-1">{formatearMonto(topCategoriaGasto[1])}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Pastel - Distribución de Gastos por Categoría */}
        {datosPieChart.length > 0 && (
          <Card className="shadow-lg border-2">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Distribución de Gastos
              </CardTitle>
              <CardDescription>
                Gastos por categoría en {formatearMes(resumenMensual.mes)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={datosPieChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {datosPieChart.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Gráfico de Barras - Comparación Mensual */}
        <Card className="shadow-lg border-2">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Comparación Mensual
            </CardTitle>
            <CardDescription>
              Ingresos y gastos: mes anterior vs actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosComparacionMensual}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="mes" 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  tickFormatter={(value: number) => formatearMontoCorto(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Ingresos" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Gastos" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Línea - Evolución Diaria */}
      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUpIcon className="h-5 w-5" />
            Evolución Diaria del Mes
          </CardTitle>
          <CardDescription>
            Ingresos y gastos acumulados día a día
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={datosEvolucionDiaria}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="dia" 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
                label={{ value: 'Día del mes', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
                tickFormatter={(value: number) => formatearMontoCorto(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Ingresos" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="Gastos" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="Balance" 
                stroke="#3b82f6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Últimos movimientos */}
      {ultimosMovimientos.length > 0 && (
        <Card className="shadow-lg border-2">
          <CardHeader>
            <CardTitle className="text-xl">Últimos Movimientos</CardTitle>
            <CardDescription>
              Los 5 movimientos más recientes del mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListaMovimientos movimientos={ultimosMovimientos} mostrarEliminar={false} mostrarEditar={false} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
