import { CreateFastContext } from 'cheatmodes4'

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

/** The important thing it's @example */
export const {
  Provider: TradeStatsProvider,
  useStore: useTradeStatsContext,
  useContextSignals
} = CreateFastContext({
  cheatMode: '@CheatModes4',
  positions: [ PositionsShape ],
})

