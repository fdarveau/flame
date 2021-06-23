import { ChangeEvent, Fragment, SyntheticEvent, useEffect, useState } from 'react';
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

interface ComponentProps {
  modalHandler: () => void;
  contentType: ContentType;
  categories: Category[];
  category?: Category;
  bookmark?: Bookmark;
  addBookmarkCategory: (formData: NewCategory) => void;
  addBookmark: (formData: NewBookmark) => void;
  updateBookmarkCategory: (id: number, formData: NewCategory) => void;
  updateBookmark: (id: number, formData: NewBookmark, previousCategoryId: number) => void;
  createNotification: (notification: NewNotification) => void;
}

const BookmarkForm = (props: ComponentProps): JSX.Element => {
  const [categoryData, setCategoryData] = useState<NewCategory>({
    name: '',
    type: 'bookmarks'
  })

  const [bookmarkData, setBookmarkData] = useState<NewBookmark>({
    name: '',
    url: '',
    categoryId: -1,
    icon: ''
  })

  // Load category data if provided for editing
  useEffect(() => {
    if (props.category) {
      setCategoryData({ name: props.category.name, type: props.category.type });
    } else {
      setCategoryData({ name: '', type: "bookmarks" });
    }
  }, [props.category])

  // Load bookmark data if provided for editing
  useEffect(() => {
    if (props.bookmark) {
      setBookmarkData({
        name: props.bookmark.name,
        url: props.bookmark.url,
        categoryId: props.bookmark.categoryId,
        icon: props.bookmark.icon
      })
    } else {
      setBookmarkData({
        name: '',
        url: '',
        categoryId: -1,
        icon: ''
      })
    }
  }, [props.bookmark])

  const formSubmitHandler = (e: SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!props.category && !props.bookmark) {
      // Add new
      if (props.contentType === ContentType.category) {
        // Add category
        props.addBookmarkCategory(categoryData);
        setCategoryData({ name: '', type: 'bookmarks' });
      } else if (props.contentType === ContentType.bookmark) {
        // Add bookmark
        if (bookmarkData.categoryId === -1) {
          props.createNotification({
            title: 'Error',
            message: 'Please select category'
          })
          return;
        }
  
        props.addBookmark(bookmarkData);
        setBookmarkData({
          name: '',
          url: '',
          categoryId: bookmarkData.categoryId,
          icon: ''
        })
      }
    } else {
      // Update
      if (props.contentType === ContentType.category && props.category) {
        // Update category
        props.updateBookmarkCategory(props.category.id, categoryData);
        setCategoryData({ name: '', type: 'bookmarks' });
      } else if (props.contentType === ContentType.bookmark && props.bookmark) {
        // Update bookmark
        props.updateBookmark(props.bookmark.id, bookmarkData, props.bookmark.categoryId);
        setBookmarkData({
          name: '',
          url: '',
          categoryId: -1,
          icon: ''
        })
      }

      props.modalHandler();
    }
  }

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>, data: any): void => {
    setBookmarkData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const selectChangeHandler = (e: ChangeEvent<HTMLSelectElement>, data: any): void => {
    setBookmarkData({
      ...data,
      categoryId: parseInt(e.target.value)
    })
  }

  let button = <Button>Submit</Button>

  if (!props.category && !props.bookmark) {
    if (props.contentType === ContentType.category) {
      button = <Button>Add new category</Button>;
    } else {
      button = <Button>Add new bookmark</Button>;
    }
  } else if (props.category) {
    button = <Button>Update category</Button>
  } else if (props.bookmark) {
    button = <Button>Update bookmark</Button>
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
                name='categoryName'
                id='categoryName'
                placeholder='Social Media'
                required
                value={categoryData.name}
                onChange={(e) => inputChangeHandler(e, categoryData)}
              />
            </InputGroup>
          </Fragment>
        )
        : (
          <Fragment>
            <InputGroup>
              <label htmlFor='name'>Bookmark Name</label>
              <input
                type='text'
                name='name'
                id='name'
                placeholder='Reddit'
                required
                value={bookmarkData.name}
                onChange={(e) => inputChangeHandler(e, bookmarkData)}
              />
            </InputGroup>
            <InputGroup>
              <label htmlFor='url'>Bookmark URL</label>
              <input
                type='text'
                name='url'
                id='url'
                placeholder='reddit.com'
                required
                value={bookmarkData.url}
                onChange={(e) => inputChangeHandler(e, bookmarkData)}
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
              <label htmlFor='categoryId'>Bookmark Category</label>
              <select
                name='categoryId'
                id='categoryId'
                required
                onChange={(e) => selectChangeHandler(e, bookmarkData)}
                value={bookmarkData.categoryId}
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
            <InputGroup>
              <label htmlFor='icon'>Bookmark Icon (optional)</label>
              <input
                type='text'
                name='icon'
                id='icon'
                placeholder='book-open-outline'
                value={bookmarkData.icon}
                onChange={(e) => inputChangeHandler(e, bookmarkData)}
              />
              <span>
                Use icon name from MDI. 
                <a
                  href='https://materialdesignicons.com/'
                  target='blank'>
                  {' '}Click here for reference
                </a>
              </span>
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
    categories: state.bookmark.categories
  }
}

const dispatchMap = {
  getBookmarkCategories,
  addBookmarkCategory,
  addBookmark,
  updateBookmarkCategory,
  updateBookmark,
  createNotification
}

export default connect(mapStateToProps, dispatchMap)(BookmarkForm);