import axios, { AxiosError } from 'axios';
import { Dispatch } from 'redux';

import { getCategories } from '.';
import { ApiResponse } from '../../interfaces';
import { ActionType } from '../action-types';
import { AuthErrorAction, AutoLoginAction, LoginAction, LogoutAction } from '../actions/auth';

export const login =
  (formData: { password: string; duration: string }) =>
  async (dispatch: Dispatch<LoginAction>) => {
    try {
      const res = await axios.post<ApiResponse<{ token: string }>>(
        '/api/auth',
        formData
      );

      localStorage.setItem('token', res.data.data.token);

      dispatch({
        type: ActionType.login,
        payload: res.data.data.token,
      });

      dispatch<any>(getCategories());
    } catch (err) {
      dispatch<any>(authError(err, true));
    }
  };

export const logout = () => (dispatch: Dispatch<LogoutAction>) => {
  localStorage.removeItem('token');

  dispatch({
    type: ActionType.logout,
  });

  dispatch<any>(getCategories());
};

export const autoLogin = () => async (dispatch: Dispatch<AutoLoginAction>) => {
  const token: string = localStorage.token;

  try {
    await axios.post<ApiResponse<{ token: { isValid: boolean } }>>(
      '/api/auth/validate',
      { token }
    );

    dispatch({
      type: ActionType.autoLogin,
      payload: token,
    });

    dispatch<any>(getCategories());
  } catch (err) {
    dispatch<any>(authError(err, false));
  }
};

export const authError =
  (error: unknown, showNotification: boolean) =>
  (dispatch: Dispatch<AuthErrorAction>) => {
    const apiError = error as AxiosError<any, any>;

    if (showNotification) {
      dispatch<any>({
        type: ActionType.createNotification,
        payload: {
          title: 'Error',
          message: apiError.response?.data.error,
        },
      });
    }

    dispatch<any>(getCategories());
  };
