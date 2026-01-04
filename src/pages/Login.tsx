import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { golfService } from "../services/golfService";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/register
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Login
        await golfService.login(formData.username, formData.password);
        navigate('/'); // Redirect to home after successful login
      } else {
        // Register
        await golfService.register(formData.username, formData.password);
        // Auto-login after registration
        await golfService.login(formData.username, formData.password);
        navigate('/');
      }
    } catch (err: any) {
      // Show the actual error message from the backend
      const errorMessage = err.message || (isLogin ? 'Invalid username or password' : 'Registration failed');
      setError(errorMessage);
      console.error('Error details:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Golf Metrics</h1>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <p className="toggle-form">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            className="toggle-btn" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ username: '', password: '' });
            }}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;