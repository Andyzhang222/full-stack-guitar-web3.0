import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInAndSignUpPage from './pages/SignInAndSignUpPage';
import Home from './pages/HomePage';
import PrivateRoute from './middleware/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInAndSignUpPage />} />
        <Route path="/home" element={<Home />} />
        {/* 其他需要认证的页面 */}
        <Route
          path="/private"
          element={
            <PrivateRoute>
              <Home /> {/* 示例组件 */}
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
