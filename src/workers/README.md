# Web Workers - Guide d'utilisation

## Vue d'ensemble

Les Web Workers permettent d'exécuter des calculs lourds en arrière-plan sans bloquer le thread principal de l'interface utilisateur.

## Workers disponibles

### 1. timeCalculations.worker.ts
Gère les calculs de temps complexes :
- Calcul des heures totales (départ, arrivée, fin, pause)
- Calcul des écarts de temps par rapport aux durées prévues
- Calcul des heures d'équipe

### 2. dataAnalysis.worker.ts
Gère l'analyse de données :
- Statistiques de projets (heures totales, visites, moyennes)
- Filtrage et tri de projets
- Calculs d'agrégats (totaux mensuels, moyennes globales)

## Hooks disponibles

### useTimeCalculationWorker
```tsx
import { useTimeCalculationWorker } from '@/hooks/useTimeCalculationWorker';

function MyComponent() {
  const { 
    calculateTotalHours, 
    result, 
    isCalculating, 
    isReady 
  } = useTimeCalculationWorker();

  useEffect(() => {
    if (isReady) {
      calculateTotalHours('08:00', '09:00', '17:00', '01:00', 2);
    }
  }, [isReady]);

  useEffect(() => {
    if (result) {
      console.log('Heures totales:', result.totalHours);
      console.log('Heures équipe:', result.totalTeamHours);
    }
  }, [result]);
}
```

### useDataAnalysisWorker
```tsx
import { useDataAnalysisWorker } from '@/hooks/useDataAnalysisWorker';

function MyComponent() {
  const { 
    analyzeProjectStats, 
    filterAndSortProjects,
    result, 
    isAnalyzing 
  } = useDataAnalysisWorker();

  useEffect(() => {
    analyzeProjectStats(workLogs, projectId);
  }, [workLogs, projectId]);

  useEffect(() => {
    if (result) {
      console.log('Stats:', result);
    }
  }, [result]);
}
```

## Quand utiliser les Workers ?

✅ **Utiliser un worker quand :**
- Calculs sur plus de 100 éléments
- Opérations répétées (filtrage en temps réel)
- Calculs complexes (statistiques, agrégations)
- Interface doit rester réactive pendant le calcul

❌ **Ne pas utiliser de worker pour :**
- Calculs simples et rapides
- Petits ensembles de données (< 50 éléments)
- Opérations ponctuelles non critiques

## Performance

Les workers ajoutent un léger overhead de communication. Utilisez-les uniquement pour des opérations qui prennent plus de ~50ms sur le thread principal.

## Migration progressive

Les anciens utils (`src/utils/time.ts`, `src/utils/workLogUtils.ts`) restent disponibles pour la compatibilité. Migrez progressivement vers les workers pour les composants avec des besoins de performance.
