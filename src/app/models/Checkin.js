import Sequelize, { Model } from 'sequelize';

class Checkin extends Model {
  static init(sequelize) {
    super.init({}, { sequelize });
  }

  static associate(models) {
    this.belongsTo(models.Checkin, { foreignKey: 'student_id', as: 'student' });
  }
}

export default Checkin;
