import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Theme, ThemeSettingsForm } from '../../../interfaces';
import { actionCreators } from '../../../store';
import { State } from '../../../store/reducers';
import { inputHandler, parseThemeToPAB, themeSettingsTemplate } from '../../../utility';
import { Button, InputGroup, SettingsHeadline, Spinner } from '../../UI';
import { ThemeBuilder } from './ThemeBuilder/ThemeBuilder';
import { ThemeGrid } from './ThemeGrid/ThemeGrid';

// Redux
// Typescript
// Components
// Other
export const Themer = (): JSX.Element => {  
  const themes = useSelector((state: State) => state.theme.themes);
  const userThemes = useSelector((state: State) => state.theme.userThemes);  
  const config = useSelector((state: State) => state.config.config);
  const loading = useSelector((state: State) => state.config.loading);
  const isAuthenticated = useSelector((state: State) => state.auth.isAuthenticated);

  const dispatch = useDispatch();
  const { updateConfig } = bindActionCreators(actionCreators, dispatch);

  // Initial state
  const [formData, setFormData] = useState<ThemeSettingsForm>(
    themeSettingsTemplate
  );

  // Get config
  useEffect(() => {
    setFormData({
      ...config,
    });
  }, [loading]);

  // Form handler
  const formSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    // Save settings
    await updateConfig({ ...formData });
  };

  // Input handler
  const inputChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    options?: { isNumber?: boolean; isBool?: boolean }
  ) => {
    inputHandler<ThemeSettingsForm>({
      e,
      options,
      setStateHandler: setFormData,
      state: formData,
    });
  };

  const customThemesEl = (
    <Fragment>
      <SettingsHeadline text="User themes" />
      <ThemeBuilder themes={userThemes} />
    </Fragment>
  );

  return (
    <Fragment>
      <SettingsHeadline text="App themes" />
      {!themes.length ? <Spinner /> : <ThemeGrid themes={themes} />}

      {!userThemes.length ? isAuthenticated && customThemesEl : customThemesEl}

      {isAuthenticated && (
        <form onSubmit={formSubmitHandler}>
          <SettingsHeadline text="Other settings" />
          <InputGroup>
            <label htmlFor="defaultTheme">Default theme for new users</label>
            <select
              id="defaultTheme"
              name="defaultTheme"
              value={formData.defaultTheme}
              onChange={(e) => inputChangeHandler(e)}
            >
              {[...themes, ...userThemes].map((theme: Theme, idx) => (
                <option key={idx} value={parseThemeToPAB(theme.colors)}>
                  {theme.isCustom && '+'} {theme.name}
                </option>
              ))}
            </select>
          </InputGroup>

          <Button>Save changes</Button>
        </form>
      )}
    </Fragment>
  );
};
