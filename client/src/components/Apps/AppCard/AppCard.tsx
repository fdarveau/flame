import { App, Category } from '../../../interfaces';
import { iconParser, searchConfig, urlParser } from '../../../utility';
import Icon from '../../UI/Icons/Icon/Icon';
import classes from './AppCard.module.css';

interface ComponentProps {
  category: Category;
  apps: App[]
  pinHandler?: Function;
}

const AppCard = (props: ComponentProps): JSX.Element => {
  return (
    <div className={classes.AppCard}>
      <h3>{props.category.name}</h3>
      <div className={classes.Apps}>
        {props.apps.map((app: App) => {
          const [displayUrl, redirectUrl] = urlParser(app.url);

          let iconEl: JSX.Element;
          const { icon } = app;
        
          if (/.(jpeg|jpg|png)$/i.test(icon)) {
            iconEl = (
              <img
                src={`/uploads/${icon}`}
                alt={`${app.name} icon`}
                className={classes.CustomIcon}
              />
            );
          } else if (/.(svg)$/i.test(icon)) {
            iconEl = (
              <div className={classes.CustomIcon}>
                <svg
                  data-src={`/uploads/${icon}`}
                  fill='var(--color-primary)'
                  className={classes.CustomIcon}
                ></svg>
              </div>
            );
          } else {
            iconEl = <Icon icon={iconParser(icon)} />;
          }

          return (
            <a
              href={redirectUrl}
              target={searchConfig('appsSameTab', false) ? '' : '_blank'}
              rel='noreferrer'
              key={`app-${app.id}`}>              
              <div className={classes.AppCardIcon}>{iconEl}</div>
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
