import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      age: Yup.number()
        .integer()
        .required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Invalid data' });
    }

    const { email } = req.body;

    const checkEmailExists = await Student.findOne({ where: { email } });

    if (checkEmailExists) {
      return res.status(401).json({ error: "Student's email already exists" });
    }

    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number().integer(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ message: 'Invalid data' });
    }

    const checkStudentExists = await Student.findOne({
      where: { id: req.params.index },
    });

    if (!checkStudentExists) {
      return res.json({ message: "Student doesn't exist" });
    }

    const student = await checkStudentExists.update(req.body);

    return res.json(student);
  }
}

export default new StudentController();
