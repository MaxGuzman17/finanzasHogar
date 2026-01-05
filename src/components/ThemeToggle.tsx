import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9"
      title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
    >
      <Sun className={cn(
        "h-5 w-5 rotate-0 scale-100 transition-all",
        theme === 'dark' && "rotate-90 scale-0"
      )} />
      <Moon className={cn(
        "absolute h-5 w-5 rotate-90 scale-0 transition-all",
        theme === 'dark' && "rotate-0 scale-100"
      )} />
      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}

