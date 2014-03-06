module.exports = function(sequelize, DataTypes) {
  var Address = sequelize.define('Address', {
    city: DataTypes.STRING,
    number: DataTypes.STRING,
    postcode: DataTypes.STRING,
    country: DataTypes.STRING,
    street: DataTypes.STRING,
  }, {
    tableName: 'addresses',
    timestamps: false,
    classMethods: {
      associate: function(models) {
        Address.belongsTo(models.User)
      }
    }
  })
 
  return Address
}