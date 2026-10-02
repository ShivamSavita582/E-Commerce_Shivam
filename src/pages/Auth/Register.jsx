import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AppContext from "../../context/AppContext";
import "./Register.css";

const Register = () => {
  const { register } = useContext(AppContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
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

  const getPasswordStrength = () => {
    const password = formData.password;

    if (!password) return "";

    if (password.length < 6) return "weak";

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return "strong";
    }

    return "medium";
  };

  const passwordStrength = getPasswordStrength();

  const submitHandler = async (e) => {
    e.preventDefault();

    const { name, email, password } = formData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    try {
      const result = await register(name, email, password);

      if (result?.success) {
        toast.success("Account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <main className="register-page">

      {/* =====================================================
          LEFT SHOWCASE
      ===================================================== */}

      <section className="register-showcase">

        <div className="register-showcase-content">

          <Link to="/" className="register-brand">
            <span className="register-brand-symbol" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#ffffff" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>bolt</span>
            </span>
            <span>NEXUS TECH</span>
          </Link>

          <div className="register-showcase-text">
            <span className="register-eyebrow">
              JOIN NEXUS TECH
            </span>

            <h1>
              Everything you
              <span> love.</span>
              <br />
              One account.
            </h1>

            <p>
              Create your account and unlock a smarter,
              faster and more personalized shopping
              experience.
            </p>

          </div>


          {/* Benefits */}

          <div className="register-benefits">

            <div className="register-benefit">

              <div className="benefit-icon">
                <span className="material-symbols-outlined">
                  shopping_bag
                </span>
              </div>

              <div>
                <strong>
                  Easy Shopping
                </strong>

                <small>
                  Discover products you love
                </small>
              </div>

            </div>


            <div className="register-benefit">

              <div className="benefit-icon">
                <span className="material-symbols-outlined">
                  local_shipping
                </span>
              </div>

              <div>
                <strong>
                  Track Your Orders
                </strong>

                <small>
                  Stay updated from checkout to delivery
                </small>
              </div>

            </div>


            <div className="register-benefit">

              <div className="benefit-icon">
                <span className="material-symbols-outlined">
                  security
                </span>
              </div>

              <div>
                <strong>
                  Secure Account
                </strong>

                <small>
                  Your information stays protected
                </small>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          RIGHT REGISTER SECTION
      ===================================================== */}

      <section className="register-section">

        <div className="register-card">

          <div className="register-heading">

            <span className="register-section-eyebrow">
              CREATE ACCOUNT
            </span>

            <h2>
              Get started
            </h2>

            <p>
              Create your account and start shopping today.
            </p>

          </div>


          <form onSubmit={submitHandler}>

            {/* =================================================
                NAME
            ================================================= */}

            <div className="register-form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="register-input-wrapper">

                <span className="material-symbols-outlined">
                  person
                </span>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onChangeHandler}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />

              </div>

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="register-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="register-input-wrapper">

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


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="register-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="register-input-wrapper">

                <span className="material-symbols-outlined">
                  lock
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={onChangeHandler}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="register-password-toggle"
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
                    {showPassword
                      ? "visibility_off"
                      : "visibility"}
                  </span>

                </button>

              </div>


              {/* Password strength */}

              {formData.password && (
                <div className="password-strength">

                  <div className="strength-bars">

                    <span
                      className={
                        passwordStrength === "weak" ||
                        passwordStrength === "medium" ||
                        passwordStrength === "strong"
                          ? "filled"
                          : ""
                      }
                    />

                    <span
                      className={
                        passwordStrength === "medium" ||
                        passwordStrength === "strong"
                          ? "filled"
                          : ""
                      }
                    />

                    <span
                      className={
                        passwordStrength === "strong"
                          ? "filled"
                          : ""
                      }
                    />

                  </div>

                  <span className={`strength-text ${passwordStrength}`}>
                    {passwordStrength === "weak" &&
                      "Weak password"}

                    {passwordStrength === "medium" &&
                      "Good password"}

                    {passwordStrength === "strong" &&
                      "Strong password"}
                  </span>

                </div>
              )}

            </div>


            {/* =================================================
                TERMS
            ================================================= */}

            <label className="register-terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the{" "}
                <Link to="/terms">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy">
                  Privacy Policy
                </Link>
                .
              </span>

            </label>


            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              className="register-submit"
            >

              <span>
                Create Account
              </span>

              <span className="material-symbols-outlined">
                arrow_forward
              </span>

            </button>

          </form>


          {/* =================================================
              LOGIN LINK
          ================================================= */}

          <div className="login-prompt">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>


          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="register-security">

            <span className="material-symbols-outlined">
              verified_user
            </span>

            <span>
              Your information is securely encrypted and protected.
            </span>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Register;

