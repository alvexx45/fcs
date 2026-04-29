import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<div>Login Page (Placeholder)</div>} />
          <Route path="/dashboard" element={<div>Dashboard Page (Placeholder)</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
