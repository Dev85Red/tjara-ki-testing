import React, { useEffect, useState, useRef } from "react";
import AUTH from "@client/authClient";
import { usePopup } from "@components/DataContext";
import { toast } from "react-toastify";
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import eyeImage from "./assets/eye.svg";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SignUpModal() {
  /* -------------------------------------------------------------------------------------------- */
  /*                              Btw, This Is My First React Project                             */
  /* -------------------------------------------------------------------------------------------- */
  const { setSignupPopup, signInPopup, signupPopup, ShowSmsVerificationPopup, ReferrelProgramRegisterPopup } = usePopup();
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Password, setPassword] = useState("");
  const [Role, setRole] = useState("customer");
  const [StoreName, setStoreName] = useState("");
  const [Loading, setLoading] = useState("");
  const [ReferrelProgramInvitationCode, setReferrelProgramInvitationCode] = useState("");
  const PasswordField = useRef();
  const Query = useQuery();

  /* -------------------------------------------------------------------------------------------- */
  /*                                     Handle Register Form                                     */
  /* -------------------------------------------------------------------------------------------- */

  const handleRegister = async (e) => {
    e.preventDefault();

    if (FirstName == '' || FirstName == undefined || FirstName == null) {
      toast.error('First name is required!');
      return;
    }
    if (LastName == '' || LastName == undefined || LastName == null) {
      toast.error('Last name is required!');
      return;
    }
    if (Email == '' || Email == undefined || Email == null) {
      toast.error('Email is required!');
      return;
    }
    if (Phone == '' || Phone == undefined || Phone == null) {
      toast.error('Phone number is required!');
      return;
    }
    if (Password == '' || Password == undefined || Password == null) {
      toast.error('Password is required!');
      return;
    }
    if (Role == '' || Role == undefined || Role == null) {
      toast.error('Role check is required!');
      return;
    }
    if (Role == 'vendor' && (StoreName == '' || StoreName == undefined || StoreName == null)) {
      toast.error('Store Name is required!');
      return;
    }

    setLoading(true);

    const ApiParams = {
      first_name: FirstName,
      last_name: LastName,
      email: Email,
      phone: Phone,
      password: Password,
      role: Role,
    };

    if (Role == 'vendor') {
      ApiParams.store_name = StoreName;
    }

    if (ReferrelProgramInvitationCode !== '') {
      ApiParams.invited_by = ReferrelProgramInvitationCode;
    }

    const { data, error } = await AUTH.register(ApiParams);

    if (data) {
      toast.success(data.message);

      localStorage.setItem('userID', data.user_id);

      if (data.user_role == 'customer') {
        setSignupPopup(false);
      } else {
        ShowSmsVerificationPopup();
      }
    }

    if (error) {
      toast.error(error.data.message);
    }

    setLoading(false);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    setRole('customer');
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (Query.get('invited_by') && Query.get('invited_by') !== '' && Query.get('invited_by') !== null && Query.get('invited_by') !== undefined) {
      setReferrelProgramInvitationCode(Query.get('invited_by'));
    }
  }, [Query]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (ReferrelProgramInvitationCode !== '' && ReferrelProgramInvitationCode !== null && ReferrelProgramInvitationCode !== undefined) {
      setTimeout(() => {
        ReferrelProgramRegisterPopup();
      }, 1000)
    }
  }, [ReferrelProgramInvitationCode]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className={`loginModal ${signupPopup ? "active" : ""}`}>
      <div className="background-transparent-layer" onClick={() => setSignupPopup(false)} />
      <div className="login-modal-container">
        <p className="sign-to-heading">Register your account</p>

        <div className="sign-to-field-box">
          <label htmlFor="">Register as:</label>
          <div className="roles">
            <div className="role">
              <input id="role-vendor" checked={Role == 'vendor'} type="radio" name="role" style={{ cursor: 'pointer' }} value="vendor" onChange={(e) => setRole(e.target.value)} />
              <label htmlFor="role-vendor" style={{ cursor: 'pointer' }}>Seller</label>
            </div>
            <div className="role">
              <input id="role-customer" checked={Role == 'customer'} type="radio" name="role" style={{ cursor: 'pointer' }} value="customer" onChange={(e) => setRole(e.target.value)} />
              <label htmlFor="role-customer" style={{ cursor: 'pointer' }}>Customer</label>
            </div>
          </div>
        </div>

        <div className="twin-fields" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
          <div className="sign-to-field-box">
            <label htmlFor="">First Name</label>
            <input type="text" value={FirstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className="sign-to-field-box">
            <label htmlFor="">Last Name</label>
            <input type="text" value={LastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>

        {Role == 'vendor' && (<div className="sign-to-field-box">
          <label htmlFor="">Store Name</label>
          <input type="text" value={StoreName} onChange={(e) => setStoreName(e.target.value)} />
        </div>)}

        <div className="sign-to-field-box">
          <label htmlFor="">Email Address</label>
          <input type="email" value={Email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="sign-to-field-box">
          <label htmlFor="">Phone</label>
          <PhoneInput country={'lb'} value={Phone} excludeCountries={['il']} onChange={setPhone} />
        </div>

        <div className="sign-to-field-box">
          <label htmlFor="">Password</label>
          <div className="password-field">
            <input type="password" ref={PasswordField} value={Password} onChange={(e) => setPassword(e.target.value)} />
            <img src={eyeImage} onClick={() => PasswordField.current.type === 'password' ? PasswordField.current.type = 'text' : PasswordField.current.type = 'password'} alt="" />
          </div>
        </div>

        {/* {ReferrelProgramInvitationCode === '' || ReferrelProgramInvitationCode === null || ReferrelProgramInvitationCode === undefined ? ('') : ( */}
        <div className="sign-to-field-box">
          <label htmlFor="">Refferel Code</label>
          <input type="text" name="invited_by" value={ReferrelProgramInvitationCode} onChange={(e) => setReferrelProgramInvitationCode(e.target.value)} />
        </div>
        {/* )} */}

        <button className="login-btn" onClick={handleRegister} disabled={Loading}>
          {Loading ? "Wait..." : "Register"}
        </button>
        <p className="have-account-heading">Have an account ?</p>
        <button className="create-account-btn" onClick={signInPopup}>
          Login
        </button>
      </div>
    </div>
  );
}

export default SignUpModal;
