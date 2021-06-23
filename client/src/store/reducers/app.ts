import { App, Category } from '../../interfaces';
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

// const getAppsError = (state: State, action: Action): State => {
//   return {
//     ...state,
//     loading: false,
//     errors: action.payload
//   }
// }
const addCategory = (state: State, action: Action): State => {
  return {
    ...state,
    categories: [
      ...state.categories,
      {
        ...action.payload,
        type: 'apps',
        apps: []
      }
    ]
  }
}

const addApp = (state: State, action: Action): State => {
  const categoryIndex = state.categories.findIndex((category: Category) => category.id === action.payload.categoryId);

  return {
    ...state,
    categories: [
      ...state.categories.slice(0, categoryIndex),
      {
        ...state.categories[categoryIndex],
        apps: [
          ...state.categories[categoryIndex].apps,
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

const pinApp = (state: State, action: Action): State => {
  const tmpCategories = [...state.categories];
  const changedCategory = tmpCategories.find((category: Category) => category.id === action.payload.id);
  
  if (changedCategory) {
    const tmpApps = [...changedCategory.apps];
    const changedApp = tmpApps.find((app: App) => app.id === action.payload.id);

    if (changedApp) {
      changedApp.isPinned = action.payload.isPinned;
    }
  }

  return {
    ...state,
    categories: tmpCategories
  }
}

// const addAppSuccess = (state: State, action: Action): State => {
//   return {
//     ...state,
//     apps: [...state.apps, action.payload]
//   }
// }

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

const deleteApp = (state: State, action: Action): State => {
  // const tmpApps = [...state.apps].filter((app: App) => app.id !== action.payload);

  // return {
  //   ...state,
  //   apps: tmpApps
  // }
  
  const tmpCategories = [...state.categories];
  const categoryInUpdate = tmpCategories.find((category: Category) => category.id === action.payload.categoryId);

  if (categoryInUpdate) {
    categoryInUpdate.apps = categoryInUpdate.apps.filter((app: App) => app.id !== action.payload.appId);
  }

  
  return {
    ...state,
    categories: tmpCategories
  }
}

const updateApp = (state: State, action: Action): State => {
  let categoryIndex = state.categories.findIndex((category: Category) => category.id === action.payload.categoryId);
  let appIndex = state.categories[categoryIndex].apps.findIndex((app: App) => app.id === action.payload.id);

  return {
    ...state,
    categories: [
      ...state.categories.slice(0, categoryIndex),
      {
        ...state.categories[categoryIndex],
        apps: [
          ...state.categories[categoryIndex].apps.slice(0, appIndex),
          {
            ...action.payload
          },
          ...state.categories[categoryIndex].apps.slice(appIndex + 1)
        ]
      },
      ...state.categories.slice(categoryIndex + 1)
    ]
  }
}

const sortCategories = (state: State, action: Action): State => {
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

const reorderApps = (state: State, action: Action): State => {
  const tmpCategories = [...state.categories];
  const categoryInUpdate = tmpCategories.find((category: Category) => category.id === action.payload.id);

  if (categoryInUpdate) {
    categoryInUpdate.apps = action.payload.apps;
  }

  return {
    ...state,
    categories: tmpCategories
  }
}

const sortApps = (state: State, action: Action): State => {
  const tmpCategories = [...state.categories];
  const categoryInUpdate = tmpCategories.find((category: Category) => category.id === action.payload.id);

  if (categoryInUpdate) {
    const sortedApps = sortData<App>(categoryInUpdate.apps, action.payload);
    categoryInUpdate.apps = sortedApps;
  }

  return {
    ...state,
    categories: tmpCategories
  }
}

const appReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.getAppCategories: return getCategories(state, action);
    case ActionTypes.getAppCategoriesSuccess: return getCategoriesSuccess(state, action);
    case ActionTypes.addAppCategory: return addCategory(state, action);
    case ActionTypes.addApp: return addApp(state, action);
    case ActionTypes.pinAppCategory: return pinCategory(state, action);
    case ActionTypes.pinApp: return pinApp(state, action);
    case ActionTypes.deleteAppCategory: return deleteCategory(state, action);
    case ActionTypes.updateAppCategory: return updateCategory(state, action);
    case ActionTypes.deleteApp: return deleteApp(state, action);
    case ActionTypes.updateApp: return updateApp(state, action);
    case ActionTypes.sortAppCategories: return sortCategories(state, action);
    case ActionTypes.reorderAppCategories: return reorderCategories(state, action);
    case ActionTypes.sortApps: return sortApps(state, action);
    case ActionTypes.reorderApps: return reorderApps(state, action);
    default: return state;
  }
}

export default appReducer;