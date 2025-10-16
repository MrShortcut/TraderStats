import './App.css'
import { useEffect } from 'react'
import { useCvContext } from '@context'
import { DataMT5, Header } from '@components'
import { useHandleClouds } from '@hooks'
import { useContextSignals } from '@context'

export default function App () {
  const [ isShowing, set ] = useCvContext(s => s.isShowing)
  const [ isPrinting, ] = useCvContext(s => s.isPrinting)
  useHandleClouds()

  const {
    cheatMode
   } = useContextSignals()

  useEffect(() => {
    if (!isShowing) {
      const timer = setTimeout(() => set({ 'isShowing': true }), 1300)
      return () => clearTimeout(timer);
    }
  }, [ isShowing, set ])

  return <div className='bg-charlie-brown rounded-lg'>
    {!isPrinting && <Header />}
    {cheatMode.get}
    <DataMT5 />
  </div>
}
