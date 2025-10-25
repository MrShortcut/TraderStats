// SmartCsvDropzone.tsx
// npm install react-dropzone papaparse xlsx
// Este componente acepta .xlsx o .csv
// Si es Excel, lo convierte automáticamente a CSV y lo procesa con PapaParse.

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa, { ParseResult } from "papaparse";
import * as XLSX from "xlsx";

type Row = Record<string, string | number | null>;

export function SmartCsvDropzone () {
  const [ data, setData ] = useState<Row[]>([]);
  const [ showTable, setShowTable ] = useState<boolean>(false);
  const [ headers, setHeaders ] = useState<string[]>([]);
  const [ error, setError ] = useState<string | null>(null);
  const [ fileName, setFileName ] = useState<string | null>(null);

  const processCsvString = (csvString: string) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results: ParseResult<Row>) => {
        if (results.data && results.data.length > 0) {
          const parsed = results.data as Row[];
          setData(parsed);
          const metaFields = results.meta.fields as string[] | null;
          setHeaders(metaFields?.length ? metaFields : Object.keys(parsed[ 0 ]));
        } else {
          setData([]);
          setHeaders([]);
        }
      },
      error: (err) => setError(`Error parsing CSV: ${ err.message }`),
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[ 0 ];
    setFileName(file.name);

    // Detecta tipo de archivo por extensión o MIME
    const isExcel =
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.name.toLowerCase().endsWith(".xlsx");

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[ workbook.SheetNames[ 0 ] ];
          const csvString = XLSX.utils.sheet_to_csv(firstSheet);
          processCsvString(csvString);
        } catch (err: any) {
          setError("Error convirtiendo Excel a CSV: " + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Asumir que ya es CSV
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        processCsvString(text);
      };
      reader.readAsText(file, "utf-8");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [ ".csv" ],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [ ".xlsx" ],
    },
    multiple: false,
  });

  const clear = () => {
    setData([]);
    setHeaders([]);
    setError(null);
    setFileName(null);
  };

  return !showTable ? <div>
    noTable
  </div>
    :
    <div /* TableExcel */ className="mx-auto p-6 absolute inset-0 z-10 bg-macLight">
      <h2 className="text-2xl font-semibold mb-4">🧠 Traiga aquí su historial de metatrader 5</h2>

      <div
        {...getRootProps()}
        className={`border border-dashed rounded-md p-8 transition-shadow hover:shadow-md cursor-pointer shadow bg-macPanel ${ isDragActive ? " border-macMuted bg-[#ffeef1]" : "!border-macPanel bg-white"
          }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <p className="text-lg">
            {isDragActive
              ? "Suelta el archivo aquí..."
              : "Arrastra un archivo .csv o .xlsx (Excel) o haz click"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Si es Excel, se convierte automáticamente a CSV
          </p>
        </div>
      </div>

      {fileName && (
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Archivo cargado: <span className="font-medium">{fileName}</span>
            </p>
            <p className="text-sm text-gray-500">Filas: {data.length}</p>
          </div>
          <button onClick={clear} className="px-3 py-1 rounded-md border">
            Limpiar
          </button>
        </div>
      )}

      {error && <div className="mt-4 text-red-600">{error}</div>}

      {data.length > 0 && (
        <div className="mt-6 overflow-auto border rounded-lg">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {headers.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {headers.map((h) => (
                    <td key={h} className="px-4 py-2 text-sm whitespace-pre">
                      {String(row[ h ] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.length === 0 && !error && (
        <p className="mt-4 text-sm text-gray-500">
          No hay datos cargados aún.
        </p>
      )}
    </div>
}
