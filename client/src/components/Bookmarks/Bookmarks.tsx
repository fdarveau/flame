import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Bookmark, Category, GlobalState } from '../../interfaces';
import { getBookmarkCategories, getBookmarks } from '../../store/actions';
import ActionButton from '../UI/Buttons/ActionButton/ActionButton';
import Headline from '../UI/Headlines/Headline/Headline';
import { Container } from '../UI/Layout/Layout';
import Modal from '../UI/Modal/Modal';
import Spinner from '../UI/Spinner/Spinner';
import BookmarkForm from './BookmarkForm/BookmarkForm';
import BookmarkGrid from './BookmarkGrid/BookmarkGrid';
import classes from './Bookmarks.module.css';
import BookmarkTable from './BookmarkTable/BookmarkTable';

interface ComponentProps {
  loading: boolean;
  categories: Category[];
  getBookmarkCategories: () => void;
  bookmarks: Bookmark[];
  getBookmarks: () => void;
}

export enum ContentType {
  category,
  bookmark,
}

const Bookmarks = (props: ComponentProps): JSX.Element => {
  const { bookmarks, getBookmarks, getBookmarkCategories, categories, loading } = props;

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
    type: "bookmarks",
    apps: [],
    bookmarks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [bookmarkInUpdate, setBookmarkInUpdate] = useState<Bookmark>({
    name: "string",
    url: "string",
    categoryId: -1,
    icon: "string",
    isPinned: false,
    orderId: 0,
    id: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  useEffect(() => {
    if (bookmarks.length === 0) {
      getBookmarks();
    }
  }, [getBookmarks]);

  useEffect(() => {
    if (categories.length === 0) {
      getBookmarkCategories();
    }
  }, [getBookmarkCategories]);

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
    return "bookmarks" in object;
  };

  const goToUpdateMode = (data: Category | Bookmark): void => {
    setIsInUpdate(true);
    if (instanceOfCategory(data)) {
      setFormContentType(ContentType.category);
      setCategoryInUpdate(data);
    } else {
      setFormContentType(ContentType.bookmark);
      setBookmarkInUpdate(data);
    }
    toggleModal();
  };

  return (
    <Container>
      <Modal isOpen={modalIsOpen} setIsOpen={toggleModal}>
        {!isInUpdate ? (
          <BookmarkForm modalHandler={toggleModal} contentType={formContentType} />
        ) : formContentType === ContentType.category ? (
          <BookmarkForm
            modalHandler={toggleModal}
            contentType={formContentType}
            category={categoryInUpdate}
          />
        ) : (
          <BookmarkForm
            modalHandler={toggleModal}
            contentType={formContentType}
            bookmark={bookmarkInUpdate}
          />
        )}
      </Modal>

      <Headline title="All Bookmarks" subtitle={<Link to="/">Go back</Link>} />

      <div className={classes.ActionsContainer}>
        <ActionButton
          name="Add Category"
          icon="mdiPlusBox"
          handler={() => addActionHandler(ContentType.category)}
        />
        <ActionButton
          name="Add Bookmark"
          icon="mdiPlusBox"
          handler={() => addActionHandler(ContentType.bookmark)}
        />
        <ActionButton
          name="Edit Categories"
          icon="mdiPencil"
          handler={() => editActionHandler(ContentType.category)}
        />
        <ActionButton
          name="Edit Bookmarks"
          icon="mdiPencil"
          handler={() => editActionHandler(ContentType.bookmark)}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : !isInEdit ? (
        <BookmarkGrid categories={categories} bookmarks={bookmarks} />
      ) : (
        <BookmarkTable
          contentType={tableContentType}
          categories={categories}
          bookmarks={bookmarks}
          updateHandler={goToUpdateMode}
        />
      )}
    </Container>
  );
};

const mapStateToProps = (state: GlobalState) => {
  return {
    loading: state.bookmark.loading,
    categories: state.bookmark.categories,
    bookmarks: state.bookmark.bookmarks,
  };
};

export default connect(mapStateToProps, { getBookmarks, getBookmarkCategories })(Bookmarks);
