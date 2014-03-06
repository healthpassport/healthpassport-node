module.exports = function(sequelize, DataTypes) {
  var Contact = sequelize.define('Contact', {
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    telephone: DataTypes.STRING,
    description: DataTypes.STRING,
    picture: DataTypes.STRING,
    nickname: DataTypes.STRING,
    kind: DataTypes.STRING,
  }, {
    tableName: 'contacts',
    updatedAt: 'update_time',
    createdAt: 'creation_time',
    classMethods: {
      associate: function(models) {
        Contact.belongsTo(models.User)
      }
    }
  })
 
  return Contact
}