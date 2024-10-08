import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Theme } from '../../../../interfaces';
import { actionCreators } from '../../../../store';
import { State } from '../../../../store/reducers';
import { ActionIcons, CompactTable, Icon, ModalForm } from '../../../UI';

// Redux
// Other
interface Props {
  modalHandler: () => void;
}

export const ThemeEditor = (props: Props): JSX.Element => {
  const userThemes = useSelector((state: State) => state.theme.userThemes);

  const { deleteTheme, editTheme } = bindActionCreators(
    actionCreators,
    useDispatch()
  );

  const updateHandler = (theme: Theme) => {
    props.modalHandler();
    editTheme(theme);
  };

  const deleteHandler = (theme: Theme) => {
    if (window.confirm(`Are you sure you want to delete this theme?`)) {
      deleteTheme(theme.name);
    }
  };

  return (
    <ModalForm formHandler={() => {}} modalHandler={props.modalHandler}>
      <CompactTable headers={['Name', 'Actions']}>
        {userThemes.map((t, idx) => (
          <Fragment key={idx}>
            <span>{t.name}</span>
            <ActionIcons>
              <span onClick={() => updateHandler(t)}>
                <Icon icon="mdiPencil" />
              </span>
              <span onClick={() => deleteHandler(t)}>
                <Icon icon="mdiDelete" />
              </span>
            </ActionIcons>
          </Fragment>
        ))}
      </CompactTable>
    </ModalForm>
  );
};
