import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { Outlet } from 'react-router-dom';

import { State } from '../../store/reducers';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state: State) => state.auth);
  
  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/settings/app" />;
  }
};
