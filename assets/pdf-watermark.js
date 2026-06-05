import { PDFDocument, StandardFonts, rgb } from 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm';

const PDF_APP_LOGO_URL = '/assets/icons/app-pdf-watermark.png';
const PDF_APP_NAME = 'Just PDF Compressor';

async function fetchBytes(url){
  const response = await fetch(url);
  if(!response.ok) throw new Error(`Could not load watermark logo (${response.status})`);
  return new Uint8Array(await response.arrayBuffer());
}

export async function embedPdfAppLogoWatermark(pdfDoc, { opacity = 0.38 } = {}){
  const logo = await pdfDoc.embedPng(await fetchBytes(PDF_APP_LOGO_URL));
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  for(const page of pdfDoc.getPages()){
    const { width, height } = page.getSize();
    const margin = Math.max(14, Math.min(width, height) * 0.035);
    const size = Math.max(28, Math.min(56, Math.min(width, height) * 0.09));
    const labelSize = Math.max(6, Math.min(9, size * 0.16));
    const labelWidth = font.widthOfTextAtSize(PDF_APP_NAME, labelSize);
    const centerX = width - size / 2 - margin;
    const labelX = Math.max(margin, Math.min(width - margin - labelWidth, centerX - labelWidth / 2));
    const labelY = margin;
    page.drawImage(logo, {
      x: width - size - margin,
      y: labelY + labelSize + 4,
      width: size,
      height: size,
      opacity
    });
    page.drawText(PDF_APP_NAME, {
      x: labelX,
      y: labelY,
      size: labelSize,
      font,
      color: rgb(0.18, 0.19, 0.18),
      opacity: Math.min(0.72, opacity + 0.18)
    });
  }
}

export async function addPdfAppLogoWatermark(bytes, options){
  const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  await embedPdfAppLogoWatermark(pdfDoc, options);
  return pdfDoc.save();
}
