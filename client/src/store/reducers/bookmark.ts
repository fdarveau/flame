import { Bookmark, Category } from '../../interfaces';
import { sortData } from '../../utility';
import { Action, ActionTypes } from '../actions';

export interface State {
  loading: boolean;
  errors: string | undefined;
  categories: Category[];
  bookmarks: Bookmark[];
}

const initialState: State = {
  loading: true,
  errors: undefined,
  categories: [],
  bookmarks: [],
};

const getBookmarks = (state: State, action: Action): State => {
  return {
    ...state,
    loading: true,
    errors: undefined,
  };
};

const getBookmarksSuccess = (state: State, action: Action): State => {
  return {
    ...state,
    loading: false,
    bookmarks: action.payload,
  };
};

const getBookmarksError = (state: State, action: Action): State => {
  return {
    ...state,
    loading: false,
    errors: action.payload,
  };
};

const getCategories = (state: State, action: Action): State => {
  return {
    ...state,
    loading: true,
    errors: undefined,
  };
};

const getCategoriesSuccess = (state: State, action: Action): State => {
  return {
    ...state,
    loading: false,
    categories: action.payload,
  };
};

const addCategory = (state: State, action: Action): State => {
  return {
    ...state,
    categories: [
      ...state.categories,
      {
        ...action.payload,
        type: "bookmarks",
        bookmarks: [],
      },
    ],
  };
};

const pinCategory = (state: State, action: Action): State => {
  const tmpCategories = [...state.categories];
  const changedCategory = tmpCategories.find(
    (category: Category) => category.id === action.payload.id
  );

  if (changedCategory) {
    changedCategory.isPinned = action.payload.isPinned;
  }

  return {
    ...state,
    categories: tmpCategories,
  };
};

const pinBookmark = (state: State, action: Action): State => {
  const tmpBookmarks = [...state.bookmarks];
  const changedBookmark = tmpBookmarks.find(
    (bookmark: Bookmark) => bookmark.id === action.payload.id
  );

  if (changedBookmark) {
    changedBookmark.isPinned = action.payload.isPinned;
  }

  return {
    ...state,
    bookmarks: tmpBookmarks,
  };
};

const addBookmarkSuccess = (state: State, action: Action): State => {
  const categoryIndex = state.categories.findIndex(
    (category: Category) => category.id === action.payload.categoryId
  );

  return {
    ...state,
    categories: [
      ...state.categories.slice(0, categoryIndex),
      {
        ...state.categories[categoryIndex],
        bookmarks: [
          ...state.categories[categoryIndex].bookmarks,
          {
            ...action.payload,
          },
        ],
      },
      ...state.categories.slice(categoryIndex + 1),
    ],
    bookmarks: [...state.bookmarks, action.payload],
  };
};

const deleteCategory = (state: State, action: Action): State => {
  const categoryIndex = state.categories.findIndex(
    (category: Category) => category.id === action.payload
  );

  return {
    ...state,
    categories: [
      ...state.categories.slice(0, categoryIndex),
      ...state.categories.slice(categoryIndex + 1),
    ],
  };
};

const updateCategory = (state: State, action: Action): State => {
  const tmpCategories = [...state.categories];
  const categoryInUpdate = tmpCategories.find(
    (category: Category) => category.id === action.payload.id
  );

  if (categoryInUpdate) {
    categoryInUpdate.name = action.payload.name;
  }

  return {
    ...state,
    categories: tmpCategories,
  };
};

const deleteBookmark = (state: State, action: Action): State => {
  const tmpBookmarks = [...state.bookmarks].filter(
    (bookmark: Bookmark) => bookmark.id !== action.payload.bookmarkId
  );

  const tmpCategories = [...state.categories];
  const categoryInUpdate = tmpCategories.find(
    (category: Category) => category.id === action.payload.categoryId
  );

  if (categoryInUpdate) {
    categoryInUpdate.bookmarks = categoryInUpdate.bookmarks.filter(
      (bookmark: Bookmark) => bookmark.id !== action.payload.bookmarkId
    );
  }

  return {
    ...state,
    categories: tmpCategories,
    bookmarks: tmpBookmarks,
  };
};

const updateBookmark = (state: State, action: Action): State => {
  // Update global bookmarks collection
  const tmpBookmarks = [...state.bookmarks];
  const bookmarkInUpdate = tmpBookmarks.find(
    (bookmark: Bookmark) => bookmark.id === action.payload.id
  );

  if (bookmarkInUpdate) {
    bookmarkInUpdate.name = action.payload.name;
    bookmarkInUpdate.url = action.payload.url;
    bookmarkInUpdate.icon = action.payload.icon;
    bookmarkInUpdate.categoryId = action.payload.categoryId;
  }

  //update category bookmarks collection
  let categoryIndex = state.categories.findIndex(
    (category: Category) => category.id === action.payload.categoryId
  );
  let bookmarkIndex = state.categories[categoryIndex].bookmarks.findIndex(
    (bookmark: Bookmark) => bookmark.id === action.payload.id
  );

  return {
    ...state,
    categories: [
      ...state.categories.slice(0, categoryIndex),
      {
        ...state.categories[categoryIndex],
        bookmarks: [
          ...state.categories[categoryIndex].bookmarks.slice(0, bookmarkIndex),
          {
            ...action.payload,
          },
          ...state.categories[categoryIndex].bookmarks.slice(bookmarkIndex + 1),
        ],
      },
      ...state.categories.slice(categoryIndex + 1),
    ],
    bookmarks: tmpBookmarks,
  };
};

const sortBookmarkCategories = (state: State, action: Action): State => {
  const sortedCategories = sortData<Category>(state.categories, action.payload);

  return {
    ...state,
    categories: sortedCategories,
  };
};

const reorderCategories = (state: State, action: Action): State => {
  return {
    ...state,
    categories: action.payload,
  };
};

const reorderBookmarks = (state: State, action: Action): State => {
  return {
    ...state,
    bookmarks: action.payload,
  };
};

const sortBookmarks = (state: State, action: Action): State => {
  const sortedBookmarks = sortData<Bookmark>(state.bookmarks, action.payload);

  return {
    ...state,
    bookmarks: sortedBookmarks,
  };
};

const bookmarkReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.getBookmarkCategories:
      return getCategories(state, action);
    case ActionTypes.getBookmarkCategoriesSuccess:
      return getCategoriesSuccess(state, action);
    case ActionTypes.getBookmarks:
      return getBookmarks(state, action);
    case ActionTypes.getBookmarksSuccess:
      return getBookmarksSuccess(state, action);
    case ActionTypes.getBookmarksError:
      return getBookmarksError(state, action);
    case ActionTypes.addBookmarkCategory:
      return addCategory(state, action);
    case ActionTypes.addBookmarkSuccess:
      return addBookmarkSuccess(state, action);
    case ActionTypes.pinBookmarkCategory:
      return pinCategory(state, action);
    case ActionTypes.pinBookmark:
      return pinBookmark(state, action);
    case ActionTypes.deleteBookmarkCategory:
      return deleteCategory(state, action);
    case ActionTypes.updateBookmarkCategory:
      return updateCategory(state, action);
    case ActionTypes.deleteBookmark:
      return deleteBookmark(state, action);
    case ActionTypes.updateBookmark:
      return updateBookmark(state, action);
    case ActionTypes.sortBookmarkCategories:
      return sortBookmarkCategories(state, action);
    case ActionTypes.reorderBookmarkCategories:
      return reorderCategories(state, action);
    case ActionTypes.sortBookmarks:
      return sortBookmarks(state, action);
    case ActionTypes.reorderBookmarks:
      return reorderBookmarks(state, action);
    default:
      return state;
  }
};

export default bookmarkReducer;
