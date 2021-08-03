import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { App, Category, GlobalState } from '../../interfaces';
import { getAppCategories, getApps } from '../../store/actions';
import ActionButton from '../UI/Buttons/ActionButton/ActionButton';
import Headline from '../UI/Headlines/Headline/Headline';
import { Container } from '../UI/Layout/Layout';
import Modal from '../UI/Modal/Modal';
import Spinner from '../UI/Spinner/Spinner';
import AppForm from './AppForm/AppForm';
import AppGrid from './AppGrid/AppGrid';
import classes from './Apps.module.css';
import AppTable from './AppTable/AppTable';

interface ComponentProps {
  loading: boolean;
  categories: Category[];
  getAppCategories: () => void;
  apps: App[];
  getApps: () => void;
}

export enum ContentType {
  category,
  app,
}

const Apps = (props: ComponentProps): JSX.Element => {
  const { apps, getApps, getAppCategories, categories, loading } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formContentType, setFormContentType] = useState(ContentType.category);
  const [isInEdit, setIsInEdit] = useState(false);
  const [tableContentType, setTableContentType] = useState(
    ContentType.category
  );
  const [isInUpdate, setIsInUpdate] = useState(false);
  const [categoryInUpdate, setCategoryInUpdate] = useState<Category>({
    name: "",
    id: -1,
    isPinned: false,
    orderId: 0,
    type: "apps",
    apps: [],
    bookmarks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [appInUpdate, setAppInUpdate] = useState<App>({
    name: "string",
    url: "string",
    categoryId: -1,
    icon: "string",
    isPinned: false,
    orderId: 0,
    statusIndicatorEnabled: false,
    id: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  useEffect(() => {
    if (apps.length === 0) {
      getApps();
    }
  }, [getApps]);

  useEffect(() => {
    if (categories.length === 0) {
      getAppCategories();
    }
  }, [getAppCategories]);

  const toggleModal = (): void => {
    setModalIsOpen(!modalIsOpen);
  };

  const addActionHandler = (contentType: ContentType) => {
    setFormContentType(contentType);
    setIsInUpdate(false);
    toggleModal();
  };

  const editActionHandler = (contentType: ContentType) => {
    // We're in the edit mode and the same button was clicked - go back to list
    if (isInEdit && contentType === tableContentType) {
      setIsInEdit(false);
    } else {
      setIsInEdit(true);
      setTableContentType(contentType);
    }
  };

  const instanceOfCategory = (object: any): object is Category => {
    return "apps" in object;
  };

  const goToUpdateMode = (data: Category | App): void => {
    setIsInUpdate(true);
    if (instanceOfCategory(data)) {
      setFormContentType(ContentType.category);
      setCategoryInUpdate(data);
    } else {
      setFormContentType(ContentType.app);
      setAppInUpdate(data);
    }
    toggleModal();
  };

  return (
    <Container>
      <Modal isOpen={modalIsOpen} setIsOpen={toggleModal}>
        {!isInUpdate ? (
          <AppForm modalHandler={toggleModal} contentType={formContentType} />
        ) : formContentType === ContentType.category ? (
          <AppForm
            modalHandler={toggleModal}
            contentType={formContentType}
            category={categoryInUpdate}
          />
        ) : (
          <AppForm
            modalHandler={toggleModal}
            contentType={formContentType}
            app={appInUpdate}
          />
        )}
      </Modal>

      <Headline title="All Apps" subtitle={<Link to="/">Go back</Link>} />

      <div className={classes.ActionsContainer}>
        <ActionButton
          name="Add Category"
          icon="mdiPlusBox"
          handler={() => addActionHandler(ContentType.category)}
        />
        <ActionButton
          name="Add App"
          icon="mdiPlusBox"
          handler={() => addActionHandler(ContentType.app)}
        />
        <ActionButton
          name="Edit Categories"
          icon="mdiPencil"
          handler={() => editActionHandler(ContentType.category)}
        />
        <ActionButton
          name="Edit Apps"
          icon="mdiPencil"
          handler={() => editActionHandler(ContentType.app)}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : !isInEdit ? (
        <AppGrid categories={categories} apps={apps} />
      ) : (
        <AppTable
          contentType={tableContentType}
          categories={categories}
          apps={apps}
          updateHandler={goToUpdateMode}
        />
      )}
    </Container>
  );
};

const mapStateToProps = (state: GlobalState) => {
  return {
    loading: state.app.loading,
    categories: state.app.categories,
    apps: state.app.apps,
  };
};

export default connect(mapStateToProps, { getApps, getAppCategories })(Apps);
