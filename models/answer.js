module.exports = function(sequelize, DataTypes) {
  var Answer = sequelize.define('Answer', {
    answer: DataTypes.INTEGER,
  }, {
    tableName: 'answers',
    timestamps: false,
    classMethods: {
      associate: function(models) {
        Answer.belongsTo(models.Question);
        Answer.belongsTo(models.User);
      }
    }
  })
 
  return Answer
}