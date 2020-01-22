import { format, parseISO, addMonths } from 'date-fns';
import { Op } from 'sequelize';
import * as Yup from 'yup';
import Enrollment from '../models/Enrollment';
import MembershipPlan from '../models/MembershipPlan';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import GreetingMail from '../jobs/GreetingMail';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      plan: Yup.number()
        .integer()
        .required(),
      student: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const { plan, start_date, student } = req.body;
    /**
     *  Plan Validation
     */
    const checkPlanExists = await MembershipPlan.findOne({
      where: { id: plan },
    });

    if (!checkPlanExists) {
      return res.status(400).json({ error: 'Please enter a valid plan' });
    }

    /**
     *  Student Validation
     */
    const checkStudentExists = await Student.findOne({
      where: { id: student },
    });

    if (!checkStudentExists) {
      return res.status(400).json({ error: 'Please enter a valid student' });
    }

    const { duration, price } = checkPlanExists;

    const date = parseISO(start_date);
    const timeAdded = addMonths(date, duration);
    const end_date = format(timeAdded, 'yyyy-MM-dd');

    const fullPrice = price * duration;

    /**
     *  Enrollment Validation
     */
    const checkStudentPlan = await Enrollment.findOne({
      where: {
        student_id: student,
        end_date: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (checkStudentPlan) {
      return res
        .status(400)
        .json({ error: 'Student already has a plan activated' });
    }

    const enrollment = await Enrollment.create({
      student_id: student,
      plan_id: plan,
      start_date: date,
      end_date,
      price: fullPrice,
    });

    await Queue.add(GreetingMail.key, {
      end_date,
      name: checkStudentExists.name,
      email: checkStudentExists.email,
      title: checkPlanExists.title,
      fullPrice,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      plan: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const { index } = req.params;
    const { start_date, plan } = req.body;

    const enrollment = await Enrollment.findByPk(index);

    if (!enrollment) {
      return res.status(400).json({ error: `Enrollment doesn't exist` });
    }

    /**
     *  Plan Validation
     */
    const checkPlanExists = await MembershipPlan.findOne({
      where: { id: plan },
    });

    if (!checkPlanExists) {
      return res.status(400).json({ error: 'Please enter a valid plan' });
    }

    /**
     *  Student Validation
     */

    const { duration, price } = checkPlanExists;

    const date = parseISO(start_date);
    const timeAdded = addMonths(date, duration);
    const end_date = format(timeAdded, 'yyyy-MM-dd');

    const fullPrice = price * duration;

    await enrollment.update({
      plan_id: plan,
      start_date: date,
      end_date,
      price: fullPrice,
    });

    return res.json(enrollment);
  }

  async delete(req, res) {
    const { index } = req.params;

    const enrollment = await Enrollment.findOne({ where: { id: index } });

    if (!enrollment) {
      return res.status(400).json({ error: `Enrollment doesn't exist` });
    }

    await Enrollment.destroy({ where: { id: index } });

    return res.status(200).json({ message: `Enrollment ${index} was deleted` });
  }

  async index(req, res) {
    const enrollment = await Enrollment.findAll();

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
