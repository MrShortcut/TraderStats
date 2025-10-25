import { useMemo, useState } from 'react'
import {
  DateDay,
} from '@components'
import { useContextSignals } from '@context';

export const TradeCalendar = () => {
  // const [ data, setData ] = useState([]);
  const [ currentMonth, setCurrentMonth ] = useState(new Date().getMonth());
  const [ currentYear, setCurrentYear ] = useState(new Date().getFullYear());
  const [ currentDay, setCurrentDay ] = useState(new Date().getUTCDate());


  const {
    positions: { get: positions },
    tradeHistoryReport: { get: report },
  } = useContextSignals()

  console.log({
    positions,
    report
  })

  // 2️⃣ Agrupar trades por día
  const tradesByDay = useMemo(() => {
    const grouped = {};
    positions.forEach((d) => {
      if (!d.time) return;
      const datePart = d.time.split(" ")[ 0 ].replaceAll(".", "-");
      if (!grouped[ datePart ]) grouped[ datePart ] = [];
      grouped[ datePart ].push(d);
    });
    return grouped;
  }, [ positions ]);

  // 3️⃣ Navegación entre meses
  const goToPrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };
  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // 4️⃣ Construcción del calendario
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const monthName = firstDayOfMonth.toLocaleString("default", { month: "long" });

  const weeks = [];
  let currentWeek = [];

  for (let i = 0; i < firstDayOfMonth.getDay(); i++) currentWeek.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentYear, currentMonth, d);
    currentWeek.push(date);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const getDayStats = (dateObj) => {
    const dateStr = dateObj.toISOString().slice(0, 10);
    const trades = tradesByDay[ dateStr ] || [];
    const profit = trades.reduce((sum, t) => sum + t.profit, 0);
    return { profit, count: trades.length };
  };

  const monthlyProfit = weeks.flat().reduce((sum, date) => {
    if (!date) return sum;
    const { profit } = getDayStats(date);
    return sum + profit;
  }, 0);


  return <div className="bg-macLight dark:bg-slate-900 text-white p-1 rounded-xl shadow-lg max-w-6xl mx-auto mt-2">
    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={goToPrevMonth}
        className="px-3 py-1 bg-macPanel rounded hover:bg-macHover text-macBorder hover:text-macText shadow-sm dark:bg-slate-800 dark:text-macText hover:dark:bg-slate-700 hover:dark:text-black dark:shadow-sm"
      >
        {'<'}
      </button>

      <div className="text-center">
        <h2 className="text-2xl font-bold capitalize text-macText">
          {monthName} {currentYear}
        </h2>
        <p className="text-green-400 font-semibold">
          Monthly P/L: ${monthlyProfit.toFixed(2)}
        </p>
      </div>

      <button
        onClick={goToNextMonth}
        className="px-3 py-1 bg-macPanel rounded hover:bg-macHover text-macBorder hover:text-macText shadow-sm dark:bg-slate-800 dark:text-macText hover:dark:bg-slate-700 hover:dark:text-black dark:shadow-sm"
      >
        {'>'}
      </button>
    </div>

    {/* Días de la semana */}
    <div className="grid grid-cols-7 text-center font-thin mb-2 text-gray-400">
      {[ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ].map((d) => (
        <div key={d}>{d}</div>
      ))}
    </div>

    {/* Celdas del calendario */}
    <div className="grid grid-cols-7 gap-2">
      {weeks.map((week, wi) => {
        const weekStats = week.reduce(
          (acc, day) => {
            if (!day) return acc;
            const { profit, count } = getDayStats(day);
            acc.profit += profit;
            acc.count += count;
            return acc;
          },
          { profit: 0, count: 0 }
        );

        return week.map((date, i) => {
          if (!date)
            return (
              <div key={wi + "-" + i} className="aspect-square rounded bg-macLight dark:bg-slate-900" />
            );

          const { profit, count } = getDayStats(date);
          const profitColor =
            profit === 0
              ? "bg-macLightOne dark:bg-slate-800"
              : profit > 0
                ? "bg-profitGreen hover:bg-green-600"
                : "bg-lossRed hover:bg-red-600";

          const isSaturday = i === 6;

          return (
            <div
              key={wi + "-" + i}
              className={`relative aspect-square flex flex-col justify-center items-center rounded-lg transition-all ${ profitColor }`}
            >
              <DateDay
                date={date.getDate()}
                currentDay={currentDay}
                profitColor={profitColor}
                currentMonth={currentMonth}
                profit={profit}
              />

              <div className="text-sm font-bold">
                {profit === 0
                  ? ""
                  : profit > 0
                    ? `$${ profit.toFixed(2) }`
                    : `-$${ Math.abs(profit).toFixed(2) }`}
              </div>

              <div className="text-xs text-gray-300">{count === 0} {count !== 0 && `${ count } trades`}</div>

              {isSaturday && weekStats.count > 0 && (
                <div className="flex flex-col text-center text-xs rounded-b-lg">
                  <div className="text-[10px] uppercase text-gray-400">
                    Week {wi + 1}
                  </div>
                  <div
                    className={`font-bold ${ weekStats.profit >= 0 ? "text-green-500" : "text-red-400"
                      }`}
                  >
                    ${weekStats.profit.toFixed(2)}
                  </div>
                  <div className="text-gray-400">{weekStats.count} trades</div>
                </div>
              )}
            </div>
          );
        });
      })}
    </div>
  </div>


}