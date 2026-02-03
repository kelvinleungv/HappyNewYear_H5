import type { RouteObject } from 'react-router-dom';
import Home from '../Views/Home';
import Test from '../Views/Test';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/test',
    element: <Test />,
  },
];

export default routes;
