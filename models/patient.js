var models = require('./index')
module.exports = function(sequelize, DataTypes) {
  var Patient = sequelize.define('Patient', {
    disability_level: DataTypes.STRING,
    understanding_level: DataTypes.STRING,
    communication_type: DataTypes.STRING,
    support_hours: DataTypes.INTEGER
  }, {
    timestamps: false,
    tableName: 'patients',
    classMethods: {
      associate: function(models) {
        Patient.belongsTo(models.User)
      }
    }
  })
 
  return Patient
}