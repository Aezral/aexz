"use client"

import { ThemeProvider } from 'next-themes'
import React from 'react'

interface CustomThemeProviderProps {
    children: React.ReactNode
}
export default function CustomThemeProvider({children}: CustomThemeProviderProps) {
  
  return (
    <ThemeProvider storageKey='theme' attribute='class' defaultTheme='system' enableSystem={false}>{children}</ThemeProvider>
  )
}
