

module.exports = (sequelize, DataTypes)=> {

    const alias = 'User'

    const cols = {
        name: {
            type: DataTypes.STRING(255),
            validate:{
                min: 3
            }
        },
        email: {
            type: DataTypes.STRING(255)
        },
        password: {
            type: DataTypes.STRING(255)
        },
        avatar: {
            type: DataTypes.STRING(255)
        },
        role:{
            type: DataTypes.BOOLEAN,
            DefaultValue: 0
        }
    }

    const config = {
        tableName: 'users',
        // timestamps: false,
        // paranoid:false
    }

    const User = sequelize.define(alias, cols, config);

    // User.associate = (user)=>{
    //     User.BelongsTo()
    // }

    return User;
};