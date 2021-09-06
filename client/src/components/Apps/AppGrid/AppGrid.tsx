import { Link } from 'react-router-dom';

import { App, Category } from '../../../interfaces';
import AppCard from '../AppCard/AppCard';
import classes from './AppGrid.module.css';

interface ComponentProps {
  categories: Category[];
  apps: App[];
  totalCategories?: number;
  searching: boolean;
}

const AppGrid = (props: ComponentProps): JSX.Element => {
  let apps: JSX.Element;

  if (props.categories.length > 0) {
    if (props.apps.length > 0) {
      apps = (
        <div className={classes.AppGrid}>
          {props.categories.map((category: Category): JSX.Element => {
            return <AppCard key={category.id} category={category} apps={props.apps.filter((app: App) => app.categoryId === category.id)} />
          })}
        </div>
      );
    } else {
      if (props.searching) {
        apps = (
          <p className={classes.AppsMessage}>
            No apps match your search criteria
          </p>
        );
      } else {
        apps = (
          <p className={classes.AppsMessage}>
            You don't have any applications. You can add a new one from the{' '}
            <Link to="/applications">/applications</Link> menu
          </p>
        );
      }
    }
  } else {
    if (props.totalCategories) {
      apps = (
        <p className={classes.AppsMessage}>
          There are no pinned application categories. You can pin them from the{' '}
          <Link to="/applications">/applications</Link> menu
        </p>
      );
    } else {
      apps = (
        <p className={classes.AppsMessage}>
          You don't have any applications. You can add a new one from the{' '}
          <Link to="/applications">/applications</Link> menu
        </p>
      );
    }
  }

  return apps;
};

export default AppGrid;
