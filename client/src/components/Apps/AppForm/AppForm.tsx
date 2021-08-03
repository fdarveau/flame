import { ChangeEvent, Dispatch, Fragment, SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { App, Category, GlobalState, NewApp, NewCategory, NewNotification } from '../../../interfaces';
import {
  addApp,
  addAppCategory,
  createNotification,
  getAppCategories,
  updateApp,
  updateAppCategory,
} from '../../../store/actions';
import { searchConfig } from '../../../utility';
import Button from '../../UI/Buttons/Button/Button';
import InputGroup from '../../UI/Forms/InputGroup/InputGroup';
import ModalForm from '../../UI/Forms/ModalForm/ModalForm';
import { ContentType } from '../Apps';
import classes from './AppForm.module.css';

interface ComponentProps {
  modalHandler: () => void;
  contentType: ContentType;
  categories: Category[];
  category?: Category;
  app?: App;
  addAppCategory: (formData: NewCategory) => void;
  addApp: (formData: NewApp | FormData) => void;
  updateAppCategory: (id: number, formData: NewCategory) => void;
  updateApp: (id: number, formData: NewApp | FormData, previousCategoryId: number) => void;
  createNotification: (notification: NewNotification) => void;
}

const AppForm = (props: ComponentProps): JSX.Element => {
  const [useCustomIcon, setUseCustomIcon] = useState<boolean>(false);
  const [customIcon, setCustomIcon] = useState<File | null>(null);
  const [categoryData, setCategoryData] = useState<NewCategory>({
    name: '',
    type: 'apps'
  });

  const [appData, setAppData] = useState<NewApp>({
    name: '',
    url: '',
    categoryId: -1,
    icon: '',
    statusIndicatorEnabled: searchConfig('appStatusIndicatorEnabledByDefault', true)
  });

  // Load category data if provided for editing
  useEffect(() => {
    if (props.category) {
      setCategoryData({ name: props.category.name, type: props.category.type });
    } else {
      setCategoryData({ name: '', type: "apps" });
    }
  }, [props.category]);

  // Load app data if provided for editing
  useEffect(() => {
    if (props.app) {
      setAppData({
        name: props.app.name,
        url: props.app.url,
        categoryId: props.app.categoryId,
        icon: props.app.icon,
        statusIndicatorEnabled: props.app.statusIndicatorEnabled
      })
    } else {
      setAppData({
        name: '',
        url: '',
        categoryId: -1,
        icon: '',
        statusIndicatorEnabled: searchConfig('appStatusIndicatorEnabledByDefault', true)
      })
    }
  }, [props.app]);

  const formSubmitHandler = (e: SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const createFormData = (): FormData => {
      const data = new FormData();
      Object.entries(appData).forEach((entry: [string, any]) => {
        data.append(entry[0], entry[1]);
      });
      if (customIcon) {
        data.append('icon', customIcon);
      }

      return data;
    }

    if (!props.category && !props.app) {
      // Add new
      if (props.contentType === ContentType.category) {
        // Add category
        props.addAppCategory(categoryData);
        setCategoryData({ name: '', type: 'apps' });
      } else if (props.contentType === ContentType.app) {
        // Add app
        if (appData.categoryId === -1) {
          props.createNotification({
            title: 'Error',
            message: 'Please select category'
          })
          return;
        }
        if (customIcon) {
          const data = createFormData();
          props.addApp(data);
        } else {
          props.addApp(appData);
        }
      }
    } else {
      // Update
      if (props.contentType === ContentType.category && props.category) {
        // Update category
        props.updateAppCategory(props.category.id, categoryData);
        setCategoryData({ name: '', type: 'apps' });
      } else if (props.contentType === ContentType.app && props.app) {
        // Update app
        if (customIcon) {          
          const data = createFormData();
          props.updateApp(props.app.id, data, props.app.categoryId);
        } else {
          props.updateApp(props.app.id, appData, props.app.categoryId);
          props.modalHandler();
        }
      }
    }

    setAppData({
      name: '',
      url: '',
      categoryId: -1,
      icon: '',
      statusIndicatorEnabled: searchConfig('appStatusIndicatorEnabledByDefault', true)
    });
      
    setCustomIcon(null);
  }

  const toggleUseCustomIcon = (): void => {
    setUseCustomIcon(!useCustomIcon);
    setCustomIcon(null);
  };

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>, setDataFunction: Dispatch<SetStateAction<any>>, data: any): void => {
    setDataFunction({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const checkboxChangeHandler = (e: ChangeEvent<HTMLInputElement>, setDataFunction: Dispatch<SetStateAction<any>>, data: any): void => {
    setDataFunction({
      ...data,
      [e.target.name]: e.target.checked
    })
  }

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setCustomIcon(e.target.files[0]);
    }
  }

  const selectChangeHandler = (e: ChangeEvent<HTMLSelectElement>, setDataFunction: Dispatch<SetStateAction<any>>, data: any): void => {
    setDataFunction({
      ...data,
      categoryId: parseInt(e.target.value)
    })
  }

  let button = <Button>Submit</Button>

  if (!props.category && !props.app) {
    if (props.contentType === ContentType.category) {
      button = <Button>Add new category</Button>;
    } else {
      button = <Button>Add new app</Button>;
    }
  } else if (props.category) {
    button = <Button>Update category</Button>
  } else if (props.app) {
    button = <Button>Update app</Button>
  }

  return (
    <ModalForm
      modalHandler={props.modalHandler}
      formHandler={formSubmitHandler}
    >
      {props.contentType === ContentType.category
        ? (
          <Fragment>
            <InputGroup>
              <label htmlFor='categoryName'>Category Name</label>
              <input
                type='text'
                name='name'
                id='categoryName'
                placeholder='Social Media'
                required
                value={categoryData.name}
                onChange={(e) => inputChangeHandler(e, setCategoryData, categoryData)}
              />
            </InputGroup>
          </Fragment>
        )
        : (
          <Fragment>
            <InputGroup>
              <label htmlFor='name'>App Name</label>
              <input
                type='text'
                name='name'
                id='name'
                placeholder='Bookstack'
                required
                value={appData.name}
                onChange={(e) => inputChangeHandler(e, setAppData, appData)}
              />
            </InputGroup>
            <InputGroup>
              <label htmlFor='url'>App URL</label>
              <input
                type='text'
                name='url'
                id='url'
                placeholder='bookstack.example.com'
                required
                value={appData.url}
                onChange={(e) => inputChangeHandler(e, setAppData, appData)}
              />
              <span>
                <a
                  href='https://github.com/pawelmalak/flame#supported-url-formats-for-applications-and-bookmarks'
                  target='_blank'
                  rel='noreferrer'
                >
                  {' '}Check supported URL formats
                </a>
              </span>
            </InputGroup>
            <InputGroup>
              <label htmlFor='categoryId'>App Category</label>
              <select
                name='categoryId'
                id='categoryId'
                required
                onChange={(e) => selectChangeHandler(e, setAppData, appData)}
                value={appData.categoryId}
              >
                <option value={-1}>Select category</option>
                {props.categories.map((category: Category): JSX.Element => {
                  return (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                })}
              </select>
            </InputGroup>
            {!useCustomIcon
              // use mdi icon
              ? (<InputGroup>
                  <label htmlFor='icon'>App Icon</label>
                  <input
                    type='text'
                    name='icon'
                    id='icon'
                    placeholder='book-open-outline'
                    required
                    value={appData.icon}
                    onChange={(e) => inputChangeHandler(e, setAppData, appData)}
                  />
                  <span>
                    Use icon name from MDI. 
                    <a
                      href='https://materialdesignicons.com/'
                      target='blank'>
                      {' '}Click here for reference
                    </a>
                  </span>
                  <span
                    onClick={() => toggleUseCustomIcon()}
                    className={classes.Switch}>
                    Switch to custom icon upload
                  </span>
                </InputGroup>)
              // upload custom icon
              : (<InputGroup>
                  <label htmlFor='icon'>App Icon</label>
                  <input
                    type='file'
                    name='icon'
                    id='icon'
                    required
                    onChange={(e) => fileChangeHandler(e)}
                    accept='.jpg,.jpeg,.png'
                  />
                  <span
                    onClick={() => toggleUseCustomIcon()}
                    className={classes.Switch}>
                    Switch to MDI
                  </span>
                </InputGroup>)
            }
            <InputGroup>
                <label htmlFor='statusIndicatorEnabled' className={classes.CheckboxLabel}>Enable status indicator</label>
                <input
                  type='checkbox'
                  id='statusIndicatorEnabled'
                  name='statusIndicatorEnabled' 
                  className={classes.Checkbox}
                  defaultChecked={appData.statusIndicatorEnabled}
                  onChange={(e) => checkboxChangeHandler(e, setAppData, appData)}
                />
            </InputGroup>
          </Fragment>
        )
      }
      {button}
    </ModalForm>
  )
}

const mapStateToProps = (state: GlobalState) => {
  return {
    categories: state.app.categories
  }
}

const dispatchMap = {
  getAppCategories,
  addAppCategory,
  addApp,
  updateAppCategory,
  updateApp,
  createNotification
}

export default connect(mapStateToProps, dispatchMap)(AppForm);