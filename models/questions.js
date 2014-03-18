module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
    title: DataTypes.STRING,
  }, {
    tableName: 'questions',
    timestamps: false,
    classMethods: {
      associate: function(models) {
        Question.belongsTo(models.Picture);
        Question.hasMany(models.Answer);
      }
    }
  })
 
  return Question
}