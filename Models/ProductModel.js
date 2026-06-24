const {DataTypes}=require('sequelize');
const{sequelize}=require('../Config/db');

const Product=sequelize.define('Product',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:true,
    },
    price:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false,
    },
    stock:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
    },
    image:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    category:{
        type:DataTypes.STRING,
        allowNull:true,
    },

});

module.exports=Product;