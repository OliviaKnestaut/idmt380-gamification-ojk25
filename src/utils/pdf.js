import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

export function downloadPlan(data) {
  const pdf = new jsPDF();
  const margin = 18;
  let y = 20;

  const addPageIfNeeded = (height = 20) => {
    if (y + height > 275) {
      pdf.addPage();
      y = 20;
    }
  };

  const section = (title) => {
    addPageIfNeeded(18);
    pdf.setFillColor(63, 127, 34);
    pdf.roundedRect(margin, y, 174, 10, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text(title, margin + 5, y + 7);
    pdf.setTextColor(20, 20, 20);
    y += 18;
  };

  const records = (title, list) => {
    const useful = list.filter((item) =>
      Object.values(item).some(Boolean),
    );

    if (!useful.length) return;
    section(title);

    const body = useful.flatMap((item, index) =>
      Object.entries(item)
        .filter(([, value]) => value)
        .map(([label, value]) => [
          useful.length > 1
            ? `${title.replace(/s$/, '')} ${index + 1} - ${label.replace(
                /([A-Z])/g,
                ' $1',
              )}`
            : label.replace(/([A-Z])/g, ' $1'),
          String(value),
        ]),
    );

    autoTable(pdf, {
      startY: y,
      head: [['Information', 'Details']],
      body,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 4,
        lineColor: [215, 225, 211],
        lineWidth: 0.2,
        overflow: 'linebreak',
        valign: 'top',
      },
      headStyles: {
        fillColor: [63, 127, 34],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 251, 247],
      },
      columnStyles: {
        0: { cellWidth: 52, fontStyle: 'bold' },
        1: { cellWidth: 122 },
      },
      margin: { left: margin, right: margin },
    });

    y = pdf.lastAutoTable.finalY + 14;
  };

  pdf.setFillColor(19, 52, 35);
  pdf.rect(0, 0, 210, 34, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.text('Family Emergency Plan', margin, 22);
  pdf.setTextColor(20, 20, 20);
  y = 48;

  records('Household information', [data.household]);
  records('Family members', data.members);
  records('Emergency contacts', data.contacts);
  records('Emergency plans', data.plans);
  records('Meeting places', data.meetings);
  records('Medical information', [
    ...data.doctors,
    ...data.allergies,
    ...data.insurance,
  ]);

  if (data.equipment) {
    section('Assistive devices and medical equipment');
    autoTable(pdf, {
      startY: y,
      head: [['Information', 'Details']],
      body: [['Notes', data.equipment]],
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 4,
        overflow: 'linebreak',
        valign: 'top',
      },
      headStyles: {
        fillColor: [63, 127, 34],
        textColor: [255, 255, 255],
      },
      columnStyles: {
        0: { cellWidth: 52, fontStyle: 'bold' },
        1: { cellWidth: 122 },
      },
      margin: { left: margin, right: margin },
    });
  }

  pdf.save('family-emergency-plan.pdf');
}

export function downloadCertificate(data) {
  const pdf = new jsPDF({ orientation: 'landscape' });
  const householdName =
    data.members.find((member) => member.name)?.name ||
    data.household.city ||
    'Your household';

  pdf.setFillColor(248, 252, 247);
  pdf.rect(0, 0, 297, 210, 'F');
  pdf.setLineWidth(3);
  pdf.setDrawColor(63, 127, 34);
  pdf.rect(12, 12, 273, 186);
  pdf.setLineWidth(1);
  pdf.setDrawColor(168, 198, 155);
  pdf.rect(18, 18, 261, 174);
  pdf.setTextColor(32, 71, 37);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  pdf.text('READY SET PLAN', 148.5, 40, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(35);
  pdf.text('Certificate of Preparedness', 148.5, 75, {
    align: 'center',
  });
  pdf.setFontSize(16);
  pdf.text('This certifies that', 148.5, 102, { align: 'center' });
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(25);
  pdf.text(householdName, 148.5, 120, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(13);
  pdf.text(
    'has completed a Family Emergency Communication Plan',
    148.5,
    141,
    { align: 'center' },
  );
  pdf.setFontSize(10);
  pdf.text(`Prepared ${new Date().toLocaleDateString()}`, 148.5, 166, {
    align: 'center',
  });
  pdf.save('ready-household-certificate.pdf');
}
