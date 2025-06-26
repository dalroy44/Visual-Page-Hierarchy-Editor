import { createContext } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeType {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeType | undefined>(
  undefined
)
