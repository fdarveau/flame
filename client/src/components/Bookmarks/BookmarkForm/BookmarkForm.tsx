import { ChangeEvent, Dispatch, Fragment, SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Bookmark, Category, GlobalState, NewBookmark, NewCategory, NewNotification } from '../../../interfaces';
import {
  addBookmark,
  addBookmarkCategory,
  createNotification,
  getBookmarkCategories,
  updateBookmark,
  updateBookmarkCategory,
} from '../../../store/actions';
import Button from '../../UI/Buttons/Button/Button';
import InputGroup from '../../UI/Forms/InputGroup/InputGroup';
import ModalForm from '../../UI/Forms/ModalForm/ModalForm';
import { ContentType } from '../Bookmarks';
import classes from './BookmarkForm.module.css';

interface ComponentProps {
  modalHandler: () => void;
  contentType: ContentType;
  categories: Category[];
  category?: Category;
  bookmark?: Bookmark;
  addBookmarkCategory: (formData: NewCategory) => void;
  addBookmark: (formData: NewBookmark | FormData) => void;
  updateBookmarkCategory: (id: number, formData: NewCategory) => void;
  updateBookmark: (
    id: number,
    formData: NewBookmark,
    previousCategoryId: number
  ) => void;
  createNotification: (notification: NewNotification) => void;
}

const BookmarkForm = (props: ComponentProps): JSX.Element => {
  const [categoryData, setCategoryData] = useState<NewCategory>({
    name: "",
    type: "bookmarks",
  });
  const [useCustomIcon, setUseCustomIcon] = useState<boolean>(false);
  const [customIcon, setCustomIcon] = useState<File | null>(null);

  const [bookmarkData, setBookmarkData] = useState<NewBookmark>({
    name: "",
    url: "",
    categoryId: -1,
    icon: "",
  });

  // Load category data if provided for editing
  useEffect(() => {
    if (props.category) {
      setCategoryData({ name: props.category.name, type: props.category.type });
    } else {
      setCategoryData({ name: "", type: "bookmarks" });
    }
  }, [props.category]);

  // Load bookmark data if provided for editing
  useEffect(() => {
    if (props.bookmark) {
      setBookmarkData({
        name: props.bookmark.name,
        url: props.bookmark.url,
        categoryId: props.bookmark.categoryId,
        icon: props.bookmark.icon,
      });
    } else {
      setBookmarkData({
        name: "",
        url: "",
        categoryId: -1,
        icon: "",
      });
    }
  }, [props.bookmark]);

  const formSubmitHandler = (e: SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!props.category && !props.bookmark) {
      // Add new
      if (props.contentType === ContentType.category) {
        // Add category
        props.addBookmarkCategory(categoryData);
        setCategoryData({ name: "", type: "bookmarks" });
      } else if (props.contentType === ContentType.bookmark) {
        // Add bookmark
        if (bookmarkData.categoryId === -1) {
          props.createNotification({
            title: "Error",
            message: "Please select category",
          });
          return;
        }

        if (customIcon) {
          const data = new FormData();
          Object.entries(bookmarkData).forEach((entry: [string, any]) => {
            data.append(entry[0], entry[1]);
          });

          data.append("icon", customIcon);

          props.addBookmark(data);
        } else {
          props.addBookmark(bookmarkData);
        }
        setBookmarkData({
          name: "",
          url: "",
          categoryId: bookmarkData.categoryId,
          icon: "",
        });
      }
    } else {
      // Update
      if (props.contentType === ContentType.category && props.category) {
        // Update category
        props.updateBookmarkCategory(props.category.id, categoryData);
        setCategoryData({ name: "", type: "bookmarks" });
      } else if (props.contentType === ContentType.bookmark && props.bookmark) {
        // Update bookmark
        props.updateBookmark(
          props.bookmark.id,
          bookmarkData,
          props.bookmark.categoryId
        );
        setBookmarkData({
          name: "",
          url: "",
          categoryId: -1,
          icon: "",
        });
      }

      props.modalHandler();
    }
  };

  const toggleUseCustomIcon = (): void => {
    setUseCustomIcon(!useCustomIcon);
    setCustomIcon(null);
  };

  const inputChangeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    setDataFunction: Dispatch<SetStateAction<any>>,
    data: any
  ): void => {
    setDataFunction({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setCustomIcon(e.target.files[0]);
    }
  };

  const selectChangeHandler = (
    e: ChangeEvent<HTMLSelectElement>,
    setDataFunction: Dispatch<SetStateAction<any>>,
    data: any
  ): void => {
    setDataFunction({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  let button = <Button>Submit</Button>;

  if (!props.category && !props.bookmark) {
    if (props.contentType === ContentType.category) {
      button = <Button>Add new category</Button>;
    } else {
      button = <Button>Add new bookmark</Button>;
    }
  } else if (props.category) {
    button = <Button>Update category</Button>;
  } else if (props.bookmark) {
    button = <Button>Update bookmark</Button>;
  }

  return (
    <ModalForm
      modalHandler={props.modalHandler}
      formHandler={formSubmitHandler}
    >
      {props.contentType === ContentType.category ? (
        <Fragment>
          <InputGroup>
            <label htmlFor="categoryName">Category Name</label>
            <input
              type="text"
              name="name"
              id="categoryName"
              placeholder="Social Media"
              required
              value={categoryData.name}
              onChange={(e) =>
                inputChangeHandler(e, setCategoryData, categoryData)
              }
            />
          </InputGroup>
        </Fragment>
      ) : (
        <Fragment>
          <InputGroup>
            <label htmlFor="name">Bookmark Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Bookstack"
              required
              value={bookmarkData.name}
              onChange={(e) =>
                inputChangeHandler(e, setBookmarkData, bookmarkData)
              }
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor="url">Bookmark URL</label>
            <input
              type="text"
              name="url"
              id="url"
              placeholder="bookstack.example.com"
              required
              value={bookmarkData.url}
              onChange={(e) =>
                inputChangeHandler(e, setBookmarkData, bookmarkData)
              }
            />
            <span>
              <a
                href="https://github.com/pawelmalak/flame#supported-url-formats-for-bookmarklications-and-bookmarks"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                Check supported URL formats
              </a>
            </span>
          </InputGroup>
          <InputGroup>
            <label htmlFor="categoryId">Bookmark Category</label>
            <select
              name="categoryId"
              id="categoryId"
              required
              onChange={(e) =>
                selectChangeHandler(e, setBookmarkData, bookmarkData)
              }
              value={bookmarkData.categoryId}
            >
              <option value={-1}>Select category</option>
              {props.categories.map((category: Category): JSX.Element => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </InputGroup>
          {!useCustomIcon ? (
            // use mdi icon
            <InputGroup>
              <label htmlFor="icon">Bookmark Icon</label>
              <input
                type="text"
                name="icon"
                id="icon"
                placeholder="book-open-outline"
                value={bookmarkData.icon}
                onChange={(e) =>
                  inputChangeHandler(e, setBookmarkData, bookmarkData)
                }
              />
              <span>
                Use icon name from MDI.
                <a href="https://materialdesignicons.com/" target="blank">
                  {" "}
                  Click here for reference
                </a>
              </span>
              <span
                onClick={(e) => toggleUseCustomIcon()}
                className={classes.Switch}
              >
                Switch to custom icon upload
              </span>
            </InputGroup>
          ) : (
            // upload custom icon
            <InputGroup>
              <label htmlFor="icon">Bookmark Icon</label>
              <input
                type="file"
                name="icon"
                id="icon"
                required
                onChange={(e) => fileChangeHandler(e)}
                accept=".jpg,.jpeg,.png"
              />
              <span
                onClick={(e) => toggleUseCustomIcon()}
                className={classes.Switch}
              >
                Switch to MDI
              </span>
            </InputGroup>
          )}
        </Fragment>
      )}
      {button}
    </ModalForm>
  );
};

const mapStateToProps = (state: GlobalState) => {
  return {
    categories: state.bookmark.categories,
  };
};

const dispatchMap = {
  getBookmarkCategories,
  addBookmarkCategory,
  addBookmark,
  updateBookmarkCategory,
  updateBookmark,
  createNotification,
};

export default connect(mapStateToProps, dispatchMap)(BookmarkForm);
