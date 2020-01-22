import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Data' });
    }

    const { email } = req.body;
    const checkEmailExists = await User.findOne({ where: { email } });

    if (checkEmailExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = await User.create(req.body);
    return res.json(user);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const user = await User.findAll({ limit: 20, offset: (page - 1) * 20 });

    if (user.length < 1) {
      return res.status(400).json({ error: 'No users found' });
    }
    return res.json(user);
  }
}

export default new UserController();
