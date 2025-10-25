import { useContextSignals } from '@context'
export const DragAndDropCsv = () => {
  const { tradeHistoryReport: { get: report } } = useContextSignals()

  return (
    <div className='bg-macLight flex flex-col m-auto my-4 rounded-md max-w-6xl pb-10 '>
      <h1 className='text-xl font-thin text-macText'>DragAndDropCsv</h1>

      <div className='border p-6 my-2 mx-auto max-w-md'
        onDragOver={(e) => {
          e.preventDefault()
        }}
        onDrop={(e) => {
          e.preventDefault()
          // const files = e.dataTransfer.files
          // console.log(e.dataTransfer.files)
          // Array.from(e.dataTransfer.files).filter(file => file.type === '')
          const arraySheets = Array.from(e.dataTransfer.files)
            .filter(file => file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            .forEach(console.log)
        }}
      >
      </div>
    </div>
  )
}