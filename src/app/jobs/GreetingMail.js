import Mail from '../../lib/Mail';

class GreetingMail {
  get key() {
    return 'GreetinMail';
  }

  async handle({ data }) {
    const { name, title, end_date, email, fullPrice } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Greetings',
      template: 'greeting',
      context: {
        name,
        planTitle: title,
        fullPrice,
        planEndDate: end_date,
      },
    });
  }
}

export default new GreetingMail();
