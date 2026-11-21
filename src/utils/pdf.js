import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export async function downloadPlan(data) {
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

  try {
    const response = await fetch('/PDF-header.png');
    const blob = await response.blob();
    const imageUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    pdf.addImage(imageUrl, 'PNG', 0, 0, 210, 40);
  } catch {
    pdf.setFillColor(248, 250, 247);
    pdf.rect(0, 0, 210, 40, 'F');
  }

  pdf.setTextColor(20, 20, 20);
  pdf.setFont('merriweather', 'bold');
  pdf.setFontSize(18);
  pdf.text('Family Emergency Communication Plan', margin, 52);
  pdf.setTextColor(20, 20, 20);
  y = 62;

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

export async function createCertificatePdf(name) {
  const response = await fetch('/Ready-Certificate.pdf');
  if (!response.ok) throw new Error('Certificate template could not be loaded.');

  const template = await PDFDocument.load(await response.arrayBuffer());
  const page = template.getPage(0);
  const font = await template.embedFont(StandardFonts.TimesRoman);
  const boldFont = await template.embedFont(StandardFonts.TimesRomanBold);
  const { width } = page.getSize();
  const date = new Date().toLocaleDateString();
  const trimmedName = name.trim();

  const nameSize = trimmedName.length > 40 ? 72 : trimmedName.length > 25 ? 84 : 100;
  page.drawText(trimmedName, {
    x: (width - boldFont.widthOfTextAtSize(trimmedName, nameSize)) / 2,
    y: 680,
    size: nameSize,
    font: boldFont,
  });
  page.drawText(date, {
    x: 535,
    y: 175,
    size: 52,
    font,
  });

  const bytes = await template.save();
  return new Blob([bytes], { type: 'application/pdf' });
}

export async function downloadCertificate(name) {
  const blob = await createCertificatePdf(name);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ready-household-certificate.pdf';
  link.click();
  URL.revokeObjectURL(url);
}
