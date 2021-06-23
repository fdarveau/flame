import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Category } from '../../interfaces';
import { GlobalState } from '../../interfaces/GlobalState';
import { getAppCategories, getBookmarkCategories } from '../../store/actions';
import { searchConfig } from '../../utility';
import AppGrid from '../Apps/AppGrid/AppGrid';
import BookmarkGrid from '../Bookmarks/BookmarkGrid/BookmarkGrid';
import SectionHeadline from '../UI/Headlines/SectionHeadline/SectionHeadline';
import Icon from '../UI/Icons/Icon/Icon';
import { Container } from '../UI/Layout/Layout';
import Spinner from '../UI/Spinner/Spinner';
import WeatherWidget from '../Widgets/WeatherWidget/WeatherWidget';
import { dateTime } from './functions/dateTime';
import { greeter } from './functions/greeter';
import classes from './Home.module.css';

interface ComponentProps {
  getAppCategories: Function;
  getBookmarkCategories: Function;
  appCategoriesLoading: boolean;
  bookmarkCategoriesLoading: boolean;
  appCategories: Category[];
  bookmarkCategories: Category[];
}

const Home = (props: ComponentProps): JSX.Element => {
  const {
    getAppCategories,
    getBookmarkCategories,
    appCategories,
    bookmarkCategories,
    appCategoriesLoading,
    bookmarkCategoriesLoading
  } = props;

  const [header, setHeader] = useState({
    dateTime: dateTime(),
    greeting: greeter()
  })

  // Load app categories
  useEffect(() => {
    if (appCategories.length === 0) {
      getAppCategories();
    }
  }, [getAppCategories]);

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
          greeting: greeter()
        })
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [])
  
  return (
    <Container>
      {searchConfig('hideHeader', 0) !== 1
        ? (
          <header className={classes.Header}>
            <p>{header.dateTime}</p>
            <Link to='/settings' className={classes.SettingsLink}>Go to Settings</Link>
            <span className={classes.HeaderMain}>
              <h1>{header.greeting}</h1>
              <WeatherWidget />
            </span>
          </header>
          )
        : <div></div>
      }
      
      <SectionHeadline title='Applications' link='/applications' />
      {appCategoriesLoading
        ? <Spinner />
        : <AppGrid
            categories={appCategories.filter((category: Category) => category.isPinned && category.type === 'apps')}
            totalCategories={appCategories.filter((category: Category) => category.type === 'apps').length}
        />
      }

      <div className={classes.HomeSpace}></div>

      <SectionHeadline title='Bookmarks' link='/bookmarks' />
      {bookmarkCategoriesLoading
        ? <Spinner />
        : <BookmarkGrid
            categories={bookmarkCategories.filter((category: Category) => category.isPinned && category.type === 'bookmarks')}
            totalCategories={bookmarkCategories.filter((category: Category) => category.type === 'bookmarks').length}
        />
      }

      <Link to='/settings' className={classes.SettingsButton}>
        <Icon icon='mdiCog' color='var(--color-background)' />
      </Link>
    </Container>
  )
}

const mapStateToProps = (state: GlobalState) => {
  return {
    appCategoriesLoading: state.app.loading,
    appCategories: state.app.categories,
    bookmarkCategoriesLoading: state.bookmark.loading,
    bookmarkCategories: state.bookmark.categories
  }
}

export default connect(mapStateToProps, { getAppCategories, getBookmarkCategories })(Home);