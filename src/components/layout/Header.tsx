import { format, parseISO } from 'date-fns';
import { useFinanzas } from '@/context/FinanzasContext';
import { Select } from '@/components/ui/select';
import { SidebarToggle } from './Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { mesSeleccionado, setMesSeleccionado, configuracion } = useFinanzas();

  // Generar opciones de meses (últimos 12 meses)
  const generarOpcionesMeses = () => {
    const meses: string[] = [];
    const hoy = new Date();
    
    for (let i = 0; i < 12; i++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const valor = format(fecha, 'yyyy-MM');
      meses.push(valor);
    }
    
    return meses;
  };

  const opcionesMeses = generarOpcionesMeses();

  const handleMesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMesSeleccionado(e.target.value);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarToggle onToggle={onToggleSidebar} />
          <h1 className="text-xl font-bold lg:text-2xl">
            {configuracion.nombreHogar}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="mes-selector" className="text-sm font-medium text-muted-foreground">
              Mes:
            </label>
            <Select
              id="mes-selector"
              value={mesSeleccionado}
              onChange={handleMesChange}
              className="w-40"
            >
              {opcionesMeses.map((mes) => {
                const fecha = parseISO(mes + '-01');
                const label = format(fecha, 'MMMM yyyy');
                return (
                  <option key={mes} value={mes}>
                    {label}
                  </option>
                );
              })}
            </Select>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

