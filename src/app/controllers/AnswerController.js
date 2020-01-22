import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';
import Student from '../models/Student';

class AnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const { index } = req.params;

    const request = await HelpOrder.findOne({
      where: { id: index, answer: null },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!request) {
      return res
        .status(400)
        .json({ error: 'Request does not exist or was already answered' });
    }

    const { answer } = req.body;

    request.answer = answer;
    request.answer_at = new Date();

    request.save().then(() => {});

    await Queue.add(AnswerMail.key, { request });

    return res.json(request);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const request = await HelpOrder.findAll({
      where: { answer: null },
      attributes: ['id', 'question', 'created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        { model: Student, as: 'student', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (request.length < 1) {
      return res
        .status(400)
        .json({ message: 'All the questions were answered' });
    }

    return res.json(request);
  }
}

export default new AnswerController();
