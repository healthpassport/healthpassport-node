module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
    title: DataTypes.STRING,
    answer: DataTypes.INTEGER
  }, {
    tableName: 'questions',
    timestamps: false,
    classMethods: {
      associate: function(models) {
        Question.belongsTo(models.Picture);
        Question.belongsTo(models.User);
      }
    }
  })
 
  return Question
}