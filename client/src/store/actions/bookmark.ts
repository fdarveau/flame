import axios from 'axios';
import { Dispatch } from 'redux';

import { ApiResponse, Bookmark, Category, Config, NewBookmark, NewCategory } from '../../interfaces';
import { ActionTypes } from './actionTypes';
import { CreateNotificationAction } from './notification';

/**
 * GET CATEGORIES
 */
export interface GetBookmarkCategoriesAction<T> {
  type: ActionTypes.getBookmarkCategories | ActionTypes.getBookmarkCategoriesSuccess | ActionTypes.getBookmarkCategoriesError;
  payload: T;
}

export const getBookmarkCategories = () => async (dispatch: Dispatch) => {
  dispatch<GetBookmarkCategoriesAction<undefined>>({
    type: ActionTypes.getBookmarkCategories,
    payload: undefined
  })

  try {
    const res = await axios.get<ApiResponse<Category[]>>('/api/categories');

    dispatch<GetBookmarkCategoriesAction<Category[]>>({
      type: ActionTypes.getBookmarkCategoriesSuccess,
      payload: res.data.data.filter((category: Category) => category.type === 'bookmarks'),
    })
  } catch (err) {
    console.log(err);
  }
}

/**
 * ADD CATEGORY
 */
export interface AddBookmarkCategoryAction {
  type: ActionTypes.addBookmarkCategory,
  payload: Category
}

export const addBookmarkCategory = (formData: NewCategory) => async (dispatch: Dispatch) => {
  try {
    const res = await axios.post<ApiResponse<Category>>('/api/categories', formData);

    dispatch<CreateNotificationAction>({
      type: ActionTypes.createNotification,
      payload: {
        title: 'Success',
        message: `Category ${formData.name} created`
      }
    })

    dispatch<AddBookmarkCategoryAction>({
      type: ActionTypes.addBookmarkCategory,
      payload: res.data.data
    })

    dispatch<any>(sortBookmarkCategories());
  } catch (err) {
    console.log(err);
  }
}

/**
 * ADD BOOKMARK
 */
export interface AddBookmarkAction {
  type: ActionTypes.addBookmark,
  payload: Bookmark
}

export const addBookmark = (formData: NewBookmark) => async (dispatch: Dispatch) => {
  try {
    const res = await axios.post<ApiResponse<Bookmark>>('/api/bookmarks', formData);

    dispatch<CreateNotificationAction>({
      type: ActionTypes.createNotification,
      payload: {
        title: 'Success',
        message: `Bookmark ${formData.name} created`
      }
    })

    dispatch<AddBookmarkAction>({
      type: ActionTypes.addBookmark,
      payload: res.data.data
    })
  } catch (err) {
    console.log(err);
  }
}

/**
 * PIN CATEGORY
 */
export interface PinBookmarkCategoryAction {
  type: ActionTypes.pinBookmarkCategory,
  payload: Category
}

export const pinBookmarkCategory = (category: Category) => async (dispatch: Dispatch) => {
  try {
    const { id, isPinned, name } = category;
    const res = await axios.put<ApiResponse<Category>>(`/api/categories/${id}`, { isPinned: !isPinned });

    const status = isPinned ? 'unpinned from Homescreen' : 'pinned to Homescreen';

    dispatch<CreateNotificationAction>({
      type: ActionTypes.createNotification,
      payload: {
        title: 'Success',
        message: `Category ${name} ${status}`
      }
    })

    dispatch<PinBookmarkCategoryAction>({
      type: ActionTypes.pinBookmarkCategory,
      payload: res.data.data
    })
  } catch (err) {
    console.log(err);
  }
}

/**
 * DELETE CATEGORY
 */
export interface DeleteBookmarkCategoryAction {
  type: ActionTypes.deleteBookmarkCategory,
  payload: number
}

export const deleteBookmarkCategory = (id: number) => async (dispatch: Dispatch) => {
  try {
    await axios.delete<ApiResponse<{}>>(`/api/categories/${id}`);

    dispatch<CreateNotificationAction>({
      type: ActionTypes.createNotification,
      payload: {
        title: 'Success',
        message: `Category deleted`
      }
    })

    dispatch<DeleteBookmarkCategoryAction>({
      type: ActionTypes.deleteBookmarkCategory,
      payload: id
    })
  } catch (err) {
    console.log(err);
  }
}

/**
 * UPDATE CATEGORY
 */
export interface UpdateBookmarkCategoryAction {
  type: ActionTypes.updateBookmarkCategory,
  payload: Category
}

export const updateBookmarkCategory = (id: number, formData: NewCategory) => async (dispatch: Dispatch) => {
  try {
    const res = await axios.put<ApiResponse<Category>>(`/api/categories/${id}`, formData);

    dispatch<CreateNotificationAction>({
      type: ActionTypes.createNotification,
      payload: {
        title: 'Success',
        message: `Category ${formData.name} updated`
      }
    })

    dispatch<UpdateBookmarkCategoryAction>({
      type: ActionTypes.updateBookmarkCategory,
      payload: res.data.data
    })

    dispatch<any>(sortBookmarkCategories());
  } catch (err) {
    console.log(err);
  }
}

/**
 * DELETE BOOKMARK
 */
export interface DeleteBookmarkAction {
  type: ActionTypes.deleteBookmark,
  payload: {
    bookmarkId: number,
    categoryId: number
  }
}

export const deleteBookmark = (bookmarkId: number, categoryId: number) => async (dispatch: Dispatch) => {
  try {
    await axios.delete<ApiResponse<{}>>(`/api/bookmarks/${bookmarkId}`);

    dispatch<CreateNotificationAction>({
      type: ActionTypes.createNotification,
      payload: {
        title: 'Success',
        message: 'Bookmark deleted'
      }
    })

    dispatch<DeleteBookmarkAction>({
      type: ActionTypes.deleteBookmark,
      payload: {
        bookmarkId,
        categoryId
      }
    })
  } catch (err) {
    console.log(err);
  }
}

/**
 * UPDATE BOOKMARK
 */
export interface UpdateBookmarkAction {
  type: ActionTypes.updateBookmark,
  payload: Bookmark
}

export const updateBookmark = (bookmarkId: number, formData: NewBookmark, previousCategoryId: number) => async (dispatch: Dispatch) => {
  try {
    const res = await axios.put<ApiResponse<Bookmark>>(`/api/bookmarks/${bookmarkId}`, formData);
    
    dispatch<CreateNotificationAction>({
      type: ActionTypes.createNotification,
      payload: {
        title: 'Success',
        message: `Bookmark ${formData.name} updated`
      }
    })

    // Check if category was changed
    const categoryWasChanged = formData.categoryId !== previousCategoryId;

    if (categoryWasChanged) {
      // Delete bookmark from old category
      dispatch<DeleteBookmarkAction>({
        type: ActionTypes.deleteBookmark,
        payload: {
          bookmarkId,
          categoryId: previousCategoryId
        }
      })

      // Add bookmark to the new category
      dispatch<AddBookmarkAction>({
        type: ActionTypes.addBookmark,
        payload: res.data.data
      })
    } else {
      // Else update only name/url
      dispatch<UpdateBookmarkAction>({
        type: ActionTypes.updateBookmark,
        payload: res.data.data
      })
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * SORT CATEGORIES
 */
export interface SortBookmarkCategoriesAction {
  type: ActionTypes.sortBookmarkCategories;
  payload: string;
}

export const sortBookmarkCategories = () => async (dispatch: Dispatch) => {
  try {
    const res = await axios.get<ApiResponse<Config>>('/api/config/useOrdering');

    dispatch<SortBookmarkCategoriesAction>({
      type: ActionTypes.sortBookmarkCategories,
      payload: res.data.data.value
    })
  } catch (err) {
    console.log(err);
  }
}

/**
 * REORDER CATEGORIES
 */
export interface ReorderBookmarkCategoriesAction {
  type: ActionTypes.reorderBookmarkCategories;
  payload: Category[];
}

interface ReorderQuery {
  categories: {
    id: number;
    orderId: number;
  }[]
}

export const reorderBookmarkCategories = (categories: Category[]) => async (dispatch: Dispatch) => {
  try {
    const updateQuery: ReorderQuery = { categories: [] }

    categories.forEach((category, index) => updateQuery.categories.push({
      id: category.id,
      orderId: index + 1
    }))

    await axios.put<ApiResponse<{}>>('/api/categories/0/reorder', updateQuery);

    dispatch<ReorderBookmarkCategoriesAction>({
      type: ActionTypes.reorderBookmarkCategories,
      payload: categories
    })
  } catch (err) {
    console.log(err);
  }
}