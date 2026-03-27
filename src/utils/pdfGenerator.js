import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- DATA CLEANER ---
const resolveBookingData = (b) => ({
  name: b.customerName || b.name || "Unknown",
  date: b.date || b.eventDate || b.selectedDate || "TBD",
  items: b.items && Array.isArray(b.items) 
    ? b.items.map(i => i.title || i.name).join(", ") 
    : (b.item || "—"),
  total: Number(b.total || 0).toFixed(2),
  status: b.status || b.contractStatus || "Confirmed",
  phone: b.phone || "N/A",
  address: b.address || "N/A",
  notes: b.adminNote || "No special instructions."
});

// 1. INDIVIDUAL DOWNLOAD
export const downloadBookingPDF = (booking) => {
  const doc = new jsPDF();
  const data = resolveBookingData(booking);
  
  // Professional Brand Palette
  const headerFill = [178, 235, 242]; // Buzzy Aqua
  const textColor = [0, 96, 100];     // Deep Teal

  doc.setFontSize(22);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Buzzy's Entertainment", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Individual Booking Receipt", 14, 28);

  // FIX: Use autoTable(doc, {...}) instead of doc.autoTable({...})
  autoTable(doc, {
    startY: 40,
    head: [["Detail", "Information"]],
    body: [
      ["Customer", data.name],
      ["Date", data.date],
      ["Items", data.items],
      ["Total", `$${data.total}`],
      ["Address", data.address],
      ["Notes", data.notes],
    ],
    headStyles: { fillColor: headerFill, textColor: textColor, fontStyle: 'bold' },
    styles: { cellPadding: 5, fontSize: 10 },
    columnStyles: { 0: { fontStyle: 'bold', width: 40 } }
  });

  doc.save(`Booking_${data.name}.pdf`);
};

// 2. MASTER DOWNLOAD (Delivery Pack)
export const downloadAllBookingsPDF = (bookingsList) => {
  if (!bookingsList || bookingsList.length === 0) return;

  const doc = new jsPDF();
  const headerFill = [178, 235, 242];
  const textColor = [0, 96, 100];

  bookingsList.forEach((b, index) => {
    if (index > 0) doc.addPage();
    const data = resolveBookingData(b);

    doc.setFontSize(22);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text("Buzzy's Entertainment", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Delivery Sheet ${index + 1} of ${bookingsList.length}`, 14, 28);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Customer: ${data.name}`, 14, 45);
    doc.text(`Date: ${data.date}`, 14, 52);
    doc.text(`Phone: ${data.phone}`, 14, 59);
    doc.text(`Address: ${data.address}`, 14, 66);

    // FIX: Use autoTable(doc, {...})
    autoTable(doc, {
      startY: 75,
      head: [["Detail", "Information"]],
      body: [
        ["Items Booked", data.items],
        ["Total Amount", `$${data.total}`],
        ["Status", data.status.toUpperCase()],
        ["Admin Notes", data.notes],
      ],
      headStyles: { fillColor: headerFill, textColor: textColor, fontStyle: 'bold' },
      theme: "grid",
    });

    const finalY = doc.lastAutoTable.finalY + 25;
    doc.setFontSize(10);
    doc.text("Customer Signature: ___________________________", 14, finalY);
  });

  const dateString = new Date().toISOString().split('T')[0];
  doc.save(`Buzzy_Delivery_Pack_${dateString}.pdf`);
};