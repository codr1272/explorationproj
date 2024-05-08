import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.scss';

const Header = ({
  user
}) => {
  const location = useLocation();
  const pageTitle = location.pathname === '/catalog' ? 'Створити операцію' : 'Операції';

  return (
    <div className="container">
      <nav className='navigation'>
        <Link to={pageTitle === 'Створити операцію' ? '/' : '/catalog'} className='navigation__company-name'>{pageTitle}</Link>
        <div className="HeaderWrapper">
          <Link to="/" className='navigation__company-name'>Служба дислокації ТЗРДР</Link>
          {user
            ? <span className='navigation__company-name'>{user}</span>
            : <Link to="/login" className='navigation__icon'>
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 12 12">
                <g fill="currentColor">
                  <circle cx="6" cy="3" r="3" />
                  <path d="M6 7a5 5 0 00-5 4.42.51.51 0 00.5.58h8.94a.51.51.0 00.5-.58A5 5 0 006 7z" />
                </g>
              </svg>
            </Link>}

        </div>
      </nav>
    </div>
  );
}

export default Header;
