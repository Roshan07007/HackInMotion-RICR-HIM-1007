import mammoth from "mammoth";
import logger from "./logger.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const PDFParse = pdfParseModule.PDFParse || pdfParseModule;

export const parseDocument = async (file: Express.Multer.File): Promise<string> => {
  try {
    if (!file || !file.buffer) {
      throw new Error("No file buffer provided");
    }

    const mimeType = file.mimetype;

    if (mimeType === "application/pdf") {
      const pdf = new PDFParse({ data: new Uint8Array(file.buffer) });
      const data = await pdf.getText();
      return data.text;
    } 
    
    if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
        mimeType === "application/msword") {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    }

    throw new Error(`Unsupported file type: ${mimeType}`);
  } catch (error: any) {
    logger.error("Document Parsing Error:", error);
    throw new Error(error.message || "Failed to parse document");
  }
};
