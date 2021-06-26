import { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { App, Bookmark, Category } from '../../interfaces';
import { GlobalState } from '../../interfaces/GlobalState';
import { getAppCategories, getApps, getBookmarkCategories } from '../../store/actions';
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
  getBookmarkCategories: () => void;
  appsLoading: boolean;
  bookmarkCategoriesLoading: boolean;
  appCategories: Category[];
  apps: App[];
  bookmarkCategories: Category[];
}

const Home = (props: ComponentProps): JSX.Element => {
  const {
    getAppCategories,
    getApps,
    getBookmarkCategories,
    appCategories,
    apps,
    bookmarkCategories,
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

  // Refresh greeter and time
  useEffect(() => {
    let interval: any;

    // Start interval only when hideHeader is false
    if (searchConfig('hideHeader', 0) !== 1) {
      interval = setInterval(() => {
        setHeader({
          dateTime: dateTime(),
          greeting: greeter(),
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, []);

  // Search bookmarks
  const searchBookmarks = (query: string, categoriesToSearch: Category[]): Category[] => {
    const category: Category = {
      name: "Search Results",
      type: categoriesToSearch[0].type,
      isPinned: true,
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
              categories={appCategories.filter((category: Category) => category.isPinned)}
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

      {searchConfig('hideCategories', 0) !== 1 ? (
        <Fragment>
          <SectionHeadline title="Bookmarks" link="/bookmarks" />
          {bookmarkCategoriesLoading ? (
            <Spinner />
          ) : (
            <BookmarkGrid
              categories={
                !localSearch
                  ? bookmarkCategories.filter((category: Category) => category.isPinned)
                  : searchBookmarks(localSearch, bookmarkCategories)
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
  }
}

export default connect(mapStateToProps, { getApps, getAppCategories, getBookmarkCategories })(Home);
