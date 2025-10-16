import { useEffect } from 'react'
import Papa from 'papaparse'
import { useContextSignals } from '@/context'

export const useFetchDataCSV = (URL: string) => {
  const { csvData } = useContextSignals()

  useEffect(() => {
    fetch(URL)
      .then((res) => res.text())
      .then((csvText) => {
        const lines = csvText.split('\n')
        const startIndex = lines.findIndex((l) =>
          l.toLowerCase().includes('positions')
        )
        const endIndex = lines.findIndex((l) =>
          l.toLowerCase().includes('orders')
        )
        const section =
          startIndex !== -1 && endIndex !== -1
            ? lines.slice(startIndex + 1, endIndex)
            : lines

        const parsed = Papa.parse(section.join('\n'), { header: true })
        console.log({ parsed })
        const rows = parsed.data.filter((r) => r.Symbol && r.Profit)
        console.log({ rows })

        const clean = rows.map((r) => ({
          time: r.Time?.trim(),
          symbol: r.Symbol?.trim(),
          type: r.Type?.trim(),
          profit: parseFloat(String(r.Profit || '')
            .replace(',', '.')          // convierte 75,90 → 75.90
            .replace(/[^0-9.-]/g, '')   // elimina cualquier símbolo restante
          ) || 0,
        }))
        console.log({ clean })

        csvData.set(clean)
      })
      .catch((err) => console.error('Error leyendo CSV:', err))
  }, [ URL ])
}