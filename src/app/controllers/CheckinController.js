import { Op } from 'sequelize';
import { startOfWeek, endOfWeek } from 'date-fns';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { index } = req.params;

    const student = await Student.findByPk(index);

    if (!student) {
      return res.status(400).json({ error: 'Student is not registered' });
    }

    const date = new Date();
    const maxCheckInPerWeek = 5;

    const checkinNumber = await Checkin.findAll({
      where: {
        student_id: index,
        created_at: {
          [Op.between]: [startOfWeek(date), endOfWeek(date)],
        },
      },
    });

    if (checkinNumber.length >= maxCheckInPerWeek) {
      return res
        .status(400)
        .json({ error: 'You have reached your checkin limit this week' });
    }

    const checkin = await Checkin.create({
      student_id: index,
    });

    return res.json(checkin);
  }

  async index(req, res) {
    const { index } = req.params;
    const { page = 1 } = req.query;

    const checkin = await Checkin.findAll({
      where: { student_id: index },
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (checkin.length < 1) {
      return res.status(400).json({ error: `No checkins found` });
    }

    return res.json(checkin);
  }
}

export default new CheckinController();
