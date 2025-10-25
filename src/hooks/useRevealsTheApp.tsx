import { useCvContext } from '@context'
import { useEffect } from 'react'

export const useRevealsTheApp = () => {
  const [ isShowing, set ] = useCvContext(s => s.isShowing)
  useEffect(() => {
    if (!isShowing) {
      const timer = setTimeout(() => set({ 'isShowing': true }), 1300)
      return () => clearTimeout(timer)
    }
  }, [ isShowing, set ])
}