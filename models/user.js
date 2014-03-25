module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
    role: DataTypes.STRING,
    telephone: DataTypes.STRING
  }, {
    tableName: 'users',
    updatedAt: 'update_time',
    createdAt: 'creation_time',
    classMethods: {
      associate: function(models) {
        User.hasOne(models.Patient)
            .hasMany(models.Allergy)
            .hasMany(models.Picture)
            .hasMany(models.Emotion)
            .hasMany(models.Contact)
            .hasMany(models.Question)
            .hasMany(models.Event)
            .hasOne(models.Address)
      }
    }
  })
 
  return User
}