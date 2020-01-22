import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class QuestionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const { index } = req.params;

    const checkIdExists = await Student.findByPk(index);

    if (!checkIdExists) {
      return res.status(400).json({ error: "Student doesn't exist" });
    }

    const { question } = req.body;

    const request = await HelpOrder.create({
      student_id: index,
      question,
    });

    return res.json(request);
  }

  async index(req, res) {
    const { index } = req.params;
    const { page = 1 } = req.query;

    const studentQuestions = await HelpOrder.findAll({
      where: { student_id: index },
      attributes: ['id', 'question', 'answer', 'created_at', 'answer_at'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        { model: Student, as: 'student', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (studentQuestions.length < 1) {
      return res.status(400).json({ error: `Couldn't find any questions` });
    }

    return res.json(studentQuestions);
  }
}

export default new QuestionController();
