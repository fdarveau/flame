import { App, Category } from '../../interfaces';
import { sortData } from '../../utility';
import { Action, ActionTypes } from '../actions';

export interface State {
  loading: boolean;
  errors: string | undefined;
  categories: Category[];
  apps: App[];
}

const initialState: State = {
  loading: true,
  errors: undefined,
  categories: [],
  apps: [],
};

const getApps = (state: State, action: Action): State => {
  return {
    ...state,
    loading: true,
    errors: undefined,
  };
};

const getAppsSuccess = (state: State, action: Action): State => {
  return {
    ...state,
    loading: false,
    apps: action.payload,
  };
};

const getAppsError = (state: State, action: Action): State => {
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
        type: "apps",
        apps: [],
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

const pinApp = (state: State, action: Action): State => {
  const tmpApps = [...state.apps];
  const changedApp = tmpApps.find((app: App) => app.id === action.payload.id);

  if (changedApp) {
    changedApp.isPinned = action.payload.isPinned;
  }

  return {
    ...state,
    apps: tmpApps,
  };
};

const addAppSuccess = (state: State, action: Action): State => {
  return {
    ...state,
    apps: [...state.apps, action.payload],
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

const deleteApp = (state: State, action: Action): State => {
  const tmpApps = [...state.apps].filter(
    (app: App) => app.id !== action.payload
  );

  return {
    ...state,
    apps: tmpApps,
  };
};

const updateApp = (state: State, action: Action): State => {
  const tmpApps = [...state.apps];
  const appInUpdate = tmpApps.find((app: App) => app.id === action.payload.id);

  if (appInUpdate) {
    appInUpdate.name = action.payload.name;
    appInUpdate.url = action.payload.url;
    appInUpdate.icon = action.payload.icon;
    appInUpdate.categoryId = action.payload.categoryId;
  }

  return {
    ...state,
    apps: tmpApps,
  };
};

const sortAppCategories = (state: State, action: Action): State => {
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

const reorderApps = (state: State, action: Action): State => {
  return {
    ...state,
    apps: action.payload,
  };
};

const sortApps = (state: State, action: Action): State => {
  // const tmpCategories = [...state.categories];

  // tmpCategories.forEach((category: Category) => {
  //   category.apps = sortData<App>(category.apps, action.payload);
  // });

  // return {
  //   ...state,
  //   categories: tmpCategories,
  // };
  const sortedApps = sortData<App>(state.apps, action.payload);

  return {
    ...state,
    apps: sortedApps,
  };
};

const appReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.getAppCategories:
      return getCategories(state, action);
    case ActionTypes.getAppCategoriesSuccess:
      return getCategoriesSuccess(state, action);
    case ActionTypes.getApps:
      return getApps(state, action);
    case ActionTypes.getAppsSuccess:
      return getAppsSuccess(state, action);
    case ActionTypes.getAppsError:
      return getAppsError(state, action);
    case ActionTypes.addAppCategory:
      return addCategory(state, action);
    case ActionTypes.addAppSuccess:
      return addAppSuccess(state, action);
    case ActionTypes.pinAppCategory:
      return pinCategory(state, action);
    case ActionTypes.pinApp:
      return pinApp(state, action);
    case ActionTypes.deleteAppCategory:
      return deleteCategory(state, action);
    case ActionTypes.updateAppCategory:
      return updateCategory(state, action);
    case ActionTypes.deleteApp:
      return deleteApp(state, action);
    case ActionTypes.updateApp:
      return updateApp(state, action);
    case ActionTypes.sortAppCategories:
      return sortAppCategories(state, action);
    case ActionTypes.reorderAppCategories:
      return reorderCategories(state, action);
    case ActionTypes.sortApps:
      return sortApps(state, action);
    case ActionTypes.reorderApps:
      return reorderApps(state, action);
    default:
      return state;
  }
};

export default appReducer;
