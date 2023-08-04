import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { App, Category } from '../../interfaces';
import { actionCreators } from '../../store';
import { State } from '../../store/reducers';
import { ActionButton, Container, Headline, Message, Modal, Spinner } from '../UI';
import { AppGrid } from './AppGrid/AppGrid';
import classes from './Apps.module.css';
import { Form } from './Form/Form';
import { Table } from './Table/Table';

interface Props {
  searching: boolean;
}

export enum ContentType {
  category,
  app,
}

export const Apps = (props: Props): JSX.Element => {
  // Get Redux state
  const categories = useSelector((state: State) => state.apps.categories);
  const loading = useSelector((state: State) => state.apps.loading);
  const categoryInEdit = useSelector((state: State) => state.apps.categoryInEdit);
  const isAuthenticated = useSelector((state: State) => state.auth.isAuthenticated);

  // Get Redux action creators
  const dispatch = useDispatch();
  const { setEditCategory, setEditApp } =
    bindActionCreators(actionCreators, dispatch);

  // Form
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formContentType, setFormContentType] = useState(ContentType.category);
  const [isInUpdate, setIsInUpdate] = useState(false);

  // Table
  const [showTable, setShowTable] = useState(false);
  const [tableContentType, setTableContentType] = useState(
    ContentType.category
  );

  // Observe if user is authenticated -> set default view (grid) if not
  useEffect(() => {
    if (!isAuthenticated) {
      setShowTable(false);
      setModalIsOpen(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (categoryInEdit && !modalIsOpen) {
      setTableContentType(ContentType.app);
      setShowTable(true);
    }
  }, [categoryInEdit]);

  useEffect(() => {
    setShowTable(false);
    setEditCategory(null);
  }, []);

  // Form actions
  const toggleModal = (): void => {
    setModalIsOpen(!modalIsOpen);
  };

  const openFormForAdding = (contentType: ContentType) => {
    setFormContentType(contentType);
    setIsInUpdate(false);
    toggleModal();
  };

  const openFormForUpdating = (data: Category | App): void => {
    setIsInUpdate(true);

    const instanceOfCategory = (object: any): object is Category => {
      return 'apps' in object;
    };

    if (instanceOfCategory(data)) {
      setFormContentType(ContentType.category);
      setEditCategory(data);
    } else {
      setFormContentType(ContentType.app);
      setEditApp(data);
    }

    toggleModal();
  };

  // Table actions
  const showTableForEditing = (contentType: ContentType) => {
    // We're in the edit mode and the same button was clicked - go back to list
    if (showTable && contentType === tableContentType) {
      setEditCategory(null);
      setShowTable(false);
    } else {
      setShowTable(true);
      setTableContentType(contentType);
    }
  };

  const finishEditing = () => {
    setShowTable(false);
    setEditCategory(null);
  };

  return (
    <Container>
      <Modal isOpen={modalIsOpen} setIsOpen={toggleModal}>
        <Form
          modalHandler={toggleModal}
          contentType={formContentType}
          inUpdate={isInUpdate}
        />
      </Modal>

      <Headline title="All Apps" subtitle={<Link to="/">Go back</Link>} />

      {isAuthenticated && (
        <div className={classes.ActionsContainer}>
          <ActionButton
            name="Add Category"
            icon="mdiPlusBox"
            handler={() => openFormForAdding(ContentType.category)}
          />
          <ActionButton
            name="Add App"
            icon="mdiPlusBox"
            handler={() => openFormForAdding(ContentType.app)}
          />
          <ActionButton
            name="Edit Categories"
            icon="mdiPencil"
            handler={() => showTableForEditing(ContentType.category)}
          />
          {showTable && tableContentType === ContentType.app && (
            <ActionButton
              name="Finish Editing"
              icon="mdiPencil"
              handler={finishEditing}
            />
          )}
        </div>
      )}

      {categories.length && isAuthenticated && !showTable ? (
        <Message isPrimary={false}>
          Click on category name to edit its apps
        </Message>
      ) : (
        <></>
      )}

      {loading ? (
        <Spinner />
      ) : !showTable ? (
        <AppGrid categories={categories} searching={props.searching} />
      ) : (
        <Table
          contentType={tableContentType}
          openFormForUpdating={openFormForUpdating}
        />
      )}
    </Container>
  );
};
