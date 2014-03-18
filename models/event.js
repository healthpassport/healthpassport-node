module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    title: DataTypes.STRING,
    kind: DataTypes.STRING,
    time: DataTypes.DATE,
    description: DataTypes.TEXT
  }, {
    tableName: 'events',
    updatedAt: 'update_time',
    createdAt: 'creation_time',
    classMethods: {
      associate: function(models) {
        Event.belongsTo(models.User)
      }
    }
  })
 
  return Event
}