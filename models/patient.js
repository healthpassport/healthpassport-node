var models = require('./index')
module.exports = function(sequelize, DataTypes) {
  var Patient = sequelize.define('Patient', {
    disability_level: DataTypes.INTEGER, 
    understanding_level: DataTypes.INTEGER,
    communication_type: DataTypes.INTEGER,
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