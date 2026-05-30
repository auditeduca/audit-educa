import { Navigate } from 'react-router-dom';

export default function RedirectRoute({ to }) {
  return <Navigate to={to} replace />;
}
