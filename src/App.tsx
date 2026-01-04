import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { Toaster } from 'react-hot-toast';

import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} />
    </ErrorBoundary>
  );
}

export default App;
