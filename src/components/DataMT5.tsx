import { useMemo, useState, useEffect, Fragment } from 'react';

export default function TradeCalendar ({ data }) {
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

  const now = new Date();
  const [ currentMonth, setCurrentMonth ] = useState(now.getMonth());
  const [ currentYear, setCurrentYear ] = useState(now.getFullYear());

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

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPrevMonth}
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 font-bold"
        >
          {'<'}
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
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 font-bold"
        >
          {'>'}
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
          // Calcular resumen semanal
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
            const isDomingo = i === 0;
            return (
              <div
                key={wi + "-" + i}
                className={`relative aspect-square flex flex-col justify-center items-center rounded-lg transition-all ${ profitColor }`}
              >
                <div className="absolute top-1 left-1 text-xs text-gray-400">
                  {date.getDate()}
                </div>

                {!isSaturday && !isDomingo && <div className="text-sm font-bold">
                  {profit === 0
                    ? ""
                    : profit > 0
                      ? `+$${ profit.toFixed(2) }`
                      : `-$${ Math.abs(profit).toFixed(2) }`}
                </div>}

                {!isSaturday && !isDomingo && <div className="text-xs text-gray-300">{count === 0} {count !== 0 && `${ count } trades`}</div>}


                {/* Bloque resumen semanal */}
                {isSaturday && weekStats.count > 0 && (
                  <div className="absolute left-0 right-0 text-center py-1 text-xs rounded-b-lg border-t border-gray-800">
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
  );
}
export const DataMT5 = () => {
  const URL =
  // /* rm */'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-N61Baocf2PbuKP3nfHATNc-aTTNaD9Mbn_bfA-VOTkKYFAOtUw0bd1LWQcufjUjcC4XrRJrd-N9n/pub?output=csv';
  /* gm */ 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRRV5_fxsuUfgIhGy5vIinwxKgGTeXxdSce9Tr3WuPgK9Td6EdiiapySOVMHKIIxDb_EYktWpq8m3Fm/pub?output=csv'
  // /* ftmo */'https://docs.google.com/spreadsheets/d/e/2PACX-1vSM9igKVySEEZr0t4NGQEPKfaCY_fMp9MGRLRLKdVGjsSZRS-MskukKepbKEXIsSluBHpAv5uioiHKw/pub?output=csv'
  // 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT9fLIM8ySYWRd62XQYz-rafRnilRvln1ZfD1IFpTq6t0CDgPqjVpCo4CRT5T4t5g/pub?output=csv'
  const [ data, setData ] = useState([]);

  useEffect(() => {
    const sheetUrl = URL;

    fetch(sheetUrl)
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n");
        console.log({ lines });

        // Buscar secciones del reporte
        const startIndex = lines.findIndex((l) => l.toLowerCase().includes("positions"));
        const endIndex = lines.findIndex((l) => l.toLowerCase().includes("orders"));

        // Si no se encuentra, usar todo
        const section = startIndex !== -1 && endIndex !== -1
          ? lines.slice(startIndex + 1, endIndex)
          : lines;
        console.log({ section });

        // Convertir a filas y columnas
        const rows = section
          .map((r) => r.split(",").map((v) => v.trim()))
          .filter((r) => r.length > 1);

        // Buscar encabezado con "Symbol"
        const headerRowIndex = rows.findIndex((r) => r.some((c) => c.toLowerCase() === "symbol"));
        if (headerRowIndex === -1) return;

        const headers = rows[ headerRowIndex ].map((h) => h.toLowerCase());
        const symbolIndex = headers.indexOf("symbol");
        const typeIndex = headers.indexOf("type");
        const profitIndex = 18;

        // Tomar solo las filas debajo del encabezado
        const cleanRows = rows
          .slice(headerRowIndex + 1)
          .map((r) => {
            const symbol = r[ symbolIndex ];
            const type = r[ typeIndex ];
            const profitRaw = `${ r[ profitIndex ] }.${ r[ 19 ] }`;
            if (!symbol || !type || !profitRaw) return null;

            const profit = parseFloat(
              String(profitRaw).replace(/[^0-9.-]/g, "")
            );

            if (isNaN(profit)) return null;

            return { symbol, type, profit, time: r[ 0 ] };
          })
          .filter(Boolean);

        setData(cleanRows);
      })
      .catch((err) => console.error("Error leyendo CSV:", err));
  }, []);
  // console.log({ data })
  // Cálculo de estadísticas
  const totalTrades = data.length;
  const winners = data.filter((d) => d.profit > 0);
  const losers = data.filter((d) => d.profit < 0);
  const profitTotal = data.reduce((acc, d) => acc + d.profit, 0);
  const profitPromedio = totalTrades > 0 ? profitTotal / totalTrades : 0;

  const profitPromedioGanadores = winners.length > 0
    ? winners.reduce((acc, d) => acc + d.profit, 0) / winners.length
    : 0;
  const profitPromedioPerdedores = losers.length > 0
    ? losers.reduce((acc, d) => acc + d.profit, 0) / losers.length
    : 0;

  const porcentajeAcierto = totalTrades > 0 ? (winners.length / totalTrades) * 100 : 0;

  // Profit agrupado por símbolo
  const profitPorSymbol = data.reduce((acc, d) => {
    acc[ d.symbol ] = (acc[ d.symbol ] || 0) + d.profit;
    return acc;
  }, {});

  return (
    <Fragment>
      <TradeCalendar data={data} />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">Estadísticas de MT5</h1>

        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Symbol</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">time</th>
              <th className="border p-2">Profit</th>
            </tr>
          </thead>
          <tbody>
            {data.length !== 0 && data.map((r, i) => (
              <tr key={i}>
                <td className="border p-2">{r.symbol}</td>
                <td className="border p-2">{r.type}</td>
                <td className="border p-2">{r.time}</td>
                <td
                  className={`border p-2 text-right ${ r.profit >= 0 ? "text-green-600" : "text-red-500" }`}
                >
                  {r.profit.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 bg-black-50 p-4 rounded-lg shadow">
        <h3 className="font-bold text-lg mb-2">Estadísticas generales</h3>
        <p>Total de trades: {totalTrades}</p>
        <p>Ganadores: {winners.length}</p>
        <p>Perdedores: {losers.length}</p>
        <p>Porcentaje de acierto: {porcentajeAcierto.toFixed(2)}%</p>
        <p>Profit total: {profitTotal.toFixed(2)}</p>
        <p>Profit promedio: {profitPromedio.toFixed(2)}</p>
        <p>Promedio ganadores: {profitPromedioGanadores.toFixed(2)}</p>
        <p>Promedio perdedores: {profitPromedioPerdedores.toFixed(2)}</p>
      </div>

      <div className="mt-4 bg-black-50 p-4 rounded-lg shadow">
        <h3 className="font-bold text-lg mb-2">Profit por símbolo</h3>
        {Object.entries(profitPorSymbol).map(([ symbol, profit ]) => (
          <p key={symbol}>
            {symbol}:{" "}
            <span style={{ color: profit >= 0 ? "green" : "red" }}>
              {profit.toFixed(2)}
            </span>
          </p>
        ))}
      </div>
    </Fragment>
  );
};
