import { useState } from 'react';
import { useFinanzas } from '@/context/FinanzasContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';

export function Configuracion() {
  const { configuracion, actualizarConfiguracion } = useFinanzas();
  const [formData, setFormData] = useState(configuracion);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actualizarConfiguracion(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(configuracion);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Configura los datos básicos del hogar
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Datos del Hogar</CardTitle>
          </div>
          <CardDescription>
            Personaliza la información de tu hogar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="nombreHogar"
                className="text-sm font-medium mb-2 block"
              >
                Nombre del Hogar
              </label>
              <Input
                id="nombreHogar"
                type="text"
                value={formData.nombreHogar}
                onChange={(e) =>
                  setFormData({ ...formData, nombreHogar: e.target.value })
                }
                disabled={!isEditing}
                required
              />
            </div>

            <div>
              <label
                htmlFor="persona1"
                className="text-sm font-medium mb-2 block"
              >
                Persona 1
              </label>
              <Input
                id="persona1"
                type="text"
                value={formData.personas[0] || ''}
                onChange={(e) => {
                  const nuevasPersonas = [...formData.personas];
                  nuevasPersonas[0] = e.target.value;
                  setFormData({ ...formData, personas: nuevasPersonas });
                }}
                disabled={!isEditing}
                required
              />
            </div>

            <div>
              <label
                htmlFor="persona2"
                className="text-sm font-medium mb-2 block"
              >
                Persona 2
              </label>
              <Input
                id="persona2"
                type="text"
                value={formData.personas[1] || ''}
                onChange={(e) => {
                  const nuevasPersonas = [...formData.personas];
                  nuevasPersonas[1] = e.target.value;
                  setFormData({ ...formData, personas: nuevasPersonas });
                }}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              {isEditing ? (
                <>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar Cambios</Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

