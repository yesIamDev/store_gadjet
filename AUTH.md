# Documentation d'Authentification

## Structure

L'authentification est implémentée avec une architecture professionnelle et modulaire :

### 📁 Structure des fichiers

```
frontend/
├── lib/
│   ├── api/
│   │   ├── client.ts          # Client API avec gestion des tokens
│   │   ├── auth.ts            # Service d'authentification
│   │   ├── config.ts          # Configuration API
│   │   └── types.ts           # Types TypeScript
│   └── validations/
│       └── auth.ts             # Schémas de validation Zod
├── store/
│   └── authStore.ts           # Store Zustand pour l'état d'authentification
├── components/
│   └── auth/
│       ├── LoginForm.tsx       # Formulaire de connexion
│       ├── SignupForm.tsx      # Formulaire d'inscription
│       ├── AuthProvider.tsx    # Provider pour initialiser l'auth
│       └── UserMenu.tsx        # Menu utilisateur
└── app/
    ├── login/
    │   └── page.tsx            # Page de connexion
    └── signup/
        └── page.tsx            # Page d'inscription
```

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du frontend :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Utilisation

### 1. Store d'authentification

Le store Zustand gère l'état global de l'authentification :

```tsx
import { useAuthStore } from '@/store/authStore'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore()
  
  // Utiliser l'état
  if (isAuthenticated) {
    return <div>Bonjour {user?.username}</div>
  }
  
  // Actions
  const handleLogin = async () => {
    try {
      await login({ username: 'user', password: 'password' })
    } catch (error) {
      console.error(error)
    }
  }
}
```

### 2. Composants de formulaire

Les formulaires utilisent react-hook-form avec validation Zod :

```tsx
import { LoginForm } from '@/components/auth/LoginForm'

// Dans votre page
<LoginForm />
```

### 3. Menu utilisateur

Le composant `UserMenu` affiche automatiquement les boutons de connexion/inscription ou le menu utilisateur selon l'état d'authentification :

```tsx
import { UserMenu } from '@/components/auth/UserMenu'

function Header() {
  return (
    <header>
      <UserMenu />
    </header>
  )
}
```

### 4. Protection de routes

Pour protéger une route, vérifiez l'état d'authentification :

```tsx
'use client'

import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedPage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return <div>Contenu protégé</div>
}
```

## API Backend

### Endpoints

- **POST** `/auth/login` - Connexion
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

- **POST** `/auth/register` - Inscription
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### Réponse

```json
{
  "accessToken": "string",
  "user": {
    "id": "string",
    "username": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

## Validation

### Login
- Username : 3-20 caractères, alphanumériques et underscores uniquement
- Password : 1-100 caractères

### Register
- Username : 3-20 caractères, alphanumériques et underscores uniquement
- Password : 8-100 caractères, doit contenir au moins :
  - Une minuscule
  - Une majuscule
  - Un chiffre
- ConfirmPassword : doit correspondre au mot de passe

## Stockage

Le token JWT et les informations utilisateur sont stockés dans :
- `localStorage` : `auth_token` et `user`
- Zustand persist : synchronisation automatique avec le store

## Sécurité

- Les tokens sont automatiquement ajoutés aux requêtes API via le client
- Le token est stocké dans le localStorage (considérez httpOnly cookies pour la production)
- Validation côté client et serveur
- Gestion des erreurs avec messages utilisateur
