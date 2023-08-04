import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { App, Category, NewApp } from '../../../interfaces';
import { actionCreators } from '../../../store';
import { State } from '../../../store/reducers';
import { inputHandler, newAppTemplate } from '../../../utility';
import { Button, InputGroup, ModalForm } from '../../UI';
import classes from './Form.module.css';

// Redux
// Typescript
// UI
// CSS
// Utils
interface Props {
  modalHandler: () => void;
  app?: App;
}

export const AppsForm = ({
  app,
  modalHandler,
}: Props): JSX.Element => {
  const { categories } = useSelector((state: State) => state.apps);

  const dispatch = useDispatch();
  const { addApp, updateApp, createNotification } =
    bindActionCreators(actionCreators, dispatch);

  const [useCustomIcon, toggleUseCustomIcon] = useState<boolean>(false);
  const [customIcon, setCustomIcon] = useState<File | null>(null);

  const [formData, setFormData] = useState<NewApp>(newAppTemplate);

  // Load app data if provided for editing
  useEffect(() => {
    if (app) {
      setFormData({ ...app });
    } else {
      setFormData(newAppTemplate);
    }
  }, [app]);

  const inputChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    options?: { isNumber?: boolean; isBool?: boolean }
  ) => {
    inputHandler<NewApp>({
      e,
      options,
      setStateHandler: setFormData,
      state: formData,
    });
  };

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setCustomIcon(e.target.files[0]);
    }
  };

  // Apps form handler
  const formSubmitHandler = (e: FormEvent): void => {
    e.preventDefault();

    for (let field of ['name', 'url', 'icon'] as const) {
      if (/^ +$/.test(formData[field])) {
        createNotification({
          title: 'Error',
          message: `Field cannot be empty: ${field}`,
        });

        return;
      }
    }

    const createFormData = (): FormData => {
      const data = new FormData();
      if (customIcon) {
        data.append('icon', customIcon);
      }

      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('url', formData.url);
      data.append('categoryId', `${formData.categoryId}`);
      data.append('isPublic', `${formData.isPublic ? 1 : 0}`);

      return data;
    };

    const checkCategory = (): boolean => {
      if (formData.categoryId < 0) {
        createNotification({
          title: 'Error',
          message: 'Please select category',
        });

        return false;
      }

      return true;
    };

    if (!app) {
      // add new app
      if (!checkCategory()) return;

      if (formData.categoryId < 0) {
        createNotification({
          title: 'Error',
          message: 'Please select category',
        });
        return;
      }

      if (customIcon) {
        const data = createFormData();
        addApp(data);
      } else {
        addApp(formData);
      }

      setFormData({
        ...newAppTemplate,
        categoryId: formData.categoryId,
        isPublic: formData.isPublic,
      });
    } else {
      // update
      if (!checkCategory()) return;

      if (customIcon) {
        const data = createFormData();
        updateApp(app.id, data, {
          prev: app.categoryId,
          curr: formData.categoryId,
        });
      } else {
        updateApp(app.id, formData, {
          prev: app.categoryId,
          curr: formData.categoryId,
        });
      }

      modalHandler();
    }

    setFormData({ ...newAppTemplate, categoryId: formData.categoryId });
    setCustomIcon(null);
  };

  return (
    <ModalForm modalHandler={modalHandler} formHandler={formSubmitHandler}>
      {/* NAME */}
      <InputGroup>
        <label htmlFor="name">App name</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Reddit"
          required
          value={formData.name}
          onChange={(e) => inputChangeHandler(e)}
        />
      </InputGroup>

      {/* URL */}
      <InputGroup>
        <label htmlFor="url">App URL</label>
        <input
          type="text"
          name="url"
          id="url"
          placeholder="reddit.com"
          required
          value={formData.url}
          onChange={(e) => inputChangeHandler(e)}
        />
      </InputGroup>

      {/* CATEGORY */}
      <InputGroup>
        <label htmlFor="categoryId">App Category</label>
        <select
          name="categoryId"
          id="categoryId"
          required
          onChange={(e) => inputChangeHandler(e, { isNumber: true })}
          value={formData.categoryId}
        >
          <option value={-1}>Select category</option>
          {categories.map((category: Category): JSX.Element => {
            return (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            );
          })}
        </select>
      </InputGroup>
      
      {/* DESCRIPTION */}
      <InputGroup>
        <label htmlFor="description">App description</label>
        <input
          type="text"
          name="description"
          id="description"
          placeholder="My self-hosted app"
          value={formData.description}
          onChange={(e) => inputChangeHandler(e)}
        />
        <span>
          Optional - If description is not set, app URL will be displayed
        </span>
      </InputGroup>

      {/* ICON */}
      {!useCustomIcon ? (
        // mdi
        <InputGroup>
          <label htmlFor="icon">App icon</label>
          <input
            type="text"
            name="icon"
            id="icon"
            placeholder="book-open-outline"
            value={formData.icon}
            onChange={(e) => inputChangeHandler(e)}
          />
          <span>
            Use icon name from MDI or pass a valid URL.
            <a href="https://pictogrammers.com/library/mdi/" target="blank">
              {' '}
              Click here for reference
            </a>
          </span>
          <span
            onClick={() => toggleUseCustomIcon(!useCustomIcon)}
            className={classes.Switch}
          >
            Switch to custom icon upload
          </span>
        </InputGroup>
      ) : (
        // custom
        <InputGroup>
          <label htmlFor="icon">App Icon (optional)</label>
          <input
            type="file"
            name="icon"
            id="icon"
            onChange={(e) => fileChangeHandler(e)}
            accept=".jpg,.jpeg,.png,.svg,.ico"
          />
          <span
            onClick={() => {
              setCustomIcon(null);
              toggleUseCustomIcon(!useCustomIcon);
            }}
            className={classes.Switch}
          >
            Switch to MDI
          </span>
        </InputGroup>
      )}

      {/* VISIBILTY */}
      <InputGroup>
        <label htmlFor="isPublic">App visibility</label>
        <select
          id="isPublic"
          name="isPublic"
          value={formData.isPublic ? 1 : 0}
          onChange={(e) => inputChangeHandler(e, { isBool: true })}
        >
          <option value={1}>Visible (anyone can access it)</option>
          <option value={0}>Hidden (authentication required)</option>
        </select>
      </InputGroup>

      <Button>{app ? 'Update app' : 'Add new app'}</Button>
    </ModalForm>
  );
};
