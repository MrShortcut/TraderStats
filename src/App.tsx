import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { useCvContext } from '@context'
import { DataMT5, Header } from '@components'
import { useHandleClouds } from '@hooks'
import { useContextSignals } from '@context'
import Papa from 'papaparse';

const sheetUrl =
  // /* rm */'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-N61Baocf2PbuKP3nfHATNc-aTTNaD9Mbn_bfA-VOTkKYFAOtUw0bd1LWQcufjUjcC4XrRJrd-N9n/pub?output=csv';
  /* gm */ 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRRV5_fxsuUfgIhGy5vIinwxKgGTeXxdSce9Tr3WuPgK9Td6EdiiapySOVMHKIIxDb_EYktWpq8m3Fm/pub?output=csv'
// /* ftmo */'https://docs.google.com/spreadsheets/d/e/2PACX-1vSM9igKVySEEZr0t4NGQEPKfaCY_fMp9MGRLRLKdVGjsSZRS-MskukKepbKEXIsSluBHpAv5uioiHKw/pub?output=csv'

export default function App () {
  const [ isShowing, set ] = useCvContext(s => s.isShowing)
  const [ isPrinting, ] = useCvContext(s => s.isPrinting)

  const [ data, setData ] = useState([]);
  const [ currentMonth, setCurrentMonth ] = useState(new Date().getMonth());
  const [ currentYear, setCurrentYear ] = useState(new Date().getFullYear());

  // useHandleClouds()

  const {
    cheatMode
   } = useContextSignals()

  useEffect(() => {
    if (!isShowing) {
      const timer = setTimeout(() => set({ 'isShowing': true }), 1300)
      return () => clearTimeout(timer);
    }
  }, [ isShowing, set ])

  // 1️⃣ Cargar datos CSV con PapaParse
  useEffect(() => {
    fetch(sheetUrl)
      .then((res) => res.text())
      .then((csvText) => {
        const lines = csvText.split("\n");
        const startIndex = lines.findIndex((l) =>
          l.toLowerCase().includes("positions")
        );
        const endIndex = lines.findIndex((l) =>
          l.toLowerCase().includes("orders")
        );
        const section =
          startIndex !== -1 && endIndex !== -1
            ? lines.slice(startIndex + 1, endIndex)
            : lines;

        const parsed = Papa.parse(section.join("\n"), { header: true });
        console.log({ parsed })
        const rows = parsed.data.filter((r) => r.Symbol && r.Profit);
        console.log({ rows })

        const clean = rows.map((r) => ({
          time: r.Time?.trim(),
          symbol: r.Symbol?.trim(),
          type: r.Type?.trim(),
          profit: parseFloat(String(r.Profit || "")
            .replace(",", ".")          // convierte 75,90 → 75.90
            .replace(/[^0-9.-]/g, "")   // elimina cualquier símbolo restante
          ) || 0,
        }));
        console.log({ clean })

        setData(clean);
      })
      .catch((err) => console.error("Error leyendo CSV:", err));
  }, [ sheetUrl ]);

  // 2️⃣ Agrupar trades por día
  const tradesByDay = useMemo(() => {
    const grouped = {};
    data.forEach((d) => {
      if (!d.time) return;
      const datePart = d.time.split(" ")[ 0 ].replaceAll(".", "-");
      if (!grouped[ datePart ]) grouped[ datePart ] = [];
      grouped[ datePart ].push(d);
    });
    return grouped;
  }, [ data ]);

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

  return <div className='bg-charlie-brown rounded-lg'>

    {!isPrinting && <Header />}

    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPrevMonth}
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          ◀
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold capitalize">
            {monthName} {currentYear}
          </h2>
          <p className="text-green-400 font-semibold">
            Monthly P/L: ${monthlyProfit.toFixed(2)}
          </p>
        </div>

        <button
          onClick={goToNextMonth}
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          ▶
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 text-center font-semibold mb-2 text-gray-400">
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
                <div key={wi + "-" + i} className="aspect-square rounded bg-gray-800" />
              );

            const { profit, count } = getDayStats(date);
            const profitColor =
              profit === 0
                ? "bg-gray-800"
                : profit > 0
                  ? "bg-green-700 hover:bg-green-600"
                  : "bg-red-700 hover:bg-red-600";

            const isSaturday = i === 6;

            return (
              <div
                key={wi + "-" + i}
                className={`relative aspect-square flex flex-col justify-center items-center rounded-lg transition-all ${ profitColor }`}
              >
                <div className="absolute top-1 left-1 text-xs text-gray-400">
                  {date.getDate()}
                </div>

                <div className="text-sm font-bold">
                  {profit === 0
                    ? ""
                    : profit > 0
                      ? `$${ profit.toFixed(2) }`
                      : `-$${ Math.abs(profit).toFixed(2) }`}
                </div>

                {/* <div className="text-xs text-gray-300">{count} trades</div> */}

                <div className="text-xs text-gray-300">{count === 0} {count !== 0 && `${ count } trades`}</div>

                {isSaturday && weekStats.count > 0 && (
                  <div className="flex flex-col text-center py-1 text-xs rounded-b-lg border-t border-gray-800">
                    <div className="text-[10px] uppercase text-gray-400">
                      Week {wi + 1}
                    </div>
                    <div
                      className={`font-bold ${ weekStats.profit >= 0 ? "text-green-400" : "text-red-400"
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

  </div>
}
