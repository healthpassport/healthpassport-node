module.exports = function(sequelize, DataTypes) {
  var Emotion = sequelize.define('Emotion', {
    emotion_type: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {
    tableName: 'emotions',
    updatedAt: 'update_time',
    createdAt: 'creation_time',
    classMethods: {
      associate: function(models) {
        Emotion.belongsTo(models.User)
        Emotion.belongsTo(models.Picture)
      }
    }
  })
 
  return Emotion
}