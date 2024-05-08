import React from 'react';
import { Link } from 'react-router-dom';
import './FormLogin.scss';
import UserIcon from '../../img/UserIcon';
import LockIcon from '../../img/LockIcon';

const FormLogin = () => {
  return (
    <>
      <div className="wrapper">
        <form action="#" method='post' className='login__form' >
          <div className="login__header">
            <h3 className="login__sign-in">Sign in</h3>
            <Link to={'/register'} className='login__button'>Register</Link>
          </div>
          <div>
            <label className="login__user" htmlFor="name">
              <UserIcon />
            </label>
            <input className="login__input login__user-input " type="email" name="name" id="name" placeholder="My name is..." autocomplete="off" />
          </div>
          <div>
            <label className="login__lock" htmlFor="password">
              <LockIcon />
            </label>
            <input className='login__input' type="password" name="password" id="password" placeholder="My password is..." autocomplete="off" />
          </div>
          <div>
            <input className='login__input' type="submit" value="Sign in" />
          </div>
          <div className="login__bottom">
            <label className="login__switch">
              <input
                type="checkbox"
                checkedtype="checkbox"
                name="is_doc"
              >
              </input>
              <span
                className="login__slider round"
              ></span>
            </label>
            <span className="login__check-label">Remember me</span>
            <span className="login__forgot-label">Lost your password?</span>
          </div>
        </form>
      </div>
    </>
  );
}

export default FormLogin;
