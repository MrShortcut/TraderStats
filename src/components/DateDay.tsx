import { cx } from '@/utilities'


export type DateDayProps = {
  date: number
  currentDay: number
  profitColor: string
  profit: number
  currentMonth: number
}

export function DateDay ({
  date,
  currentDay,
  profitColor,
  profit,
  currentMonth,
}: DateDayProps) {
  return date !== currentDay
    ? <div className='absolute top-1 left-1 text-xs text-gray-400'>
      {date}
    </div>
    : <div className={cx(
      `absolute top-1 left-1 text-xs rounded-full p-1 shadow bg-opacity-50 mix-blend-screen`,
      profitColor,
      profit === 0 && date === currentDay && '!mix-blend-normal text-slate-500',
      profit > 0 && date === currentDay && '!mix-blend-normal text-black'
    )}
    >
      {/* {currentMonth}{new Date().getMonth()} */}
      {date}
    </div>
}