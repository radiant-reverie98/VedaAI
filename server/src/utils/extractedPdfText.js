import { PDFParse } from "pdf-parse";

export const extractPdfText = async (pdfBuffer) => {

  try {
    const uint8Array = new Uint8Array(pdfBuffer);
    const parser = new PDFParse(uint8Array);

    const data = await parser.getText();

    return data.text;

  } catch (error) {

    console.log("PDF Extraction Error:", error);

    throw error;

  }

};