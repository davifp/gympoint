import * as Yup from 'yup';
import MembershipPlan from '../models/MembershipPlan';

class MembershipPlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const checkIfMembershipPlanExists = await MembershipPlan.findOne({
      where: { title: req.body.title },
    });

    if (checkIfMembershipPlanExists) {
      return res.status(400).json({ error: 'Membership plan already exists' });
    }

    const membershiplan = await MembershipPlan.create(req.body);

    return res.json(membershiplan);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const plans = await MembershipPlan.findAll({
      limit: 20,
      offset: (page - 1) * 20,
    });
    if (plans < 1) {
      return res
        .status(400)
        .json({ error: `Couldn't find any membership plan registered` });
    }
    return res.json(plans);
  }

  async delete(req, res) {
    const { index } = req.params;
    const plan = await MembershipPlan.findOne({
      where: { id: index },
    });

    if (!plan) {
      return res
        .status(400)
        .json({ error: `Membership ${index} doesn't exist` });
    }

    await MembershipPlan.destroy({ where: { id: index } });

    return res.status(200).json({ message: `${plan.title} was deleted` });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const { index } = req.params;
    const { title, duration, price } = req.body;

    const plan = await MembershipPlan.findOne({
      where: { id: index },
    });

    if (!plan) {
      return res
        .status(400)
        .json({ error: `Membership plan ${index} does not exist` });
    }

    await plan.update({
      title,
      duration,
      price,
    });

    return res.json(plan);
  }
}

export default new MembershipPlanController();
