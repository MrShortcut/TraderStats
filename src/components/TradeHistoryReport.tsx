import { useContextSignals } from '@context'

export const TradeHistoryReport = () => {
  const {
    tradeHistoryReport: {
      get: report
    },
  } = useContextSignals()

  return (
    <div className='bg-macLight text-macText pb-2 dark:bg-slate-900'>
      <div className='font-thin'>
        {report.title}
      </div>

      <div className=''>
        Company <b>{report.company}</b>
      </div>

      <div className=''>
        {report.name}
      </div>

      <div className=''>
        Report Date: {report.date}
      </div>
    </div>
  )
}