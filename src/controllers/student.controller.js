import Student from '../models/student.model.js';

export const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create student', error: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, semester, subjectCode } = req.query;
    const query = {};
    
    if (semester) query.semester = semester;
    if (subjectCode) query.subjectCodes = { $in: [subjectCode] };

    const students = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Student.countDocuments(query);

    res.json({
      students,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student', error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student', error: error.message });
  }
};