import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/models';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('stayadmin_token');
  } catch {
    return null;
  }
};

const getStoredUser = (): User | null => {
  try {
    const data = localStorage.getItem('stayadmin_user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const initialAuthState: AuthState = {
  user: getStoredUser(),
  token: getStoredToken(),
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { response, username }) => ({
    ...state,
    loading: false,
    token: response.token,
    user: { username },
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthActions.logout, () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }))
);
