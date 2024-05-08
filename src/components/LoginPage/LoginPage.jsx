import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import '../Header/Header.scss';
import FormLogin from '../FormLogin/FormLogin';

const LoginPage = () => {
  return (
    <>
      <Header />
      <FormLogin />
    </>
  );
}

export default LoginPage;
