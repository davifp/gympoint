require('dotenv').config();

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
