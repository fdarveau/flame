import { Link } from 'react-router-dom';

import { Bookmark, Category } from '../../../interfaces';
import BookmarkCard from '../BookmarkCard/BookmarkCard';
import classes from './BookmarkGrid.module.css';

interface ComponentProps {
  categories: Category[];
  bookmarks: Bookmark[];
  totalCategories?: number;
  searching: boolean;
}

const BookmarkGrid = (props: ComponentProps): JSX.Element => {
  let bookmarks: JSX.Element;

  if (props.categories.length > 0) {
    if (props.searching && props.categories[0].bookmarks.length === 0) {
      bookmarks = (
        <p className={classes.BookmarksMessage}>
          No bookmarks match your search criteria
        </p>
      );
    } else {
      bookmarks = (
        <div className={classes.BookmarkGrid}>
          {props.categories.map(
            (category: Category): JSX.Element => (
              <BookmarkCard key={category.id} category={category} bookmarks={props.bookmarks.filter( (bookmark: Bookmark) => bookmark.categoryId === category.id)} />
            )
          )}
        </div>
      );
    }
  } else {
    if (props.totalCategories) {
      bookmarks = (
        <p className={classes.BookmarksMessage}>
          There are no pinned bookmark categories. You can pin them from the{' '}
          <Link to="/bookmarks">/bookmarks</Link> menu
        </p>
      );
    } else {
      bookmarks = (
        <p className={classes.BookmarksMessage}>
          You don't have any bookmarks. You can add a new one from{' '}
          <Link to="/bookmarks">/bookmarks</Link> menu
        </p>
      );
    }
  }

  return bookmarks;
};

export default BookmarkGrid;
