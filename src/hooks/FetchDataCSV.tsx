import { useEffect } from 'react'
import Papa from 'papaparse'
import { useContextSignals } from '@/context'

export interface RawCsvRow {
  Time?: string
  Symbol?: string
  Type?: string
  Profit?: string | number
}

export const useFetchDataCSV = (URL: string) => {
  const { positions } = useContextSignals()

  useEffect(() => {
    fetch(URL)
      .then((res) => res.text())
      .then((csvText) => {
        console.log({ csvText })
        const lines = csvText.split('\n')
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
        console.log({ CsvCleanedPositions })

        positions.set(CsvCleanedPositions)
      })
      .catch((err) => console.error('Error leyendo CSV:', err))
  }, [ URL ])
}