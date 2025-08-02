import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { VirtualList } from '@/components/ui/virtual-list';
import { usePerformance } from '@/context/PerformanceContext';
import { useListOptimization, usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { useDataCache } from '@/hooks/useDataCache';
import { Clock, Database, Cpu, BarChart3, Zap, RefreshCw } from 'lucide-react';

interface DemoItem {
  id: string;
  name: string;
  value: number;
  category: string;
}

const PerformanceDemoSection = () => {
  const { metrics, settings, clearCache, resetMetrics, updateSettings } = usePerformance();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Génération de données de démonstration
  const generateDemoData = useMemo(() => 
    Array.from({ length: 10000 }, (_, i) => ({
      id: `item-${i}`,
      name: `Element ${i + 1}`,
      value: Math.floor(Math.random() * 1000),
      category: ['Type A', 'Type B', 'Type C'][i % 3]
    }))
  , []);

  // Optimisation de liste avec recherche et pagination
  const {
    items: optimizedItems,
    stats,
    navigation
  } = useListOptimization(generateDemoData, {
    pageSize: 100,
    searchTerm,
    searchFields: ['name', 'category'],
    sortBy: 'value',
    sortOrder: 'desc'
  });

  // Cache de données simulé
  const {
    data: cachedData,
    loading: cacheLoading,
    refresh: refreshCache
  } = useDataCache(
    'demo-expensive-operation',
    async () => {
      setIsLoadingData(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoadingData(false);
      return {
        computation: Math.random() * 1000,
        timestamp: Date.now(),
        processedItems: generateDemoData.length
      };
    },
    { ttl: 10000 } // 10 secondes
  );

  // Opération coûteuse optimisée
  const { optimizedOperation: optimizedSearch } = usePerformanceOptimization(
    (term: string) => {
      // Simulation d'une recherche coûteuse
      return generateDemoData.filter(item => 
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        item.category.toLowerCase().includes(term.toLowerCase())
      );
    },
    [generateDemoData],
    { enableDebounce: true, debounceDelay: 300 }
  );

  const handleExpensiveOperation = async () => {
    setIsLoadingData(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const results = optimizedSearch(searchTerm) as DemoItem[];
    console.log(`Recherche terminée: ${results.length} résultats`);
    setIsLoadingData(false);
  };

  const renderVirtualItem = (item: DemoItem, index: number) => (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center gap-3">
        <Badge variant="outline">{item.category}</Badge>
        <span className="font-medium">{item.name}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        Valeur: {item.value}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Métriques de performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Métriques de performance
          </CardTitle>
          <CardDescription>
            Statistiques de performance en temps réel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-background rounded-lg border">
              <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{metrics.renderCount}</div>
              <div className="text-sm text-muted-foreground">Rendus</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{metrics.averageRenderTime.toFixed(1)}ms</div>
              <div className="text-sm text-muted-foreground">Temps moyen</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <Database className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{metrics.cacheHitRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Taux cache</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <Cpu className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{metrics.cacheSize}</div>
              <div className="text-sm text-muted-foreground">Taille cache</div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetMetrics}
            >
              Réinitialiser métriques
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearCache}
            >
              Vider cache
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => updateSettings({ 
                logPerformance: !settings.logPerformance 
              })}
            >
              {settings.logPerformance ? 'Désactiver' : 'Activer'} logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Démonstration du cache */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache de données
          </CardTitle>
          <CardDescription>
            Démonstration du système de cache avec TTL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cachedData ? (
              <div className="p-4 bg-background rounded-lg border">
                <div className="text-sm text-muted-foreground mb-2">
                  Données en cache (TTL: 10s)
                </div>
                <div className="font-mono text-sm">
                  Computation: {cachedData.computation.toFixed(2)}<br />
                  Timestamp: {new Date(cachedData.timestamp).toLocaleTimeString()}<br />
                  Items traités: {cachedData.processedItems.toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Aucune donnée en cache
                </div>
              </div>
            )}
            
            <Button 
              onClick={refreshCache} 
              disabled={cacheLoading || isLoadingData}
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${(cacheLoading || isLoadingData) ? 'animate-spin' : ''}`} />
              {cacheLoading || isLoadingData ? 'Chargement...' : 'Recharger données (2s)'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste virtualisée optimisée */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Liste virtualisée (10,000 items)
          </CardTitle>
          <CardDescription>
            Recherche débounce et rendu optimisé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Rechercher dans 10,000 éléments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleExpensiveOperation}
                disabled={isLoadingData}
                variant="outline"
              >
                {isLoadingData ? 'Recherche...' : 'Recherche manuelle'}
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {stats.filteredItems.toLocaleString()} résultats trouvés 
              (page {stats.currentPage} sur {stats.totalPages})
            </div>
            
            <div className="border rounded-lg">
              <VirtualList
                items={optimizedItems}
                itemHeight={60}
                containerHeight={300}
                renderItem={renderVirtualItem}
                getItemKey={(item) => item.id}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={navigation.prevPage}
                disabled={!navigation.canGoPrev}
              >
                Précédent
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {stats.currentPage} / {stats.totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={navigation.nextPage}
                disabled={!navigation.canGoNext}
              >
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />
      
      <div className="text-sm text-muted-foreground">
        Cette section démontre les optimisations de performance implémentées :
        debouncing, cache avec TTL, virtualisation de listes, et métriques en temps réel.
      </div>
    </div>
  );
};

export default PerformanceDemoSection;