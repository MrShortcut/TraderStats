import { useEffect } from 'react'
import Papa from 'papaparse'
import {
  CsvCleanedTradeHistoryReport,
  RawCsvRow,
  useContextSignals
} from '@/context'


export const useFetchDataCSV = (URL: string) => {
  const { positions, tradeHistoryReport } = useContextSignals()

  useEffect(() => {
    fetch(URL)
      .then((res) => res.text())
      .then((csvText) => {
        const lines = csvText.split('\n')

        // ✅ Buscamos el encabezado del reporte
        const reportStart = lines.findIndex((l) =>
          l.toLowerCase().includes('trade history report')
        )

        // Tomamos las líneas que componen la cabecera (típicamente 5 o 6)
        const headerLines = lines.slice(reportStart, reportStart + 6)

        // 🧹 Función utilitaria para limpiar strings
        const cleanText = (text?: string) =>
          text
            ?.replace(/\r/g, '')           // elimina retornos de carro
            .replace(/"/g, '')             // elimina comillas
            .replace(/\s+/g, ' ')          // reemplaza múltiples espacios por uno
            .trim()                        // elimina espacios al inicio y final
          ?? ''


        // 🔹 Parseamos línea por línea
        for (const line of headerLines) {
          const [ label, , , value ] = line.split(',')

          if (line.toLowerCase().includes('trade history report')) {
            CsvCleanedTradeHistoryReport.title = 'Trade History Report'
          }
          if (line.toLowerCase().startsWith('name')) {
            CsvCleanedTradeHistoryReport.name = cleanText(value)
          }
          if (line.toLowerCase().startsWith('account')) {
            CsvCleanedTradeHistoryReport.account = cleanText(value)
          }
          if (line.toLowerCase().startsWith('company')) {
            CsvCleanedTradeHistoryReport.company = cleanText(value)
          }
          if (line.toLowerCase().startsWith('date')) {
            CsvCleanedTradeHistoryReport.date = cleanText(value)
          }
        }

        console.log({ CsvCleanedTradeHistoryReport })

        // ✅ Guardamos en el signal correspondiente
        tradeHistoryReport.set(CsvCleanedTradeHistoryReport)

        console.log({ lines })

        const startIndex = lines.findIndex((l) =>
          l.toLowerCase().includes('positions')
        )
        const endIndex = lines.findIndex((l) =>
          l.toLowerCase().includes('orders')
        )
        const positionsSection =
          startIndex !== -1 && endIndex !== -1
            ? lines.slice(startIndex + 1, endIndex)
            : lines

        const parsedPositions = Papa.parse<RawCsvRow>(positionsSection.join('\n'), { header: true })
        console.log({ parsedPositions })

        const rowsPositions = parsedPositions.data.filter((r) => r.Symbol && r.Profit)
        console.log({ rowsPositions })

        const CsvCleanedPositions = rowsPositions.map((r) => ({
          time: r.Time?.trim(),
          symbol: r.Symbol?.trim(),
          type: r.Type?.trim(),
          profit: parseFloat(String(r.Profit || '')
            .replace(',', '.')          // convierte 75,90 → 75.90
            .replace(/[^0-9.-]/g, '')   // elimina cualquier símbolo restante
          ) || 0,
        }))

        positions.set(CsvCleanedPositions)

      })
      .catch((err) => console.error('Error leyendo CSV:', err))
  }, [ URL ])
}