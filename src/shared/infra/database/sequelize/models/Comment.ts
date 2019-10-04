

export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('comment', {
    comment_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'member',
        key: 'member_id'
      }, 
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    parent_comment_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'comment',
        key: 'comment_id'
      }, 
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },{
    timestamps: true,
    underscored: true, 
    tableName: 'comment'
  });

  Comment.associate = (models) => {
    
  }

  return Comment;
};