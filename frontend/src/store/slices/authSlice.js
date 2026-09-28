import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import { authApi } from '../../api/auth';
import { parseJwt } from '../../utils/jwtHelper';

const buildUser = (userData, token) => {
  const tokenPayload = token ? parseJwt(token) : {};

  return {
    ...userData,
    permissions:
      userData?.permissions ||
      tokenPayload?.permissions ||
      [],
  };
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  error: null,
};

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      return null;
    }

    try {
      const response = await apiClient.get('/auth/me');

      if (!response.data?.success) {
        return rejectWithValue(
          'Unable to verify authentication session.'
        );
      }

      return buildUser(response.data.data, token);
    } catch (error) {
      localStorage.removeItem('accessToken');

      return rejectWithValue(
        error.response?.data?.message ||
          'Authentication session could not be verified.'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error(
        'Logout API failed, forcing local logout',
        error
      );
    } finally {
      dispatch(clearAuth());
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;

      if (token) {
        localStorage.setItem('accessToken', token);
      }

      state.user = buildUser(user, token);
      state.isAuthenticated = true;
      state.isInitializing = false;
      state.error = null;
    },

    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
      state.error = null;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isInitializing = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isInitializing = false;

        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitializing = false;
        state.error =
          action.payload || 'Authentication failed.';
      });
  },
});

export const {
  setCredentials,
  clearAuth,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
