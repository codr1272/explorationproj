import React from 'react';
import { Link } from 'react-router-dom';
import UserIcon from '../../../img/UserIcon';
import LockIcon from '../../../img/LockIcon';

const FormRegistration = () => {
  return (
    <>
      <div className="wrapper">
        <form action="#" method='post' className='login__form'>
          <div className="login__header">
            <h3 className="login__sign-in">Sign up</h3>
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
            <input className='login__input' type="submit" value="Sign up" />
          </div>
        </form>
      </div>
    </>
  );
}

export default FormRegistration;
