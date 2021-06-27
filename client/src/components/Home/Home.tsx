import { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { App, Bookmark, Category } from '../../interfaces';
import { GlobalState } from '../../interfaces/GlobalState';
import { getAppCategories, getApps, getBookmarkCategories, getBookmarks } from '../../store/actions';
import { searchConfig } from '../../utility';
import AppGrid from '../Apps/AppGrid/AppGrid';
import BookmarkGrid from '../Bookmarks/BookmarkGrid/BookmarkGrid';
import SearchBar from '../SearchBar/SearchBar';
import SectionHeadline from '../UI/Headlines/SectionHeadline/SectionHeadline';
import Icon from '../UI/Icons/Icon/Icon';
import { Container } from '../UI/Layout/Layout';
import Spinner from '../UI/Spinner/Spinner';
import WeatherWidget from '../Widgets/WeatherWidget/WeatherWidget';
import { dateTime } from './functions/dateTime';
import { greeter } from './functions/greeter';
import classes from './Home.module.css';

interface ComponentProps {
  getApps: () => void;
  getAppCategories: () => void;
  getBookmarks: () => void;
  getBookmarkCategories: () => void;
  appsLoading: boolean;
  bookmarkCategoriesLoading: boolean;
  appCategories: Category[];
  apps: App[];
  bookmarkCategories: Category[];
  bookmarks: Bookmark[];
}

const Home = (props: ComponentProps): JSX.Element => {
  const {
    getAppCategories,
    getApps,
    getBookmarkCategories,
    getBookmarks,
    appCategories,
    apps,
    bookmarkCategories,
    bookmarks,
    appsLoading,
    bookmarkCategoriesLoading,
  } = props;

  const [header, setHeader] = useState({
    dateTime: dateTime(),
    greeting: greeter(),
  });

  // Load app categories
  useEffect(() => {
    if (appCategories.length === 0) {
      getAppCategories();
    }
  }, [getAppCategories]);

  // Load apps
  useEffect(() => {
    if (apps.length === 0) {
      getApps();
    }
  }, [getApps]);

  // Load bookmark categories
  useEffect(() => {
    if (bookmarkCategories.length === 0) {
      getBookmarkCategories();
    }
  }, [getBookmarkCategories]);

  // Load bookmarks
  useEffect(() => {
    if (bookmarks.length === 0) {
      getBookmarks();
    }
  }, [getBookmarks]);

  // Refresh greeter and time
  useEffect(() => {
    let interval: any;

    // Start interval only when hideHeader is false
    if (searchConfig("hideHeader", 0) !== 1) {
      interval = setInterval(() => {
        setHeader({
          dateTime: dateTime(),
          greeting: greeter(),
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      {searchConfig("hideSearch", 0) !== 1 ? <SearchBar /> : <div></div>}

      {searchConfig("hideHeader", 0) !== 1 ? (
        <header className={classes.Header}>
          <p>{header.dateTime}</p>
          <Link to="/settings" className={classes.SettingsLink}>
            Go to Settings
          </Link>
          <span className={classes.HeaderMain}>
            <h1>{header.greeting}</h1>
            <WeatherWidget />
          </span>
        </header>
      ) : (
        <div></div>
      )}

      {searchConfig("hideApps", 0) !== 1 ? (
        <Fragment>
          <SectionHeadline title="Applications" link="/applications" />
          {appsLoading ? (
            <Spinner />
          ) : (
            <AppGrid
              categories={appCategories.filter(
                (category: Category) => category.isPinned
              )}
              apps={apps.filter((app: App) => app.isPinned)}
              totalCategories={appCategories.length}
            />
          )}

          <div className={classes.HomeSpace}></div>
        </Fragment>
      ) : (
        <div></div>
      )}

      {searchConfig("hideCategories", 0) !== 1 ? (
        <Fragment>
          <SectionHeadline title="Bookmarks" link="/bookmarks" />
          {bookmarkCategoriesLoading ? (
            <Spinner />
          ) : (
            <BookmarkGrid
              categories={bookmarkCategories.filter(
                (category: Category) => category.isPinned
              )}
              bookmarks={bookmarks.filter(
                (bookmark: Bookmark) => bookmark.isPinned
              )}
              totalCategories={bookmarkCategories.length}
            />
          )}
        </Fragment>
      ) : (
        <div></div>
      )}

      <Link to="/settings" className={classes.SettingsButton}>
        <Icon icon="mdiCog" color="var(--color-background)" />
      </Link>
    </Container>
  );
};

const mapStateToProps = (state: GlobalState) => {
  return {
    appCategories: state.app.categories,
    appsLoading: state.app.loading,
    apps: state.app.apps,
    bookmarkCategoriesLoading: state.bookmark.loading,
    bookmarkCategories: state.bookmark.categories,
    bookmarks: state.bookmark.bookmarks,
  };
};

export default connect(mapStateToProps, {
  getApps,
  getAppCategories,
  getBookmarks,
  getBookmarkCategories,
})(Home);
