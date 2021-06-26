import { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { App, Bookmark, Category, GlobalState } from '../../interfaces';
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

  // Local search query
  const [localSearch, setLocalSearch] = useState<null | string>(null);

  // Load app categories
  useEffect(() => {
    if (appCategories.length === 0) {
      getAppCategories();
    }
  }, [getAppCategories]);

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

  // Search categories
  const searchInCategories = (query: string, categoriesToSearch: Category[]): Category[] => {
    const category: Category = {
      name: "Search Results",
      type: categoriesToSearch[0].type,
      isPinned: true,
      apps: categoriesToSearch
        .map((c: Category) => c.apps)
        .flat()
        .filter((app: App) => new RegExp(query, 'i').test(app.name)),
      bookmarks: categoriesToSearch
        .map((c: Category) => c.bookmarks)
        .flat()
        .filter((bookmark: Bookmark) => new RegExp(query, 'i').test(bookmark.name)),
      id: 0,
      orderId: 0,
      createdAt: new Date(),
      updatedAt: new Date(),        
    };

    return [category];
  };

  return (
    <Container>
      {searchConfig('hideSearch', 0) !== 1 ? (
        <SearchBar setLocalSearch={setLocalSearch} />
      ) : (
        <div></div>
      )}

      {searchConfig('hideHeader', 0) !== 1 ? (
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

      {searchConfig('hideApps', 0) !== 1 ? (
        <Fragment>
          <SectionHeadline title="Applications" link="/applications" />
          {appsLoading ? (
            <Spinner />
          ) : (
            <AppGrid
              categories={
                  !localSearch
                    ? appCategories.filter((category: Category) => category.isPinned)
                    : searchInCategories(localSearch, appCategories)
              }
              apps={
                !localSearch
                  ? apps.filter((app: App) => app.isPinned)
                  : apps.filter((app: App) =>
                      new RegExp(localSearch, 'i').test(app.name)
                    )
              }
              totalCategories={appCategories.length}
              searching={!!localSearch}
            />
          )}
          <div className={classes.HomeSpace}></div>
        </Fragment>
      ) : (
        <div></div>
      )}

      {searchConfig('hideBookmarks', 0) !== 1 ? (
        <Fragment>
          <SectionHeadline title="Bookmarks" link="/bookmarks" />
          {bookmarkCategoriesLoading ? (
            <Spinner />
          ) : (
            <BookmarkGrid
              categories={
                !localSearch
                  ? bookmarkCategories.filter((category: Category) => category.isPinned)
                  : searchInCategories(localSearch, bookmarkCategories)
              }
              bookmarks={
                !localSearch
                  ? bookmarks.filter((bookmark: Bookmark) => bookmark.isPinned)
                  : bookmarks.filter((bookmark: Bookmark) =>
                      new RegExp(localSearch, 'i').test(bookmark.name)
                    )
              }
              totalCategories={bookmarkCategories.length}
              searching={!!localSearch}
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
  }
}

export default connect(mapStateToProps, { getApps, getAppCategories, getBookmarks, getBookmarkCategories })(Home);
