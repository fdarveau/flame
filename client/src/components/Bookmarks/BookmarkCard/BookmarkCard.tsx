import { Bookmark, Category } from '../../../interfaces';
import { iconParser, searchConfig, urlParser } from '../../../utility';
import Icon from '../../UI/Icons/Icon/Icon';
import classes from './BookmarkCard.module.css';

interface ComponentProps {
  category: Category;
  bookmarks: Bookmark[]
  pinHandler?: Function;
}

const BookmarkCard = (props: ComponentProps): JSX.Element => {
  return (
    <div className={classes.BookmarkCard}>
      <h3>{props.category.name}</h3>
      <div className={classes.Bookmarks}>
        {props.bookmarks.map((bookmark: Bookmark) => {
          const redirectUrl = urlParser(bookmark.url)[1];

          return (
            <a
              href={redirectUrl}
              target={searchConfig('bookmarksSameTab', false) ? '' : '_blank'}
              rel='noreferrer'
              key={`bookmark-${bookmark.id}`}>
              {bookmark.icon && (
                <div className={classes.BookmarkIcon}>
                  {(/.(jpeg|jpg|png)$/i).test(bookmark.icon)
                    ? <img
                        src={`/uploads/${bookmark.icon}`}
                        alt={`${bookmark.name} icon`}
                        className={classes.CustomIcon}
                      />
                    : <Icon icon={iconParser(bookmark.icon)} />
                  }
                </div>
              )}
              {bookmark.name}
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default BookmarkCard;