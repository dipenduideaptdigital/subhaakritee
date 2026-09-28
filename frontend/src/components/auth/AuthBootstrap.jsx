import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearAuth,
  initializeAuth,
} from '../../store/slices/authSlice';

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();
  const isInitializing = useSelector(
    (state) => state.auth.isInitializing
  );
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    initializedRef.current = true;

    const handleLogout = () => {
      dispatch(clearAuth());
    };

    window.addEventListener('auth:logout', handleLogout);
    dispatch(initializeAuth());

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return children;
};

export default AuthBootstrap;
