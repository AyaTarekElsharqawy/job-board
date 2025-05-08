import * as XLSX from 'xlsx'

export function useExcelExport() {
  const exportToExcel = (title, headers, data, fileName) => {
    const wb = XLSX.utils.book_new()
    const wsData = [headers, ...data]
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, title)
    XLSX.writeFile(wb, `${fileName}.xlsx`)
  }

  const exportToCSV = (headers, data, fileName) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${fileName}.csv`
    link.click()
  }

  return { exportToExcel, exportToCSV }
}