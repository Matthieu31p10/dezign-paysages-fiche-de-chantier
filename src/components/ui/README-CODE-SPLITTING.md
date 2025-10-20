# Code Splitting & Lazy Loading

Comprehensive utilities for optimizing bundle size and load times through code splitting and lazy loading.

## 📦 What's Included

### Core Utilities
- **lazyLoad.ts**: Dynamic import utilities with retry logic
- **lazy-component.tsx**: React components for lazy loading with error boundaries
- **suspense-wrapper.tsx**: Configurable Suspense boundaries
- **usePreloadRoute.ts**: Hooks for intelligent route preloading

## 🚀 Quick Start

### Basic Lazy Loading

```tsx
import { lazyLoadWithRetry } from '@/utils/lazyLoad';
import { LazyComponent } from '@/components/ui/lazy-component';

// Lazy load a component
const Dashboard = lazyLoadWithRetry(() => import('@/pages/Dashboard'));

// Use it with error boundary and loading state
function App() {
  return (
    <LazyComponent>
      <Dashboard />
    </LazyComponent>
  );
}
```

### Route-Based Code Splitting

```tsx
import { lazyLoadRoute } from '@/utils/lazyLoad';
import { RouteLoader } from '@/components/ui/suspense-wrapper';
import { Suspense } from 'react';

// Lazy load routes
const Dashboard = lazyLoadRoute(() => import('@/pages/Dashboard'));
const Settings = lazyLoadRoute(() => import('@/pages/Settings'));
const Reports = lazyLoadRoute(() => import('@/pages/Reports'), true); // Preload

// In your router
<Routes>
  <Route path="/dashboard" element={
    <Suspense fallback={<RouteLoader />}>
      <Dashboard />
    </Suspense>
  } />
  <Route path="/settings" element={
    <Suspense fallback={<RouteLoader />}>
      <Settings />
    </Suspense>
  } />
</Routes>
```

## 🎯 Advanced Features

### 1. Preloading Routes

```tsx
import { usePreloadRoute, usePreloadOnIdle } from '@/hooks/usePreloadRoute';

function Navigation() {
  // Preload on hover
  const { prefetchOnInteractionRef } = usePreloadRoute(
    () => import('@/pages/Dashboard'),
    { onHover: true }
  );

  return (
    <nav>
      <a href="/dashboard" ref={prefetchOnInteractionRef}>
        Dashboard
      </a>
    </nav>
  );
}

// Preload during idle time
function App() {
  usePreloadOnIdle(() => import('@/pages/Settings'));
  
  return <div>...</div>;
}
```

### 2. Multiple Loading States

```tsx
import { SuspenseWrapper } from '@/components/ui/suspense-wrapper';

// Default spinner
<SuspenseWrapper>
  <LazyComponent />
</SuspenseWrapper>

// Card with loading state
<SuspenseWrapper variant="card">
  <LazyComponent />
</SuspenseWrapper>

// Skeleton loader
<SuspenseWrapper variant="skeleton">
  <LazyComponent />
</SuspenseWrapper>

// Inline loader
<SuspenseWrapper variant="inline">
  <LazyComponent />
</SuspenseWrapper>
```

### 3. Error Handling with Retry

```tsx
import { lazyLoadWithRetry } from '@/utils/lazyLoad';

// Automatic retry on failure (3 attempts by default)
const MyComponent = lazyLoadWithRetry(
  () => import('@/components/MyComponent'),
  { retries: 3, retryDelay: 1000 }
);
```

### 4. Component-Specific Loaders

```tsx
import { 
  RouteLoader, 
  ModalLoader, 
  TabLoader, 
  ChartLoader 
} from '@/components/ui/suspense-wrapper';

// Route loading
<Suspense fallback={<RouteLoader />}>
  <RoutePage />
</Suspense>

// Modal loading
<Dialog>
  <Suspense fallback={<ModalLoader />}>
    <LazyModalContent />
  </Suspense>
</Dialog>

// Tab loading
<Tabs>
  <TabContent>
    <Suspense fallback={<TabLoader />}>
      <LazyTabPanel />
    </Suspense>
  </TabContent>
</Tabs>

// Chart loading
<Suspense fallback={<ChartLoader />}>
  <LazyChart />
</Suspense>
```

## 📊 Real-World Examples

### Example 1: Feature-Based Code Splitting

```tsx
// Split by features instead of routes
const WorkLogForm = lazyLoadWithRetry(() => 
  import('@/components/worklogs/WorkLogForm')
);
const ProjectDetails = lazyLoadWithRetry(() => 
  import('@/components/projects/ProjectDetails')
);
const TeamSchedule = lazyLoadWithRetry(() => 
  import('@/components/schedule/TeamSchedule')
);

function Dashboard() {
  const [activeView, setActiveView] = useState('worklogs');

  return (
    <div>
      <LazyComponent>
        {activeView === 'worklogs' && <WorkLogForm />}
        {activeView === 'projects' && <ProjectDetails />}
        {activeView === 'schedule' && <TeamSchedule />}
      </LazyComponent>
    </div>
  );
}
```

### Example 2: Modal Code Splitting

```tsx
import { LazyComponent } from '@/components/ui/lazy-component';
import { ModalLoader } from '@/components/ui/suspense-wrapper';

const EditProjectModal = lazyLoadWithRetry(() => 
  import('@/components/modals/EditProjectModal')
);

function ProjectList() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Edit Project
      </button>
      
      {showModal && (
        <Dialog>
          <LazyComponent fallback={<ModalLoader />}>
            <EditProjectModal />
          </LazyComponent>
        </Dialog>
      )}
    </>
  );
}
```

### Example 3: Preload Critical Routes

```tsx
import { usePreloadRoutes } from '@/hooks/usePreloadRoute';

function App() {
  // Preload critical routes after initial render
  usePreloadRoutes([
    () => import('@/pages/Dashboard'),
    () => import('@/pages/Projects'),
    () => import('@/pages/WorkLogs')
  ], { delay: 1000 }); // Wait 1s after mount

  return <Router>...</Router>;
}
```

### Example 4: Heavy Chart Components

```tsx
import { lazyLoadWithRetry } from '@/utils/lazyLoad';
import { ChartLoader } from '@/components/ui/suspense-wrapper';
import { Suspense } from 'react';

// Split heavy charting libraries
const PassageCharts = lazyLoadWithRetry(() => 
  import('@/components/passages/PassageCharts')
);
const OverviewCharts = lazyLoadWithRetry(() => 
  import('@/components/dashboard/OverviewCharts')
);

function Analytics() {
  return (
    <div>
      <Suspense fallback={<ChartLoader />}>
        <PassageCharts passages={data} />
      </Suspense>
      
      <Suspense fallback={<ChartLoader />}>
        <OverviewCharts projects={projects} />
      </Suspense>
    </div>
  );
}
```

## 🎨 Custom Loading States

```tsx
import { LazyComponent } from '@/components/ui/lazy-component';

// Custom loading fallback
const CustomLoader = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="text-center">
      <div className="animate-pulse text-4xl mb-4">⏳</div>
      <p>Loading amazing content...</p>
    </div>
  </div>
);

function MyPage() {
  return (
    <LazyComponent fallback={<CustomLoader />}>
      <HeavyComponent />
    </LazyComponent>
  );
}
```

## ⚡ Performance Best Practices

### 1. Split by Route
```tsx
// ✅ Good - Each route is a separate chunk
const Home = lazyLoadRoute(() => import('@/pages/Home'));
const About = lazyLoadRoute(() => import('@/pages/About'));
const Contact = lazyLoadRoute(() => import('@/pages/Contact'));
```

### 2. Split Heavy Dependencies
```tsx
// ✅ Good - Charts loaded only when needed
const Charts = lazyLoadWithRetry(() => import('@/components/Charts'));

// ❌ Bad - Everything loaded upfront
import Charts from '@/components/Charts';
```

### 3. Preload on Interaction
```tsx
// ✅ Good - Preload before navigation
const { prefetchOnInteractionRef } = usePreloadRoute(
  () => import('@/pages/Dashboard'),
  { onHover: true }
);

<Link to="/dashboard" ref={prefetchOnInteractionRef}>
  Dashboard
</Link>
```

### 4. Use Appropriate Loaders
```tsx
// ✅ Good - Specific loader for context
<Suspense fallback={<RouteLoader />}>
  <FullPage />
</Suspense>

<Suspense fallback={<ModalLoader />}>
  <SmallModal />
</Suspense>

// ❌ Bad - Generic loader everywhere
<Suspense fallback={<div>Loading...</div>}>
  ...
</Suspense>
```

## 📈 Expected Performance Gains

- **Initial bundle size**: ↓ 40-60% (routes + features split)
- **Time to Interactive**: ↓ 30-50% (less JS to parse)
- **Page navigation**: ↓ 20-40% (with preloading)
- **Memory usage**: ↓ 25-35% (components loaded on demand)

## 🔍 Monitoring

Track code splitting effectiveness:

```tsx
// Monitor chunk load times
import { lazyLoadWithRetry } from '@/utils/lazyLoad';

const MyComponent = lazyLoadWithRetry(
  () => {
    const start = performance.now();
    return import('@/components/MyComponent').then(module => {
      const duration = performance.now() - start;
      console.log(`Loaded MyComponent in ${duration}ms`);
      return module;
    });
  }
);
```

## 🚨 Common Pitfalls

### ❌ Don't Over-Split
```tsx
// Too granular - creates too many chunks
const Button = lazy(() => import('./Button'));
const Text = lazy(() => import('./Text'));
```

### ✅ Split Meaningfully
```tsx
// Feature-based splitting
const UserProfile = lazy(() => import('./features/UserProfile'));
const AdminPanel = lazy(() => import('./features/AdminPanel'));
```

### ❌ Don't Forget Error Boundaries
```tsx
// Missing error handling
<Suspense fallback={<Loader />}>
  <LazyComponent /> {/* What if this fails? */}
</Suspense>
```

### ✅ Always Handle Errors
```tsx
// Proper error handling
<LazyComponent fallback={<Loader />}>
  <LazyComponentContent />
</LazyComponent>
```

## 🔗 Integration with Other Optimizations

Combine with other performance techniques:

```tsx
// Code splitting + Virtual scrolling
const VirtualList = lazyLoadWithRetry(() => 
  import('@/components/ui/virtual-list')
);

// Code splitting + Web Workers
const DataAnalysis = lazyLoadWithRetry(() => 
  import('@/components/DataAnalysis')
);

// Code splitting + Image optimization
const Gallery = lazyLoadWithRetry(() => 
  import('@/components/Gallery')
);
```
