
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AppContext from "../../context/AppContext";
import "./Login.css";

const Login = () => {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      const result = await login(email, password);

      if (result?.success) {
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <main className="login-page">

      {/* Left Premium Section */}

      <section className="login-showcase">

        <div className="showcase-content">

          <Link to="/" className="login-brand">
            <span className="brand-symbol" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#ffffff" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>bolt</span>
            </span>
            <span>NEXUS TECH</span>
          </Link>

          <div className="showcase-text">

            <span className="showcase-eyebrow">
              WELCOME BACK
            </span>

            <h1>
              Your world of
              <span> technology</span>
              starts here.
            </h1>

            <p>
              Sign in to access your orders, shopping cart,
              personalized recommendations and more.
            </p>

          </div>

          <div className="showcase-features">

            <div className="showcase-feature">

              <span className="material-symbols-outlined">
                verified
              </span>

              <div>
                <strong>Secure Shopping</strong>
                <small>Your data stays protected</small>
              </div>

            </div>

            <div className="showcase-feature">

              <span className="material-symbols-outlined">
                local_shipping
              </span>

              <div>
                <strong>Fast Delivery</strong>
                <small>Get your products delivered quickly</small>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Right Login Section */}

      <section className="login-section">

        <div className="login-card">

          <div className="login-heading">

            <span className="section-eyebrow">
              ACCOUNT LOGIN
            </span>

            <h2>
              Welcome back
            </h2>

            <p>
              Enter your details to continue shopping.
            </p>

          </div>


          <form onSubmit={submitHandler}>

            {/* Email */}

            <div className="login-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">

                <span className="material-symbols-outlined">
                  mail
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChangeHandler}
                  placeholder="you@example.com"
                  autoComplete="email"
                />

              </div>

            </div>


            {/* Password */}

            <div className="login-form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <Link to="/contact" title="Contact Support for Account Recovery">
                  Forgot password?
                </Link>

              </div>

              <div className="input-wrapper">

                <span className="material-symbols-outlined">
                  lock
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={onChangeHandler}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>

              </div>

            </div>


            {/* Remember */}

            <div className="login-options">

              <label className="remember-me">

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* Submit */}

            <button
              type="submit"
              className="login-submit"
            >

              <span>
                Sign In
              </span>

              <span className="material-symbols-outlined">
                arrow_forward
              </span>

            </button>

          </form>


          {/* Register */}

          <div className="register-prompt">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create an account
            </Link>

          </div>


          {/* Security */}

          <div className="login-security">

            <span className="material-symbols-outlined">
              shield
            </span>

            <span>
              Your information is encrypted and securely protected.
            </span>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Login;

