import { CreateFastContext } from 'cheatmodes4'

/** The important thing it's @example */
export const {
  Provider: TradeStatsProvider,
  useStore: useTradeStatsContext,
  useContextSignals
} = CreateFastContext({
  cheatMode: '@CheatModes4',
  csvData: [],
})

