import { App, Category } from '../../../interfaces';
import { iconParser, searchConfig, urlParser } from '../../../utility';
import Icon from '../../UI/Icons/Icon/Icon';
import classes from './AppCard.module.css';


const StatusIndicator  = require('react-status-indicator').default;
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

          return (
            <a
              href={redirectUrl}
              target={searchConfig('appsSameTab', false) ? '' : '_blank'}
              rel='noreferrer'
              className='app-link'
              key={`app-${app.id}`}>
              {app.icon && (
                <div className={classes.AppCardIcon}>
                  {(/.(jpeg|jpg|png)$/).test(app.icon)
                    ? <img
                        src={`/uploads/${app.icon}`}
                        alt={`${app.name} icon`}
                        className={classes.CustomIcon}
                      />
                    : <Icon icon={iconParser(app.icon)} />
                  }
                </div>
              )}
              <div className={classes.AppCardDetails}>
                <div className={classes.AppCardDetailsTitle}>
                  {app.statusIndicatorEnabled ? <StatusIndicator Active /> : ''}
                  <h5>{app.name}</h5>
                </div>
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