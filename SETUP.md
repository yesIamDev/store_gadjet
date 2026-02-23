# Configuration du Frontend

Ce projet utilise les technologies suivantes pour le développement frontend :

## Technologies installées

### ✅ Shadcn UI
- **Configuration** : `components.json`
- **Utilitaires** : `lib/utils.ts` (fonction `cn` pour fusionner les classes)
- **Variables CSS** : Configurées dans `app/globals.css`
- **Dossier des composants** : `components/ui/`

**Pour ajouter un composant Shadcn UI :**
```bash
npx shadcn@latest add [nom-du-composant]
```

### ✅ Framer Motion
- **Version** : 12.34.0
- **Usage** : Animations et transitions fluides

**Exemple d'utilisation :**
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Contenu animé
</motion.div>
```

### ✅ Tailwind CSS
- **Version** : 4.x
- **Configuration** : Via `postcss.config.mjs` et `app/globals.css`
- **Variables CSS** : Configurées pour Shadcn UI

### ✅ Zustand
- **Version** : 5.0.11
- **Store principal** : `store/index.ts`
- **Structure recommandée** : Un store par domaine (auth, cart, ui, etc.)

**Exemple d'utilisation :**
```tsx
import { useAppStore } from '@/store'

function MyComponent() {
  const { count, increment } = useAppStore()
  return <button onClick={increment}>Count: {count}</button>
}
```

### ✅ React Icons
- **Version** : 5.5.0
- **Bibliothèques disponibles** : Font Awesome, Material Design, Feather, etc.

**Exemple d'utilisation :**
```tsx
import { FaReact, FaHeart } from 'react-icons/fa'
import { MdHome } from 'react-icons/md'

<FaReact className="text-blue-500" />
```

## Structure du projet

```
frontend/
├── app/                 # Pages Next.js (App Router)
│   ├── globals.css     # Styles globaux avec variables Shadcn UI
│   └── ...
├── components/          # Composants React
│   ├── ui/             # Composants Shadcn UI
│   └── ...
├── lib/                # Utilitaires
│   └── utils.ts        # Fonction cn() pour Tailwind
├── store/              # Stores Zustand
│   └── index.ts        # Store principal
└── ...
```

## Commandes disponibles

```bash
# Développement
pnpm dev

# Build de production
pnpm build

# Démarrer en production
pnpm start

# Linter
pnpm lint
```

## Prochaines étapes

1. **Ajouter des composants Shadcn UI** :
   ```bash
   npx shadcn@latest add button
   npx shadcn@latest add card
   npx shadcn@latest add input
   ```

2. **Créer des stores Zustand supplémentaires** :
   - `store/authStore.ts` pour l'authentification
   - `store/cartStore.ts` pour le panier
   - `store/uiStore.ts` pour l'état de l'UI

3. **Utiliser le composant d'exemple** :
   - Voir `components/ExampleComponent.tsx` pour un exemple complet

## Ressources

- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
