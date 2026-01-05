import { useState, useEffect } from 'react';
import type { Gasto } from '../types/index';
import { useFinanzas } from '@/context/FinanzasContext';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Plus, Save } from 'lucide-react';

const categoriasGastos = [
  'Alimentación',
  'Transporte',
  'Hogar',
  'Salud',
  'Entretenimiento',
  'Educación',
  'Servicios',
  'Otros',
];

interface FormularioGastoProps {
  movimiento?: Gasto;
  onClose?: () => void;
}

export function FormularioGasto({ movimiento, onClose }: FormularioGastoProps) {
  const { agregarGasto, editarGasto } = useFinanzas();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    monto: movimiento?.monto.toString() || '',
    descripcion: movimiento?.descripcion || '',
    categoria: movimiento?.categoria || categoriasGastos[0],
    fecha: movimiento?.fecha ? new Date(movimiento.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (movimiento) {
      setOpen(true);
      setFormData({
        monto: movimiento.monto.toString(),
        descripcion: movimiento.descripcion,
        categoria: movimiento.categoria,
        fecha: new Date(movimiento.fecha).toISOString().split('T')[0],
      });
    }
  }, [movimiento]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.monto || !formData.descripcion) {
      return;
    }

    const datosGasto = {
      tipo: 'gasto' as const,
      monto: parseFloat(formData.monto),
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      fecha: new Date(formData.fecha).toISOString(),
    };

    if (movimiento) {
      editarGasto(movimiento.id, datosGasto);
    } else {
      agregarGasto(datosGasto);
    }

    // Resetear formulario
    setFormData({
      monto: '',
      descripcion: '',
      categoria: categoriasGastos[0],
      fecha: new Date().toISOString().split('T')[0],
    });
    handleClose(false);
  };

  const handleClose = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Resetear formulario al cerrar si no hay movimiento
      if (!movimiento) {
        setFormData({
          monto: '',
          descripcion: '',
          categoria: categoriasGastos[0],
          fecha: new Date().toISOString().split('T')[0],
        });
      }
      onClose?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!movimiento && (
        <DialogTrigger 
          className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow" 
          variant="destructive"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Gasto
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {movimiento ? 'Editar Gasto' : 'Nuevo Gasto'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {movimiento 
              ? 'Modifica la información del gasto' 
              : 'Registra un nuevo gasto para el hogar'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="monto" className="text-sm font-semibold">
              Monto *
            </label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.monto}
              onChange={(e) =>
                setFormData({ ...formData, monto: e.target.value })
              }
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="descripcion" className="text-sm font-semibold">
              Descripción *
            </label>
            <Input
              id="descripcion"
              type="text"
              placeholder="Ej: Supermercado"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="categoria" className="text-sm font-semibold">
              Categoría
            </label>
            <Select
              id="categoria"
              value={formData.categoria}
              onChange={(e) =>
                setFormData({ ...formData, categoria: e.target.value })
              }
              className="h-11"
            >
              {categoriasGastos.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="fecha" className="text-sm font-semibold">
              Fecha *
            </label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) =>
                setFormData({ ...formData, fecha: e.target.value })
              }
              required
              className="h-11"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              className="min-w-[100px]"
            >
              Cancelar
            </Button>
            <Button type="submit" variant="destructive" className="min-w-[100px] shadow-md hover:shadow-lg">
              <Save className="h-4 w-4 mr-2" />
              {movimiento ? 'Guardar Cambios' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
