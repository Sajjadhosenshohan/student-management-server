import fs from "fs";
// import pkg from "pdfjs-dist";
import Student from "../models/student.model.js";
import * as pdfjs from "pdfjs-dist";
import { log } from "console";

const { getDocument } = pdfjs;

const extractTextFromPDF = async (filePath) => {
  const loadingTask = getDocument(filePath);
  const pdfDoc = await loadingTask.promise;
  let fullText = "";

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText;
};

const regex = /(\d{6})\s*\{\s*((?:\d{5}\(T\)(?:,\s*)?)*)\s*\}/g;

export const uploadPDF = async (req, res) => {
  const filePath = req.file.path;

  console.log("log from uploadpdf 29", filePath);

  try {
    if (req.file.mimetype !== "application/pdf") {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: "Only PDF files are allowed." });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found." });
    }

    const text = await extractTextFromPDF(filePath);
    const results = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      const rollNumber = match[1];
      const subjectCodes = match[2]
        .split(",")
        .map((code) => code.trim())
        .filter((code) => code);

      const student = new Student({
        rollNumber,
        subjectCodes,
        regulationYear: req.body.regulationYear,
        semester: req.body.semester,
      });

      await student.save();
      results.push(student);
    }

    res.json({ results });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to process the PDF file." });
  } finally {
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkErr) {
      console.error("Failed to delete the file:", unlinkErr);
    }
  }
};
