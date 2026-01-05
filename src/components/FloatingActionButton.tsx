import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, X, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FloatingActionButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Mostrar solo en páginas relevantes
  const showOnPages = ['/', '/ingresos', '/gastos', '/historial'];
  const shouldShow = showOnPages.includes(location.pathname);

  if (!shouldShow) return null;

  const handleIngresoClick = () => {
    setIsOpen(false);
    if (location.pathname !== '/ingresos') {
      navigate('/ingresos');
    }
  };

  const handleGastoClick = () => {
    setIsOpen(false);
    if (location.pathname !== '/gastos') {
      navigate('/gastos');
    }
  };

  return (
    <>
      {/* Botones de acción expandidos */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-2 lg:hidden">
          <Button
            variant="default"
            size="lg"
            className="rounded-full shadow-lg h-14 w-14"
            onClick={handleIngresoClick}
          >
            <TrendingUp className="h-6 w-6" />
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full shadow-lg h-14 w-14"
            onClick={handleGastoClick}
          >
            <TrendingDown className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Botón flotante principal */}
      <Button
        variant="default"
        size="lg"
        className={cn(
          'fixed bottom-4 right-4 z-40 rounded-full shadow-lg h-16 w-16 lg:hidden',
          isOpen && 'rotate-45'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </Button>
    </>
  );
}

