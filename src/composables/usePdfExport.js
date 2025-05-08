import jsPDF from 'jspdf'
import 'jspdf-autotable'

export function usePdfExport() {
  const exportToPDF = (title, headers, data, fileName) => {
    const doc = new jsPDF()
    
    doc.setFont('helvetica')
    doc.setFontSize(18)
    doc.text(title, 14, 15)
    
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 25,
      styles: {
        font: 'helvetica',
        fontStyle: 'normal',
        halign: 'center'
      },
      headStyles: {
        fillColor: [66, 185, 131],
        textColor: 255
      }
    })
    
    doc.save(`${fileName}.pdf`)
  }

  return { exportToPDF }
}