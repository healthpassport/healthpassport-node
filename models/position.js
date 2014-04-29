module.exports = function(sequelize, DataTypes) {
  var Position = sequelize.define('Position', {
    lon: DataTypes.FLOAT,
    lat: DataTypes.FLOAT
  }, {
    tableName: 'positions',
    updatedAt: 'update_time',
    createdAt: 'creation_time',
    classMethods: {
      associate: function(models) {
        Position.belongsTo(models.User)
      }
    }
  })
 
  return Position
}