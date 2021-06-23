const Category = require('./Category');
const App = require('./App');
const Bookmark = require('./Bookmark');

const associateModels = () => {

  // Category <> App
  Category.hasMany(App, {
    as: 'apps',
    foreignKey: 'categoryId'
  });
  App.belongsTo(Category, { foreignKey: 'categoryId' });

  // Category <> Bookmark
  Category.hasMany(Bookmark, {
    as: 'bookmarks',
    foreignKey: 'categoryId'
  });
  Bookmark.belongsTo(Category, { foreignKey: 'categoryId' });
}

module.exports = associateModels;