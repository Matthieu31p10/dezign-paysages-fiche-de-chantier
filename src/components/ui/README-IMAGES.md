# Guide d'optimisation des images

## Composant OptimizedImage

Utilisez le composant `OptimizedImage` au lieu de `<img>` pour bénéficier de :
- Lazy loading automatique
- Support WebP avec fallback
- Effet de blur pendant le chargement
- Gestion d'erreurs avec fallback

### Utilisation basique

```tsx
import { OptimizedImage } from '@/components/ui/optimized-image';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description de l'image"
  className="w-full h-auto"
/>
```

### Avec WebP

```tsx
<OptimizedImage
  src="/path/to/image.jpg"
  webpSrc="/path/to/image.webp"
  alt="Description"
  className="rounded-lg"
/>
```

### Avec fallback

```tsx
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  fallback="/path/to/placeholder.jpg"
  blur={true}
/>
```

### Images prioritaires (au-dessus de la ligne de flottaison)

```tsx
<OptimizedImage
  src="/hero-image.jpg"
  alt="Hero"
  priority={true}
  className="w-full"
/>
```

## Hook useImageOptimization

Optimisez les images avant de les uploader :

```tsx
import { useImageOptimization } from '@/hooks/useImageOptimization';

function UploadComponent() {
  const { optimizeImage, isCompressing, webPSupported } = useImageOptimization({
    autoCompress: true,
    autoWebP: true,
    compressionOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { original, compressed, webp } = await optimizeImage(file);
    
    // Utiliser la version optimisée
    const finalFile = webp || compressed || original;
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {isCompressing && <p>Optimisation en cours...</p>}
      {webPSupported && <p>WebP supporté ✓</p>}
    </div>
  );
}
```

## Utilitaires d'optimisation

### Compresser une image

```tsx
import { compressImage } from '@/utils/imageOptimization';

const compressed = await compressImage(file, {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  format: 'jpeg'
});
```

### Convertir en WebP

```tsx
import { convertToWebP } from '@/utils/imageOptimization';

const webp = await convertToWebP(file, 0.85);
```

### Précharger des images

```tsx
import { preloadImages } from '@/utils/imageOptimization';

await preloadImages([
  '/image1.jpg',
  '/image2.jpg',
  '/image3.jpg'
]);
```

### Vérifier le support WebP

```tsx
import { supportsWebP } from '@/utils/imageOptimization';

const isSupported = await supportsWebP();
```

## Bonnes pratiques

### 1. Lazy loading par défaut
Toutes les images sous la ligne de flottaison doivent utiliser le lazy loading :
```tsx
<OptimizedImage src="..." alt="..." />
```

### 2. Priority pour les images critiques
Images au-dessus de la ligne de flottaison :
```tsx
<OptimizedImage src="..." alt="..." priority={true} />
```

### 3. Toujours fournir un alt
```tsx
<OptimizedImage src="..." alt="Description significative" />
```

### 4. Utiliser WebP quand possible
```tsx
<OptimizedImage 
  src="/image.jpg" 
  webpSrc="/image.webp" 
  alt="..." 
/>
```

### 5. Optimiser avant upload
```tsx
const { optimizeImage } = useImageOptimization();
const optimized = await optimizeImage(file);
// Upload optimized.webp ou optimized.compressed
```

### 6. Dimensions appropriées
Ne pas uploader d'images plus grandes que nécessaire :
- Hero images : 1920x1080 max
- Thumbnails : 400x400 max
- Avatars : 200x200 max
- Logos : 300x300 max

## Performance

### Avant optimisation
- Image originale : 5MB
- Temps de chargement : ~3s
- Lazy loading : Non
- Format : JPEG

### Après optimisation
- Image compressée : 300KB (WebP)
- Temps de chargement : ~200ms
- Lazy loading : Oui
- Format : WebP avec fallback JPEG

### Gains
- 94% de réduction de taille
- 15x plus rapide
- Meilleure expérience utilisateur
