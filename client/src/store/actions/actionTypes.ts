import {
  AddAppAction,
  AddAppCategoryAction,
  AddBookmarkAction,
  AddBookmarkCategoryAction,
  ClearNotificationAction,
  CreateNotificationAction,
  DeleteAppAction,
  DeleteAppCategoryAction,
  DeleteBookmarkAction,
  DeleteBookmarkCategoryAction,
  GetAppCategoriesAction,
  GetAppsAction,
  GetBookmarkCategoriesAction,
  GetBookmarksAction,
  GetConfigAction,
  PinAppAction,
  PinAppCategoryAction,
  PinBookmarkAction,
  PinBookmarkCategoryAction,
  ReorderAppCategoriesAction,
  ReorderAppsAction,
  ReorderBookmarkCategoriesAction,
  ReorderBookmarksAction,
  SetThemeAction,
  SortAppCategoriesAction,
  SortAppsAction,
  SortBookmarkCategoriesAction,
  SortBookmarksAction,
  UpdateAppAction,
  UpdateAppCategoryAction,
  UpdateBookmarkAction,
  UpdateBookmarkCategoryAction,
  UpdateConfigAction,
} from './';

export enum ActionTypes {
  // Theme
  setTheme = 'SET_THEME',
  // App categories
  getAppCategories = 'GET_APP_CATEGORIES',
  getAppCategoriesSuccess = 'GET_APP_CATEGORIES_SUCCESS',
  getAppCategoriesError = 'GET_APP_CATEGORIES_ERROR',
  addAppCategory = 'ADD_APP_CATEGORY',
  pinAppCategory = 'PIN_APP_CATEGORY',
  deleteAppCategory = 'DELETE_APP_CATEGORY',
  updateAppCategory = 'UPDATE_APP_CATEGORY',
  sortAppCategories = 'SORT_APP_CATEGORIES',
  reorderAppCategories = 'REORDER_APP_CATEGORIES',
  // Apps 
  getApps = 'GET_APPS',
  getAppsSuccess = 'GET_APPS_SUCCESS',
  getAppsError = 'GET_APPS_ERROR',
  pinApp = 'PIN_APP',
  addApp = 'ADD_APP',
  addAppSuccess = 'ADD_APP_SUCCESS',
  deleteApp = 'DELETE_APP',
  updateApp = 'UPDATE_APP',
  reorderApps = 'REORDER_APPS',
  sortApps = 'SORT_APPS',
  // Bookmark categories
  getBookmarkCategories = 'GET_BOOKMARK_CATEGORIES',
  getBookmarkCategoriesSuccess = 'GET_BOOKMARK_CATEGORIES_SUCCESS',
  getBookmarkCategoriesError = 'GET_BOOKMARK_CATEGORIES_ERROR',
  addBookmarkCategory = 'ADD_BOOKMARK_CATEGORY',
  pinBookmarkCategory = 'PIN_BOOKMARK_CATEGORY',
  deleteBookmarkCategory = 'DELETE_BOOKMARK_CATEGORY',
  updateBookmarkCategory = 'UPDATE_BOOKMARK_CATEGORY',
  sortBookmarkCategories = 'SORT_BOOKMARK_CATEGORIES',
  reorderBookmarkCategories = 'REORDER_BOOKMARK_CATEGORIES',
  // Bookmarks
  getBookmarks = 'GET_BOOKMARKS',
  getBookmarksSuccess = 'GET_BOOKMARKS_SUCCESS',
  getBookmarksError = 'GET_BOOKMARKS_ERROR',
  pinBookmark = 'PIN_BOOKMARK',
  addBookmark = 'ADD_BOOKMARK',
  addBookmarkSuccess = 'ADD_BOOKMARK_SUCCESS',
  deleteBookmark = 'DELETE_BOOKMARK',
  updateBookmark = 'UPDATE_BOOKMARK',
  reorderBookmarks = 'REORDER_BOOKMARKS',
  sortBookmarks = 'SORT_BOOKMARKS',
  // Notifications
  createNotification = 'CREATE_NOTIFICATION',
  clearNotification = 'CLEAR_NOTIFICATION',
  // Config
  getConfig = 'GET_CONFIG',
  updateConfig = 'UPDATE_CONFIG'
}

export type Action = 
  // Theme
  SetThemeAction |
  // App categories  
  GetAppCategoriesAction<any> |
  AddAppCategoryAction |
  PinAppCategoryAction |
  DeleteAppCategoryAction |
  UpdateAppCategoryAction |
  SortAppCategoriesAction |
  ReorderAppCategoriesAction |
  // Apps
  GetAppsAction<any> |
  PinAppAction |
  AddAppAction |
  DeleteAppAction |
  UpdateAppAction |
  ReorderAppsAction |
  SortAppsAction |
  // Bookmark categories
  GetBookmarkCategoriesAction<any> |
  AddBookmarkCategoryAction |
  PinBookmarkCategoryAction |
  DeleteBookmarkCategoryAction |
  UpdateBookmarkCategoryAction |
  SortBookmarkCategoriesAction |
  ReorderBookmarkCategoriesAction |
  // Bookmarks
  GetBookmarksAction<any> |
  PinBookmarkAction |
  AddBookmarkAction |
  DeleteBookmarkAction |
  UpdateBookmarkAction |
  ReorderBookmarksAction |
  SortBookmarksAction |
  // Notifications
  CreateNotificationAction |
  ClearNotificationAction |
  // Config
  GetConfigAction |
  UpdateConfigAction;