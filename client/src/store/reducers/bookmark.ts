import { Bookmark, Category } from '../../interfaces';
import { sortData } from '../../utility';
import { Action, ActionTypes } from '../actions';

export interface State {
  loading: boolean;
  errors: string | undefined;
  categories: Category[];
}

const initialState: State = {
  loading: true,
  errors: undefined,
  categories: []
}

const getCategories = (state: State, action: Action): State => {
  return {
    ...state,
    loading: true,
    errors: undefined
  }
}

const getCategoriesSuccess = (state: State, action: Action): State => {
  return {
    ...state,
    loading: false,
    categories: action.payload
  }
}

const addCategory = (state: State, action: Action): State => {
  return {
    ...state,
    categories: [
      ...state.categories,
      {
        ...action.payload,
        type: 'bookmarks',
        bookmarks: []
      }
    ]
  }
}

const addBookmark = (state: State, action: Action): State => {
  const categoryIndex = state.categories.findIndex((category: Category) => category.id === action.payload.categoryId);

  return {
    ...state,
    categories: [
      ...state.categories.slice(0, categoryIndex),
      {
        ...state.categories[categoryIndex],
        bookmarks: [
          ...state.categories[categoryIndex].bookmarks,
          {
            ...action.payload
          }
        ]
      },
      ...state.categories.slice(categoryIndex + 1)
    ]
  }
}

const pinCategory = (state: State, action: Action): State => {
  const tmpCategories = [...state.categories];
  const changedCategory = tmpCategories.find((category: Category) => category.id === action.payload.id);

  if (changedCategory) {
    changedCategory.isPinned = action.payload.isPinned;
  }

  return {
    ...state,
    categories: tmpCategories
  }
}

const deleteCategory = (state: State, action: Action): State => {
  const categoryIndex = state.categories.findIndex((category: Category) => category.id === action.payload);

  return {
    ...state,
    categories: [
      ...state.categories.slice(0, categoryIndex),
      ...state.categories.slice(categoryIndex + 1)
    ]
  }
}

const updateCategory = (state: State, action: Action): State => {
  const tmpCategories = [...state.categories];
  const categoryInUpdate = tmpCategories.find((category: Category) => category.id === action.payload.id);

  if (categoryInUpdate) {
    categoryInUpdate.name = action.payload.name;
  }

  return {
    ...state,
    categories: tmpCategories
  }
}

const deleteBookmark = (state: State, action: Action): State => {
  const tmpCategories = [...state.categories];
  const categoryInUpdate = tmpCategories.find((category: Category) => category.id === action.payload.categoryId);

  if (categoryInUpdate) {
    categoryInUpdate.bookmarks = categoryInUpdate.bookmarks.filter((bookmark: Bookmark) => bookmark.id !== action.payload.bookmarkId);
  }

  
  return {
    ...state,
    categories: tmpCategories
  }
}

const updateBookmark = (state: State, action: Action): State => {
  let categoryIndex = state.categories.findIndex((category: Category) => category.id === action.payload.categoryId);
  let bookmarkIndex = state.categories[categoryIndex].bookmarks.findIndex((bookmark: Bookmark) => bookmark.id === action.payload.id);

  return {
    ...state,
    categories: [
      ...state.categories.slice(0, categoryIndex),
      {
        ...state.categories[categoryIndex],
        bookmarks: [
          ...state.categories[categoryIndex].bookmarks.slice(0, bookmarkIndex),
          {
            ...action.payload
          },
          ...state.categories[categoryIndex].bookmarks.slice(bookmarkIndex + 1)
        ]
      },
      ...state.categories.slice(categoryIndex + 1)
    ]
  }
}

const sortBookmarkCategories = (state: State, action: Action): State => {
  const sortedCategories = sortData<Category>(state.categories, action.payload);

  return {
    ...state,
    categories: sortedCategories
  }
}

const reorderCategories = (state: State, action: Action): State => {
  return {
    ...state,
    categories: action.payload
  }
}

const bookmarkReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.getBookmarkCategories: return getCategories(state, action);
    case ActionTypes.getBookmarkCategoriesSuccess: return getCategoriesSuccess(state, action);
    case ActionTypes.addBookmarkCategory: return addCategory(state, action);
    case ActionTypes.addBookmark: return addBookmark(state, action);
    case ActionTypes.pinBookmarkCategory: return pinCategory(state, action);
    case ActionTypes.deleteBookmarkCategory: return deleteCategory(state, action);
    case ActionTypes.updateBookmarkCategory: return updateCategory(state, action);
    case ActionTypes.deleteBookmark: return deleteBookmark(state, action);
    case ActionTypes.updateBookmark: return updateBookmark(state, action);
    case ActionTypes.sortBookmarkCategories: return sortBookmarkCategories(state, action);
    case ActionTypes.reorderBookmarkCategories: return reorderCategories(state, action);
    default: return state;
  }
}

export default bookmarkReducer;