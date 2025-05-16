import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import NProgress from "nprogress";

// Styled components version (using template literals)
const SignUp = () => {
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmationpassword: "",
    phone: "",
  });

  // Add useEffect to customize flag size after component mount
  useEffect(() => {
    // Apply additional styling to country flag
    const styleCountryFlag = () => {
      const flagElements = document.querySelectorAll(".PhoneInputCountryIcon");
      if (flagElements) {
        flagElements.forEach((flag) => {
          flag.style.width = "6px";
          flag.style.height = "6px";
          flag.style.overflow = "hidden";
          flag.style.borderRadius = "0";

          // Style the flag image if it exists
          const img = flag.querySelector("img");
          if (img) {
            img.style.width = "6px";
            img.style.height = "6px";
            img.style.objectFit = "cover";
          }
        });
      }
    };

    styleCountryFlag();

    // Add a small delay to ensure the DOM has been updated
    setTimeout(styleCountryFlag, 100);
  }, []);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (phone) => {
    setUser((prev) => ({
      ...prev,
      phone,
    }));
  };

  const collectData = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmationpassword, phone } = user;

    if (password !== confirmationpassword) {
      toast.error("Passwords do not match.");
      return;
    }

    NProgress.start();
    try {
      const response = await fetch("http://localhost:3004/api/v1/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmationpassword,
          phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User signed up successfully!");
        navigate("/");
      } else {
        toast.error(data.message || "Signup failed.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
      console.error("Signup error:", error);
    } finally {
      NProgress.done();
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="login-box">
        <p>Sign Up</p>
        <form onSubmit={collectData}>
          <div className="user-box">
            <input
              required
              name="fullName"
              type="text"
              value={user.fullName}
              onChange={handleChange}
            />
            <label>Full Name</label>
          </div>
          <div className="user-box">
            <input
              required
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
            />
            <label>Email</label>
          </div>

          <div className="user-box phone-wrapper">
            <label
              className={
                user.phone?.length > 0 || isPhoneFocused ? "active" : ""
              }
            >
              Phone
            </label>
            <div className="phone-input-inner">
              <PhoneInput
                international
                defaultCountry="US"
                value={user.phone}
                onChange={handlePhoneChange}
                onFocus={() => setIsPhoneFocused(true)}
                onBlur={() => setIsPhoneFocused(false)}
                countryCallingCodeEditable={false}
                withCountryCallingCode={false}
                className="custom-phone-input"
              />
            </div>
          </div>

          <div className="user-box">
            <input
              required
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
            />
            <label>Password</label>
          </div>
          <div className="user-box">
            <input
              required
              name="confirmationpassword"
              type="password"
              value={user.confirmationpassword}
              onChange={handleChange}
            />
            <label>Confirm Password</label>
          </div>

          <div className="terms-wrapper">
            <label className="container">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className="checkmark">
                <svg
                  viewBox="0 0 24 24"
                  width="100%"
                  height="100%"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            </label>
            <span className="terms-label">
              I agree to the{" "}
              <span className="terms-link" onClick={() => setShowModal(true)}>
                Terms and Conditions
              </span>
            </span>
          </div>

          <div className="submit-button-wrapper">
            <button
              type="submit"
              className="submit-button"
              disabled={!agreed}
              title={!agreed ? "You must agree to the terms first" : ""}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Submit
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/" className="a2">
            Login here
          </a>
        </p>
      </div>

      {/* Terms and Conditions Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Terms and Conditions</h2>
            <ul className="terms-list">
              <li>
                <strong>User Responsibilities:</strong> You must provide
                accurate, complete, and updated registration information.
              </li>
              <li>
                <strong>Privacy & Data:</strong> We securely store your
                information and do not share or sell data without your consent.
              </li>
              <li>
                <strong>Platform Usage:</strong> Use of the platform must comply
                with legal guidelines and community standards.
              </li>
              <li>
                <strong>No Automation:</strong> Scraping, automation, or
                unauthorized access to the system is prohibited.
              </li>
              <li>
                <strong>Intellectual Property:</strong> All branding, code, and
                content are protected by copyright laws.
              </li>
              <li>
                <strong>Limitation of Liability:</strong> We are not responsible
                for indirect damages or losses caused by usage.
              </li>
              <li>
                <strong>Policy Updates:</strong> We may revise these terms
                periodically. Continued use implies agreement to updated terms.
              </li>
              <li>
                <strong>Account Suspension:</strong> Breach of these terms may
                lead to suspension or termination of your account.
              </li>
            </ul>
            <button className="close-modal" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .signup-wrapper {
          min-height: 100vh;
          background: url("https://images.unsplash.com/photo-1612831668413-7b8d25154f2b?auto=format&fit=crop&w=1950&q=80")
            no-repeat center center/cover;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .signup-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1;
        }

        .login-box {
          position: relative;
          width: 90%;
          max-width: 900px;
          padding: 40px;
          margin: 20px auto;
          background: rgba(0, 0, 0, 0.9);
          box-sizing: border-box;
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
          border-radius: 10px;
          z-index: 2;
        }

        .login-box p:first-child {
          margin: 0 0 30px;
          padding: 0;
          color: #fff;
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .user-box {
          position: relative;
        }

        .user-box input {
          width: 100%;
          padding: 10px 0;
          font-size: 16px;
          color: #fff;
          margin-bottom: 30px;
          border: none;
          border-bottom: 1px solid #fff;
          outline: none;
          background: transparent;
        }

        .user-box label {
          position: absolute;
          top: 0;
          left: 0;
          padding: 10px 0;
          font-size: 16px;
          color: #fff;
          pointer-events: none;
          transition: 0.5s;
        }

        .user-box input:focus ~ label,
        .user-box input:valid ~ label {
          top: -20px;
          left: 0;
          color: #fff;
          font-size: 12px;
        }

        .phone-wrapper {
          position: relative;
          margin-bottom: 30px;
        }

        .phone-wrapper label {
          position: static;
          display: block;
          margin-bottom: 6px;
          font-size: 16px;
          color: #fff;
          pointer-events: none;
          transition: none;
        }

        .phone-wrapper label.active {
          top: -20px;
          font-size: 12px;
          color: #fff;
        }

        .phone-input-inner {
          display: flex;
          align-items: center;
          background: transparent;
        }

        .PhoneInput {
          width: 100%;
        }

        .PhoneInput input {
          width: 100%;
          padding: 10px 0;
          font-size: 16px;
          color: #fff;
          background: transparent;
          border: none;
          border-bottom: 1px solid #fff;
          outline: none;
        }

        /* Fix for the country flag size */
        .PhoneInputCountryIcon {
          width: 6px !important;
          height: 6px !important;
          box-sizing: content-box;
          margin-right: 10px;
          overflow: hidden;
        }

        .PhoneInputCountryIcon img {
          width: 6px;
          height: 6px;
          object-fit: cover;
          display: block;
          border-radius: 1px;
        }

        .PhoneInputCountryIcon--border {
          box-shadow: none;
          background-color: transparent;
        }

        .PhoneInputCountrySelectArrow {
          width: 4px;
          height: 4px;
          margin-left: 3px;
        }

        .terms-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #fff;
          font-size: 14px;
          margin: 10px 0 30px;
          line-height: 1.4;
        }

        .terms-label {
          line-height: 1.4;
        }

        .container {
          --size: 20px;
          width: var(--size);
          height: var(--size);
          background-color: #191a1e;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 3px;
          box-shadow: 1.5px 1.5px 3px #0e0e0e,
            -1.5px -1.5px 3px rgba(95, 94, 94, 0.25), inset 0px 0px 0px #0e0e0e,
            inset 0px -0px 0px #5f5e5e;
          transition: all 0.3s ease;
        }

        .container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
          display: none;
        }

        .checkmark {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          box-shadow: 1.5px 1.5px 3px #0e0e0e,
            -1.5px -1.5px 3px rgba(95, 94, 94, 0.25), inset 0px 0px 0px #0e0e0e,
            inset 0px -0px 0px #5f5e5e;
          transition: all 0.3s ease;
          padding: 3px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .checkmark svg {
          opacity: 0;
          transition: all 0.3s ease;
        }

        .container input:checked + .checkmark {
          box-shadow: inset 1.5px 1.5px 3px #0e0e0e,
            inset -1.5px -1.5px 3px #5f5e5e;
        }

        .container input:checked + .checkmark svg {
          opacity: 1;
        }

        .submit-button {
          position: relative;
          display: inline-block;
          padding: 10px 20px;
          font-weight: bold;
          color: #fff;
          font-size: 16px;
          text-decoration: none;
          text-transform: uppercase;
          overflow: hidden;
          transition: 0.5s;
          margin-top: 20px;
          letter-spacing: 3px;
          background: transparent;
          border: 1px solid white;
          cursor: pointer;
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .submit-button span {
          position: absolute;
          display: block;
        }

        .submit-button span:nth-child(1) {
          top: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #fff);
          animation: btn-anim1 1.5s linear infinite;
        }

        .submit-button span:nth-child(2) {
          top: -100%;
          right: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(180deg, transparent, #fff);
          animation: btn-anim2 1.5s linear infinite;
          animation-delay: 0.375s;
        }

        .submit-button span:nth-child(3) {
          bottom: 0;
          right: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(270deg, transparent, #fff);
          animation: btn-anim3 1.5s linear infinite;
          animation-delay: 0.75s;
        }

        .submit-button span:nth-child(4) {
          bottom: -100%;
          left: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(360deg, transparent, #fff);
          animation: btn-anim4 1.5s linear infinite;
          animation-delay: 1.125s;
        }

        @keyframes btn-anim1 {
          0% {
            left: -100%;
          }
          50%,
          100% {
            left: 100%;
          }
        }

        @keyframes btn-anim2 {
          0% {
            top: -100%;
          }
          50%,
          100% {
            top: 100%;
          }
        }

        @keyframes btn-anim3 {
          0% {
            right: -100%;
          }
          50%,
          100% {
            right: 100%;
          }
        }

        @keyframes btn-anim4 {
          0% {
            bottom: -100%;
          }
          50%,
          100% {
            bottom: 100%;
          }
        }

        .terms-link {
          color: #00f;
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.3s ease;
        }

        .terms-link:hover {
          color: #66f;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: #fff;
          padding: 40px;
          border-radius: 12px;
          width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          color: #000;
          text-align: left;
          position: relative;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .modal-content h2 {
          margin-top: 0;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .terms-list {
          padding-left: 20px;
          list-style-type: disc;
          font-size: 15px;
          line-height: 1.6;
        }

        .terms-list li {
          margin-bottom: 12px;
        }

        .close-modal {
          margin-top: 25px;
          padding: 10px 25px;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: background 0.3s ease;
        }

        .close-modal:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
