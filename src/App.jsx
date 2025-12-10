import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Gestion de Stages et Alternances
        </h1>
        <p className="text-gray-700">
          Frontend React configuré avec succès ! ✅
        </p>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            <strong>API URL:</strong> {import.meta.env.VITE_API_BASE_URL}
          </p>
          <p className="text-sm text-gray-600">
            <strong>App Name:</strong> {import.meta.env.VITE_APP_NAME}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;