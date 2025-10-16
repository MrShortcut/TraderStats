import { CombineProviders } from 'cheatmodes4'
import { CvProvider } from './providers.CvProvider';
import { TradeStatsProvider } from './providers.TradeStatsProvider';

export const providers = [
  /**
   * @example
   */
  CvProvider,
  TradeStatsProvider,
]

/**
 * APP Main Context
 */
export const AppContextProvider = CombineProviders(...providers)
AppContextProvider.displayName = 'AppContextProvider';
