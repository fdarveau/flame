import { Link } from 'react-router-dom';

import { Category } from '../../../interfaces';
import AppCard from '../AppCard/AppCard';
import classes from './AppGrid.module.css';

interface ComponentProps {
  categories: Category[];
  totalCategories?: number;
}

const AppGrid = (props: ComponentProps): JSX.Element => {
  let apps: JSX.Element;

  if (props.categories.length > 0) {
    apps = (
      <div className={classes.AppGrid}>
        {props.categories.map((category: Category): JSX.Element => {
          return <AppCard
            key={category.id}
            category={category}
          />
        })}
      </div>
    )
  } else {
    if (props.totalCategories) {
      apps = (
        <p className={classes.AppsMessage}>There are no pinned app categories. You can pin them from the <Link to='/applications'>/applications</Link> menu</p>
      );
    } else {
      apps = (
        <p className={classes.AppsMessage}>You don't have any apps. You can add a new one from <Link to='/applications'>/applications</Link> menu</p>
      );
    }
  }

  return apps;
}

export default AppGrid;