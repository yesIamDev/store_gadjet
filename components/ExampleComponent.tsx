'use client'

import { motion } from 'framer-motion'
import { FaReact, FaHeart } from 'react-icons/fa'
import { useAppStore } from '@/store'

export function ExampleComponent() {
  const { count, increment, decrement, reset } = useAppStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-6 p-8 rounded-lg bg-card border border-border shadow-lg"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center gap-2 text-2xl font-bold text-primary"
      >
        <FaReact className="text-blue-500" />
        <span>Exemple de Stack</span>
      </motion.div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={decrement}
          className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground font-semibold transition-colors hover:bg-destructive/90"
        >
          -
        </motion.button>

        <motion.div
          key={count}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold text-foreground min-w-[60px] text-center"
        >
          {count}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={increment}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold transition-colors hover:bg-primary/90"
        >
          +
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={reset}
        className="px-6 py-2 rounded-md bg-secondary text-secondary-foreground font-semibold transition-colors hover:bg-secondary/80"
      >
        Réinitialiser
      </motion.button>

      <div className="flex items-center gap-2 text-muted-foreground">
        <FaHeart className="text-red-500" />
        <span className="text-sm">Fait avec Framer Motion, Zustand & React Icons</span>
      </div>
    </motion.div>
  )
}
