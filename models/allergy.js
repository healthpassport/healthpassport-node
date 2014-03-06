module.exports = function(sequelize, DataTypes) {
  // TODO unique allergy per user
  var Allergy = sequelize.define('Allergy', {
    name: {type: DataTypes.STRING},
    creation_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    timestamps: false,
    tableName: 'allergies',
    classMethods: {
      associate: function(models) {
        Allergy.belongsTo(models.User)
      }
    }
  })
 
  return Allergy
}