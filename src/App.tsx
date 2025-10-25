import './App.css'
import { useCvContext } from '@context'
import {
  Header, TradeHistoryReport,
  SmartCsvDropzone,
  TradeCalendar,
} from '@components'
import { useFetchDataCSV, useHandleClouds, useRevealsTheApp } from '@hooks'

const sheetUrl =
  // /* rm */'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-N61Baocf2PbuKP3nfHATNc-aTTNaD9Mbn_bfA-VOTkKYFAOtUw0bd1LWQcufjUjcC4XrRJrd-N9n/pub?output=csv';
 // /* gm */ 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRRV5_fxsuUfgIhGy5vIinwxKgGTeXxdSce9Tr3WuPgK9Td6EdiiapySOVMHKIIxDb_EYktWpq8m3Fm/pub?output=csv'
/* ftmo */'https://docs.google.com/spreadsheets/d/e/2PACX-1vRsZFQx296H8Z0iTEUt4Z2gi2BXi8ym8baKukPEop0U20Q17brSOmx998Y65tcsjucshDyHnYsG16N0/pub?output=csv'

export default function App () {
  const [ isPrinting, ] = useCvContext(s => s.isPrinting)

  useHandleClouds()
  useFetchDataCSV(sheetUrl)
  useRevealsTheApp()

  return <div className='bg-charlie-brown rounded-lg bg-white dark:bg-lightDark min-h-screen'>
    {!isPrinting && <Header />}
    <SmartCsvDropzone />

    <TradeHistoryReport />

    <TradeCalendar />
  </div>
}
