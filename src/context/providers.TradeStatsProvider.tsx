import { CreateFastContext } from 'cheatmodes4'

export interface RawCsvRow {
  Time?: string
  Symbol?: string
  Type?: string
  Profit?: string | number
}
export interface PositionsShape {
  time?: string
  symbol?: string
  type?: string
  profit?: number
}

export const PositionsShape: PositionsShape = {
  time: 'time',
  symbol: 'symbol',
  type: 'string',
  profit: 12,
}

export interface TradeHistoryReport {
  title: string
  name: string
  account: string
  company: string
  date: string
}

export interface TradeHistoryReport {
  title: string
  name: string
  account: string
  company: string
  date: string
}

export const CsvCleanedTradeHistoryReport: TradeHistoryReport = {
  title: '',
  name: '',
  account: '',
  company: '',
  date: ''
}

export const tradeHistoryReport = CsvCleanedTradeHistoryReport


/** The important thing it's @example */
export const {
  Provider: TradeStatsProvider,
  useStore: useTradeStatsContext,
  useContextSignals
} = CreateFastContext({
  cheatMode: '@CheatModes4',
  positions: [ PositionsShape ],
  tradeHistoryReport
})

