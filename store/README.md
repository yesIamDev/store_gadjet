# Store Zustand

Ce dossier contient les stores Zustand pour la gestion de l'état global de l'application.

## Structure recommandée

- `index.ts` - Store principal de l'application
- `authStore.ts` - Store pour l'authentification
- `cartStore.ts` - Store pour le panier
- `uiStore.ts` - Store pour l'état de l'interface utilisateur

## Exemple d'utilisation

```tsx
import { useAppStore } from '@/store'

function MyComponent() {
  const { count, increment, decrement } = useAppStore()
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
}
```
