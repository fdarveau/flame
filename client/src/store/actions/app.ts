import axios from 'axios';
import { Dispatch } from 'redux';

import { ApiResponse, App, Category, Config, NewApp, NewCategory } from '../../interfaces';
import { ActionTypes } from './actionTypes';
import { CreateNotificationAction } from './notification';

export interface GetAppsAction<T> {
  type:
    | ActionTypes.getApps
    | ActionTypes.getAppsSuccess
    | ActionTypes.getAppsError;
  payload: T;
}

export const getApps = () => async (dispatch: Dispatch) => {
  dispatch<GetAppsAction<undefined>>({
    type: ActionTypes.getApps,
    payload: undefined,
  });

  try {
    const res = await axios.get<ApiResponse<App[]>>("/api/apps");

    dispatch<GetAppsAction<App[]>>({
      type: ActionTypes.getAppsSuccess,
      payload: res.data.data,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * GET CATEGORIES
 */
export interface GetAppCategoriesAction<T> {
  type:
    | ActionTypes.getAppCategories
    | ActionTypes.getAppCategoriesSuccess
    | ActionTypes.getAppCategoriesError;
  payload: T;
}

export const getAppCategories = () => async (dispatch: Dispatch) => {
  dispatch<GetAppCategoriesAction<undefined>>({
    type: ActionTypes.getAppCategories,
    payload: undefined,
  });

  try {
    const res = await axios.get<ApiResponse<Category[]>>("/api/categories");

    dispatch<GetAppCategoriesAction<Category[]>>({
      type: ActionTypes.getAppCategoriesSuccess,
      payload: res.data.data.filter(
        (category: Category) => category.type === "apps"
      ),
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * ADD CATEGORY
 */
export interface AddAppCategoryAction {
  type: ActionTypes.addAppCategory;
  payload: Category;
}

export const addAppCategory =
  (formData: NewCategory) => async (dispatch: Dispatch) => {
    try {
      const res = await axios.post<ApiResponse<Category>>(
        "/api/categories",
        formData
      );

      dispatch<CreateNotificationAction>({
        type: ActionTypes.createNotification,
        payload: {
          title: "Success",
          message: `Category ${formData.name} created`,
        },
      });

      dispatch<AddAppCategoryAction>({
        type: ActionTypes.addAppCategory,
        payload: res.data.data,
      });

      dispatch<any>(sortAppCategories());
    } catch (err) {
      console.log(err);
    }
  };

export interface PinAppAction {
  type: ActionTypes.pinApp;
  payload: App;
}

export const pinApp = (app: App) => async (dispatch: Dispatch) => {
  try {
    const { id, isPinned, name } = app;
    const res = await axios.put<ApiResponse<App>>(`/api/apps/${id}`, {
      isPinned: !isPinned,
    });

    const status = isPinned
      ? "unpinned from Homescreen"
      : "pinned to Homescreen";

    dispatch<CreateNotificationAction>({
      type: ActionTypes.createNotification,
      payload: {
        title: "Success",
        message: `App ${name} ${status}`,
      },
    });

    dispatch<PinAppAction>({
      type: ActionTypes.pinApp,
      payload: res.data.data,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * ADD APP
 */
export interface AddAppAction {
  type: ActionTypes.addAppSuccess;
  payload: App;
}

export const addApp =
  (formData: NewApp | FormData) => async (dispatch: Dispatch) => {
    try {
      const res = await axios.post<ApiResponse<App>>("/api/apps", formData);

      dispatch<CreateNotificationAction>({
        type: ActionTypes.createNotification,
        payload: {
          title: "Success",
          message: `App ${res.data.data.name} added`,
        },
      });

      await dispatch<AddAppAction>({
        type: ActionTypes.addAppSuccess,
        payload: res.data.data,
      });

      // Sort apps
      dispatch<any>(sortApps());
    } catch (err) {
      console.log(err);
    }
  };

/**
 * PIN CATEGORY
 */
export interface PinAppCategoryAction {
  type: ActionTypes.pinAppCategory;
  payload: Category;
}

export const pinAppCategory =
  (category: Category) => async (dispatch: Dispatch) => {
    try {
      const { id, isPinned, name } = category;
      const res = await axios.put<ApiResponse<Category>>(
        `/api/categories/${id}`,
        { isPinned: !isPinned }
      );

      const status = isPinned
        ? "unpinned from Homescreen"
        : "pinned to Homescreen";

      dispatch<CreateNotificationAction>({
        type: ActionTypes.createNotification,
        payload: {
          title: "Success",
          message: `Category ${name} ${status}`,
        },
      });

      dispatch<PinAppCategoryAction>({
        type: ActionTypes.pinAppCategory,
        payload: res.data.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

/**
 * DELETE CATEGORY
 */
export interface DeleteAppCategoryAction {
  type: ActionTypes.deleteAppCategory;
  payload: number;
}

export const deleteAppCategory = (id: number) => async (dispatch: Dispatch) => {
  try {
    await axios.delete<ApiResponse<{}>>(`/api/categories/${id}`);

    dispatch<CreateNotificationAction>({
      type: ActionTypes.createNotification,
      payload: {
        title: "Success",
        message: `Category deleted`,
      },
    });

    dispatch<DeleteAppCategoryAction>({
      type: ActionTypes.deleteAppCategory,
      payload: id,
    });
  } catch (err) {
    console.log(err);
    dispatch<CreateNotificationAction>({
      type: ActionTypes.createNotification,
      payload: {
        title: "Error",
        message: err,
      },
    });
  }
};

/**
 * UPDATE CATEGORY
 */
export interface UpdateAppCategoryAction {
  type: ActionTypes.updateAppCategory;
  payload: Category;
}

export const updateAppCategory =
  (id: number, formData: NewCategory) => async (dispatch: Dispatch) => {
    try {
      const res = await axios.put<ApiResponse<Category>>(
        `/api/categories/${id}`,
        formData
      );

      dispatch<CreateNotificationAction>({
        type: ActionTypes.createNotification,
        payload: {
          title: "Success",
          message: `Category ${formData.name} updated`,
        },
      });

      dispatch<UpdateAppCategoryAction>({
        type: ActionTypes.updateAppCategory,
        payload: res.data.data,
      });

      dispatch<any>(sortAppCategories());
    } catch (err) {
      console.log(err);
      dispatch<CreateNotificationAction>({
        type: ActionTypes.createNotification,
        payload: {
          title: "Error",
          message: err,
        },
      });
    }
  };

/**
 * DELETE APP
 */
export interface DeleteAppAction {
  type: ActionTypes.deleteApp;
  payload: {
    appId: number;
    categoryId: number;
  };
}

export const deleteApp =
  (appId: number, categoryId: number) => async (dispatch: Dispatch) => {
    try {
      await axios.delete<ApiResponse<{}>>(`/api/apps/${appId}`);

      dispatch<CreateNotificationAction>({
        type: ActionTypes.createNotification,
        payload: {
          title: "Success",
          message: "App deleted",
        },
      });

      dispatch<DeleteAppAction>({
        type: ActionTypes.deleteApp,
        payload: {
          appId,
          categoryId,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

/**
 * UPDATE APP
 */
export interface UpdateAppAction {
  type: ActionTypes.updateApp;
  payload: App;
}

export const updateApp = (appId: number, formData: NewApp | FormData, previousCategoryId: number) => async (dispatch: Dispatch) => {
    try {
      const res = await axios.put<ApiResponse<App>>(
        `/api/apps/${appId}`,
        formData
      );

      dispatch<CreateNotificationAction>({
        type: ActionTypes.createNotification,
        payload: {
          title: "Success",
          message: `App ${res.data.data.name} updated`,
        },
      });

      // Check if category was changed
      const categoryWasChanged = res.data.data.categoryId !== previousCategoryId;

      if (categoryWasChanged) {
        // Delete app from old category
        dispatch<DeleteAppAction>({
          type: ActionTypes.deleteApp,
          payload: {
            appId,
            categoryId: previousCategoryId,
          },
        });

        // Add app to the new category
        dispatch<AddAppAction>({
          type: ActionTypes.addAppSuccess,
          payload: res.data.data,
        });
      } else {
        // Else update only name/url
        dispatch<UpdateAppAction>({
          type: ActionTypes.updateApp,
          payload: res.data.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

export interface ReorderAppsAction {
  type: ActionTypes.reorderApps;
  payload: App[];
}

interface ReorderAppsQuery {
  apps: {
    id: number;
    orderId: number;
  }[];
}

export const reorderApps = (apps: App[]) => async (dispatch: Dispatch) => {
  try {
    const updateQuery: ReorderAppsQuery = { apps: [] };

    apps.forEach((app, index) => {
      updateQuery.apps.push({
        id: app.id,
        orderId: index + 1,
      });
      app.orderId = index + 1;
    });

    await axios.put<ApiResponse<{}>>("/api/apps/0/reorder", updateQuery);

    dispatch<ReorderAppsAction>({
      type: ActionTypes.reorderApps,
      payload: apps,
    });
  } catch (err) {
    console.log(err);
  }
};

export interface SortAppsAction {
  type: ActionTypes.sortApps;
  payload: string;
}

export const sortApps = () => async (dispatch: Dispatch) => {
  try {
    const res = await axios.get<ApiResponse<Config>>("/api/config/useOrdering");

    dispatch<SortAppsAction>({
      type: ActionTypes.sortApps,
      payload: res.data.data.value,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * SORT CATEGORIES
 */
export interface SortAppCategoriesAction {
  type: ActionTypes.sortAppCategories;
  payload: string;
}

export const sortAppCategories = () => async (dispatch: Dispatch) => {
  try {
    const res = await axios.get<ApiResponse<Config>>("/api/config/useOrdering");

    dispatch<SortAppCategoriesAction>({
      type: ActionTypes.sortAppCategories,
      payload: res.data.data.value,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * REORDER CATEGORIES
 */
export interface ReorderAppCategoriesAction {
  type: ActionTypes.reorderAppCategories;
  payload: Category[];
}

interface ReorderCategoriesQuery {
  categories: {
    id: number;
    orderId: number;
  }[];
}

export const reorderAppCategories =
  (categories: Category[]) => async (dispatch: Dispatch) => {
    try {
      const updateQuery: ReorderCategoriesQuery = { categories: [] };

      categories.forEach((category, index) =>
        updateQuery.categories.push({
          id: category.id,
          orderId: index + 1,
        })
      );

      await axios.put<ApiResponse<{}>>(
        "/api/categories/0/reorder",
        updateQuery
      );

      dispatch<ReorderAppCategoriesAction>({
        type: ActionTypes.reorderAppCategories,
        payload: categories,
      });
    } catch (err) {
      console.log(err);
    }
  };
