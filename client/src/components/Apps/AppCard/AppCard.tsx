import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { App, Category } from '../../../interfaces';
import { actionCreators } from '../../../store';
import { State } from '../../../store/reducers';
import { iconParser, isImage, isSvg, isUrl, urlParser } from '../../../utility';
import { Icon } from '../../UI';
import classes from './AppCard.module.css';

interface Props {
  category: Category;
  fromHomepage?: boolean;
}

export const AppCard = (props: Props): JSX.Element => {
  const { category, fromHomepage = false } = props;

  const config = useSelector((state: State) => state.config.config);
  const isAuthenticated = useSelector((state: State) => state.auth.isAuthenticated);

  const dispatch = useDispatch();
  const { setEditCategory } = bindActionCreators(actionCreators, dispatch);

  return (
    <div className={classes.AppCard}>
      <h3
        className={
          fromHomepage || !isAuthenticated ? '' : classes.AppHeader
        }
        onClick={() => {
          if (!fromHomepage && isAuthenticated) {
            setEditCategory(category);
          }
        }}
      >
        {category.name}
      </h3>

      <div className={classes.Apps}>
        {category.apps.map((app: App) => {
          const [displayUrl, redirectUrl] = urlParser(app.url);

          let iconEl: JSX.Element = <Fragment></Fragment>;

          if (app.icon) {
            const { icon, name } = app;

            if (isImage(icon)) {
              const source = isUrl(icon) ? icon : `/uploads/${icon}`;

              iconEl = (
                <div className={classes.AppIcon}>
                  <img
                    src={source}
                    alt={`${name} icon`}
                    className={classes.CustomIcon}
                  />
                </div>
              );
            } else if (isSvg(icon)) {
              const source = isUrl(icon) ? icon : `/uploads/${icon}`;

              iconEl = (
                <div className={classes.AppIcon}>
                  <svg
                    data-src={source}
                    fill="var(--color-primary)"
                    className={classes.AppIconSvg}
                  ></svg>
                </div>
              );
            } else {
              iconEl = (
                <div className={classes.AppIcon}>
                  <Icon icon={iconParser(icon)} />
                </div>
              );
            }
          }

          return (
            <a
              href={redirectUrl}
              target={config.appsSameTab ? '' : '_blank'}
              rel="noreferrer"
              key={`app-${app.id}`}
            >
              {app.icon && iconEl}              
              <div className={classes.AppCardDetails}>
                  <h5>{app.name}</h5>
                  <span>{!app.description.length ? displayUrl : app.description}</span>
                </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
