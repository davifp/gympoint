import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { request } = data;

    await Mail.sendMail({
      to: `${request.student.name} <${request.student.email}>`,
      subject: 'Question Answered',
      template: 'answer',
      context: {
        name: request.student.name,
        question: request.question,
        answer: request.answer,
      },
    });
  }
}

export default new AnswerMail();
