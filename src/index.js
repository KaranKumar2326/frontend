import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';  // Import ToastContainer
import './index.css';  // Import Tailwind CSS here
import App from './App';
import reportWebVitals from './reportWebVitals';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastContainer />  {/* Add the ToastContainer here */}
    </QueryClientProvider>
  </React.StrictMode>
);

// Optionally, you can log performance metrics with reportWebVitals
reportWebVitals();
