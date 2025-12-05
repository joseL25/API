

module.exports = (sequelize,DataTypes)=>{

    const alias = 'Product';

    const cols = {
        name: {
            type: DataTypes.STRING(100)
        },
        description: {
            type: DataTypes.STRING(255)
        },
        price: {
            type: DataTypes.STRING(255)
        },
    }

    const config = {
        tableName : 'products'
    }

    const Product = sequelize.define(alias,cols,config);

    Product.associate = ()=>{}

    return Product;
}