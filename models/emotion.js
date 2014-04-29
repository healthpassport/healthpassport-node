module.exports = function(sequelize, DataTypes) {
  var Emotion = sequelize.define('Emotion', {
    emotion_type: DataTypes.STRING,
    description: DataTypes.STRING,
    url: DataTypes.STRING,
    lon: DataTypes.FLOAT,
    lat: DataTypes.FLOAT
  }, {
    tableName: 'emotions',
    updatedAt: 'update_time',
    createdAt: 'creation_time',
    classMethods: {
      associate: function(models) {
        Emotion.belongsTo(models.User)
        Emotion.hasOne(models.Picture)
      }
    }
  })
 
  return Emotion
}