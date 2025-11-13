import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Hook to set body class based on current route
 * This ensures the correct background images load per page
 */
export function useBodyClass() {
  const location = useLocation()

  useEffect(() => {
    // Map routes to body classes
    const pathToClass: Record<string, string> = {
      '/': 'home',
      '/achievements': '', // No special background, uses default gradient
      '/activities': 'activities',
      '/adopt': 'adopt',
      '/battle': 'battle',
      '/crafting': 'crafting',
      '/familiars': 'familiars',
      '/inventory': 'inventory',
      '/pound': 'pound',
      '/rest': '', // No special background, uses default gradient
      '/shop': 'shop',
      '/training': 'training',
    }

    const bodyClass = pathToClass[location.pathname] || 'home'

    // Remove all previous body classes
    Object.values(pathToClass).forEach(cls => {
      if (cls) document.body.classList.remove(cls)
    })
    
    // Add new class if it exists
    if (bodyClass) {
      document.body.classList.add(bodyClass)
    }

    // Cleanup on unmount
    return () => {
      if (bodyClass) {
        document.body.classList.remove(bodyClass)
      }
    }
  }, [location.pathname])
}
