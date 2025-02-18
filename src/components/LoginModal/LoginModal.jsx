import React, { useState } from "react";
import AUTH from "@client/authClient";
import { usePopup } from "@components/DataContext";
import { useAuth } from "@contexts/Auth";
import { toast } from "react-toastify";
import "./LoginModal.css";
import eyeImage from "./assets/eye.svg";
import { useRef } from "react";

function LoginModal() {
  const { accountCreateBtn, forgotPassPopup, loginPopup, setLoginPopup, ShowSmsVerificationPopup } = usePopup();
  const [Email, setEmail] = useState("");
  const [Loading, setLoading] = useState("");
  const [Password, setPassword] = useState("");
  const [ResendVerificationEmail, setResendVerificationEmail] = useState(false);
  const [ResendSmsVerification, setResendSmsVerification] = useState(false);
  const { login } = useAuth();
  const UserID = localStorage.getItem('userID');
  const PasswordField = useRef();

  /* -------------------------------------------------------------------------------------------- */
  /*                                         Handle Login                                         */
  /* -------------------------------------------------------------------------------------------- */

  const handleLogin = async (e) => {
    e.preventDefault();
    if (Email == '' || Email == null || Email == undefined) {
      toast.error('Email is requried!');
      return;
    }

    if (Password == '' || Password == null || Password == undefined) {
      toast.error('Password is requried!');
      return;
    }

    setLoading(true);

    const params = {
      email: Email,
      password: Password
    };

    const { data, error } = await AUTH.login(params);

    if (data) {
      toast.success(data.message);
      login(data.user);
      setLoginPopup(false);
    }

    if (error) {
      toast.error(error.data.message);
      if (error.data.resend_verification == true) {
        setResendVerificationEmail(true);
      } else if (error.data.resend_sms_verification == true) {
        setResendSmsVerification(true);
        localStorage.setItem('userID', error.data.user_id);
      }
    }

    setLoading(false);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                               Handle Resend Verification Email                               */
  /* -------------------------------------------------------------------------------------------- */

  const resendVerificationEmailRequest = async (e) => {
    e.preventDefault();

    setLoading(true);

    const params = {
      email: Email
    };

    const { data, error } = await AUTH.resendVerificationEmail(params);

    if (data) {
      toast.success(data.message);
      setLoginPopup(false);
    }

    if (error) {
      toast.error(error.data.message);
    }

    setLoading(false);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                               Handle Resend Verification Email                               */
  /* -------------------------------------------------------------------------------------------- */

  const resendVerificationSMSRequest = async (e) => {
    e.preventDefault();

    setLoading(true);

    const params = {
      user_id: UserID ?? '',
    };

    const { data, error } = await AUTH.resendSmsVerification(params);

    if (data) {
      toast.success(data.message);
      setLoginPopup(false);
      ShowSmsVerificationPopup();
    }

    if (error) {
      toast.error(error.data.message);
    }

    setLoading(false);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className={`loginModal ${loginPopup ? "active" : ""}`}>
      <div className="background-transparent-layer" onClick={() => setLoginPopup(false)} />
      <div className="login-modal-container">
        <p className="sign-to-heading">Login to your account</p>
        <div className="sign-to-field-box">
          <label htmlFor="">Email Address</label>
          <input type="text" value={Email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="sign-to-field-box">
          <label htmlFor="">Password</label>
          <div className="password-field">
            <input type="password" ref={PasswordField} value={Password} onChange={(e) => setPassword(e.target.value)} />
            <img src={eyeImage} onClick={() => PasswordField.current.type === 'password' ? PasswordField.current.type = 'text' : PasswordField.current.type = 'password'} alt="" />
          </div>
        </div>
        <div className="forget-password-row">
          {ResendVerificationEmail && <p onClick={resendVerificationEmailRequest}>Resend Verification Email</p>}
          {ResendSmsVerification && <p onClick={resendVerificationSMSRequest}>Resend Verification Code</p>}
          <p onClick={forgotPassPopup}>Reset Password</p>
        </div>
        <button className="login-btn" onClick={handleLogin} disabled={Loading}>
          {Loading ? "Wait..." : "Login"}
        </button>
        <p className="have-account-heading">Don’t have account ?</p>
        <button className="create-account-btn" onClick={accountCreateBtn}>
          Create account
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
