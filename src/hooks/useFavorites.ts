import { useState, useEffect } from 'react';

export interface FavoriteItem {
  id: string;
  type: 'project' | 'worklog' | 'blank-sheet';
  title: string;
  subtitle?: string;
  addedAt: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('user-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
        localStorage.removeItem('user-favorites');
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('user-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (item: Omit<FavoriteItem, 'addedAt'>) => {
    const favoriteItem: FavoriteItem = {
      ...item,
      addedAt: new Date().toISOString()
    };

    setFavorites(prev => {
      // Remove if already exists, then add to beginning
      const filtered = prev.filter(fav => fav.id !== item.id);
      return [favoriteItem, ...filtered].slice(0, 50); // Limit to 50 favorites
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  const getFavoritesByType = (type: FavoriteItem['type']) => {
    return favorites.filter(fav => fav.type === type);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  // Get most recent favorites
  const getRecentFavorites = (limit = 5) => {
    return favorites
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      .slice(0, limit);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesByType,
    clearFavorites,
    getRecentFavorites,
    favoritesCount: favorites.length
  };
};