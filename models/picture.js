module.exports = function(sequelize, DataTypes) {
  var Picture = sequelize.define('Picture', {
    url: DataTypes.STRING,
  }, {
    tableName: 'pictures',
    updatedAt: 'update_time',
    createdAt: 'creation_time',
    classMethods: {
      associate: function(models) {
        Picture.belongsTo(models.User);
      }
    }
  })
 
  return Picture
}