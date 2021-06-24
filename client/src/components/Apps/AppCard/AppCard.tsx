import { App, Category } from '../../../interfaces';
import { iconParser, urlParser } from '../../../utility';
import Icon from '../../UI/Icons/Icon/Icon';
import classes from './AppCard.module.css';

interface ComponentProps {
  category: Category;
  pinHandler?: Function;
}

const AppCard = (props: ComponentProps): JSX.Element => {
  return (
    <div className={classes.AppCard}>
      <h3>{props.category.name}</h3>
      <div className={classes.Apps}>
        {props.category.apps.map((app: App) => {
          const [displayUrl, redirectUrl] = urlParser(app.url);

          return (
            <a
              href={redirectUrl}
              target='_blank'
              rel='noreferrer'
              key={`app-${app.id}`}>
              {app.icon && (
                <div className={classes.AppCardIcon}>
                  <Icon icon={iconParser(app.icon)} />
                </div>
              )}
              <div className={classes.AppCardDetails}>
                  <h5>{app.name}</h5>
                  <span>{displayUrl}</span>
                </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default AppCard;