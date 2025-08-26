import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  Palette,
  MousePointer,
  Keyboard,
  Accessibility,
  Settings,
  Focus,
  Contrast
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: number;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  soundEffects: boolean;
  colorBlindSupport: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
}

// Skip to Content Link
export const SkipToContent: React.FC<{ targetId: string }> = ({ targetId }) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium transition-all"
      onFocus={(e) => e.currentTarget.scrollIntoView()}
    >
      Aller au contenu principal
    </a>
  );
};

// Live Region for Screen Readers
export const LiveRegion: React.FC<{ 
  message: string; 
  priority?: 'polite' | 'assertive';
  className?: string;
}> = ({ message, priority = 'polite', className }) => {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className={cn("sr-only", className)}
    >
      {message}
    </div>
  );
};

// Focus Trap for Modals
export const FocusTrap: React.FC<{ 
  children: React.ReactNode;
  isActive: boolean;
}> = ({ children, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    firstFocusableRef.current = focusableElements[0] as HTMLElement;
    lastFocusableRef.current = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableRef.current) {
          e.preventDefault();
          lastFocusableRef.current?.focus();
        }
      } else {
        if (document.activeElement === lastFocusableRef.current) {
          e.preventDefault();
          firstFocusableRef.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstFocusableRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};

// Accessibility Control Panel
export const AccessibilityPanel: React.FC = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    fontSize: 100,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    soundEffects: true,
    colorBlindSupport: 'none'
  });

  const [isOpen, setIsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState('');

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Font size
    root.style.fontSize = `${settings.fontSize}%`;

    // Color blind support
    root.setAttribute('data-colorblind-filter', settings.colorBlindSupport);

    // Focus indicators
    if (settings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setAnnouncements(`${key} ${value ? 'activé' : 'désactivé'}`);
  };

  const resetSettings = () => {
    setSettings({
      highContrast: false,
      reducedMotion: false,
      fontSize: 100,
      screenReader: false,
      keyboardNavigation: true,
      focusIndicators: true,
      soundEffects: true,
      colorBlindSupport: 'none'
    });
    setAnnouncements('Paramètres d\'accessibilité réinitialisés');
  };

  return (
    <>
      {/* Accessibility Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full p-0 shadow-lg"
        aria-label="Ouvrir les paramètres d'accessibilité"
      >
        <Accessibility className="h-5 w-5" />
      </Button>

      {/* Live Region for Announcements */}
      <LiveRegion message={announcements} />

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <FocusTrap isActive={isOpen}>
            <div className="fixed right-4 top-4 bottom-4 w-96 max-w-[calc(100vw-2rem)]">
              <Card className="h-full flex flex-col shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Accessibility className="h-5 w-5" />
                      Accessibilité
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      aria-label="Fermer les paramètres d'accessibilité"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto space-y-6">
                  {/* Visual Settings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Paramètres Visuels
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label htmlFor="high-contrast" className="text-sm font-medium">
                          Contraste élevé
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Améliore la lisibilité du texte
                        </p>
                      </div>
                      <Switch
                        id="high-contrast"
                        checked={settings.highContrast}
                        onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="font-size" className="text-sm font-medium">
                        Taille de police: {settings.fontSize}%
                      </label>
                      <Slider
                        id="font-size"
                        value={[settings.fontSize]}
                        onValueChange={([value]) => updateSetting('fontSize', value)}
                        min={75}
                        max={150}
                        step={25}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Support daltonisme</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'none', label: 'Aucun' },
                          { value: 'deuteranopia', label: 'Deutéranopie' },
                          { value: 'protanopia', label: 'Protanopie' },
                          { value: 'tritanopia', label: 'Tritanopie' }
                        ].map((option) => (
                          <Button
                            key={option.value}
                            variant={settings.colorBlindSupport === option.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateSetting('colorBlindSupport', option.value as any)}
                            className="text-xs"
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Motion Settings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MousePointer className="h-4 w-4" />
                      Mouvement et Interaction
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label htmlFor="reduced-motion" className="text-sm font-medium">
                          Réduire les animations
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Minimise les mouvements à l'écran
                        </p>
                      </div>
                      <Switch
                        id="reduced-motion"
                        checked={settings.reducedMotion}
                        onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label htmlFor="focus-indicators" className="text-sm font-medium">
                          Indicateurs de focus améliorés
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Contours plus visibles pour la navigation clavier
                        </p>
                      </div>
                      <Switch
                        id="focus-indicators"
                        checked={settings.focusIndicators}
                        onCheckedChange={(checked) => updateSetting('focusIndicators', checked)}
                      />
                    </div>
                  </div>

                  {/* Audio Settings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Audio
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label htmlFor="sound-effects" className="text-sm font-medium">
                          Effets sonores
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Sons de notification et de feedback
                        </p>
                      </div>
                      <Switch
                        id="sound-effects"
                        checked={settings.soundEffects}
                        onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
                      />
                    </div>
                  </div>

                  {/* Navigation Settings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Keyboard className="h-4 w-4" />
                      Navigation
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label htmlFor="keyboard-nav" className="text-sm font-medium">
                          Navigation clavier optimisée
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Améliore l'expérience de navigation au clavier
                        </p>
                      </div>
                      <Switch
                        id="keyboard-nav"
                        checked={settings.keyboardNavigation}
                        onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                      />
                    </div>
                  </div>

                  {/* Reset Button */}
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={resetSettings}
                      className="w-full"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Réinitialiser les paramètres
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </FocusTrap>
        </div>
      )}
    </>
  );
};

// Enhanced Form Field with Accessibility
interface AccessibleFormFieldProps {
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string;
  description?: string;
  required?: boolean;
}

export const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  id,
  label,
  children,
  error,
  description,
  required = false
}) => {
  const describedBy = [];
  if (description) describedBy.push(`${id}-description`);
  if (error) describedBy.push(`${id}-error`);

  return (
    <div className="space-y-2">
      <label 
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="text-destructive ml-1" aria-label="requis">*</span>}
      </label>
      
      {description && (
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      <div>
        {React.cloneElement(children as React.ReactElement, {
          id,
          'aria-describedby': describedBy.length > 0 ? describedBy.join(' ') : undefined,
          'aria-invalid': error ? 'true' : undefined,
          'aria-required': required
        })}
      </div>
      
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};