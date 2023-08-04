import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Theme } from '../../../../interfaces';
import { actionCreators } from '../../../../store';
import { State } from '../../../../store/reducers';
import { Button, Modal } from '../../../UI';
import { ThemeGrid } from '../ThemeGrid/ThemeGrid';
import classes from './ThemeBuilder.module.css';
import { ThemeCreator } from './ThemeCreator';
import { ThemeEditor } from './ThemeEditor';

// Redux
// Other
// UI
interface Props {
  themes: Theme[];
}

export const ThemeBuilder = ({ themes }: Props): JSX.Element => {
  const themeInEdit = useSelector((state: State) => state.theme.themeInEdit);
  const userThemes = useSelector((state: State) => state.theme.userThemes);  
  const isAuthenticated = useSelector((state: State) => state.auth.isAuthenticated);

  const { editTheme } = bindActionCreators(actionCreators, useDispatch());

  const [showModal, toggleShowModal] = useState(false);
  const [isInEdit, toggleIsInEdit] = useState(false);

  useEffect(() => {
    if (themeInEdit) {
      toggleIsInEdit(false);
      toggleShowModal(true);
    }
  }, [themeInEdit]);

  useEffect(() => {
    if (isInEdit && !userThemes.length) {
      toggleIsInEdit(false);
      toggleShowModal(false);
    }
  }, [isInEdit, userThemes]);

  return (
    <div className={classes.ThemeBuilder}>
      {/* MODALS */}
      <Modal
        isOpen={showModal}
        setIsOpen={() => toggleShowModal(!showModal)}
        cb={() => editTheme(null)}
      >
        {isInEdit ? (
          <ThemeEditor modalHandler={() => toggleShowModal(!showModal)} />
        ) : (
          <ThemeCreator modalHandler={() => toggleShowModal(!showModal)} />
        )}
      </Modal>

      {/* USER THEMES */}
      <ThemeGrid themes={themes} />

      {/* BUTTONS */}
      {isAuthenticated && (
        <div className={classes.Buttons}>
          <Button
            click={() => {
              editTheme(null);
              toggleIsInEdit(false);
              toggleShowModal(!showModal);
            }}
          >
            Create new theme
          </Button>

          {themes.length ? (
            <Button
              click={() => {
                toggleIsInEdit(true);
                toggleShowModal(!showModal);
              }}
            >
              Edit user themes
            </Button>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};
