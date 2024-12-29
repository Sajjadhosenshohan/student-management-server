import Student from "../models/student.model.js";
import pkg from "pdfjs-dist";
const { getDocument } = pkg;

// const extractTextFromPDF = async (filePath) => {
//   const loadingTask = getDocument(filePath);
//   const pdfDoc = await loadingTask.promise;
//   let fullText = "";

//   for (let i = 1; i <= pdfDoc.numPages; i++) {
//     const page = await pdfDoc.getPage(i);
//     const textContent = await page.getTextContent();
//     const pageText = textContent.items.map((item) => item.str).join(" ");
//     fullText += pageText + "\n";
//   }

//   return fullText;
// };

const extractTextFromPDF = async (fileBuffer) => {
  const loadingTask = getDocument({ data: fileBuffer });
  const pdfDoc = await loadingTask?.promise;

  let fullText = "";
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    fullText += textContent.items.map((item) => item.str).join(" ") + "\n";
  }
  return fullText;
};

const regex = /(\d{6})\s*\{\s*((?:\d{5}\(T\)(?:,\s*)?)*)\s*\}/g;

export const uploadPDFv3 = async (req, res) => {
  const file = req.file;
  console.log(file);
  try {
    // Validate file type
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are allowed." });
    }

    // Extract text from the file buffer
    const text = await extractTextFromPDF(file?.buffer);

    // Collect matches from the extracted text using regex
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match);
    }

    // Map matches to student objects
    const students = matches.map((match) => ({
      rollNumber: match[1],
      subjectCodes: match[2]
        .split(",")
        .map((code) => code.trim())
        .filter((code) => code),
      regulationYear: req.body.regulationYear,
      semester: req.body.semester,
    }));

    // Attempt bulk insertion
    const insertedStudents = [];
    try {
      const result = await Student.insertMany(students, { ordered: false });
      insertedStudents.push(...result); // Collect inserted documents
    } catch (insertError) {
      if (insertError.writeErrors) {
        insertError.writeErrors.forEach((e) => {
          if (e.code === 11000) {
            console.warn(
              `Duplicate entry for rollNumber: ${e.err.op.rollNumber}, semester: ${e.err.op.semester}`
            );
          }
        });
      }
    }

    res.json({
      message: "PDF processed successfully with some duplicates.",
      results: insertedStudents,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to process the PDF file." });
  }
};

// export const uploadPDFv2 = async (req, res) => {
//   const file = req.file;
//   console.log(file);
//   try {
//     // Validate file type
//     if (file.mimetype !== "application/pdf") {
//       return res.status(400).json({ error: "Only PDF files are allowed." });
//     }

//     // Extract text from the file buffer
//     const text = await extractTextFromPDF(file?.buffer);

//     const results = [];
//     let match;

//     // Process the extracted text
//     while ((match = regex.exec(text)) !== null) {
//       const rollNumber = match[1];
//       const subjectCodes = match[2]
//         .split(",")
//         .map((code) => code.trim())
//         .filter((code) => code);

//       // Check for duplicates
//       const existingStudent = await Student.findOne({ rollNumber });
//       if (existingStudent) {
//         console.warn(`Duplicate rollNumber detected: ${rollNumber}`);
//         continue; // Skip this record
//       }

//       // Save each student to the database
//       const student = new Student({
//         rollNumber,
//         subjectCodes,
//         regulationYear: req.body.regulationYear,
//         semester: req.body.semester,
//       });

//       await student.save();
//       results.push(student);
//     }

//     res.json({ message: "PDF processed successfully", results });
//   } catch (error) {
//     console.error("Error processing PDF:", error);
//     res.status(500).json({ error: "Failed to process the PDF file." });
//   }
// };

// export const uploadPDF = async (req, res) => {
//   const filePath = req.file.path;

//   try {
//     if (req.file.mimetype !== "application/pdf") {
//       fs.unlinkSync(filePath);
//       return res.status(400).json({ error: "Only PDF files are allowed." });
//     }

//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ error: "File not found." });
//     }

//     const text = await extractTextFromPDF(filePath);
//     const results = [];
//     let match;

//     while ((match = regex.exec(text)) !== null) {
//       const rollNumber = match[1];
//       const subjectCodes = match[2]
//         .split(",")
//         .map((code) => code.trim())
//         .filter((code) => code);

//       const student = new Student({
//         rollNumber,
//         subjectCodes,
//         regulationYear: req.body.regulationYear,
//         semester: req.body.semester,
//       });

//       await student.save();
//       results.push(student);
//     }

//     res.json({ results });
//   } catch (error) {
//     console.error("Error processing PDF:", error);
//     res.status(500).json({ error: "Failed to process the PDF file." });
//   } finally {
//     try {
//       fs.unlinkSync(filePath);
//     } catch (unlinkErr) {
//       console.error("Failed to delete the file:", unlinkErr);
//     }
//   }
// };
