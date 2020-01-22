import Sequelize, { Model } from 'sequelize';

class MembershipPlan extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.DOUBLE,
      },
      { sequelize }
    );
  }
}

export default MembershipPlan;
