import React from 'react';
import { Link } from 'react-router';
import './Header.css';

const MenuItem = ({active, children, to}) => (
    <Link to={to} className="menu-item"> 
            {children}
    </Link>
)

const Header = () => {
    return (
        <div>
            <div className="logo">
                <a href="http://3.35.178.151:3000">
                    <img src="http://moontomi.duckdns.org/images/logo.jpg" alt="logo"/>
                </a>
            </div>
            <div className="menu">
                <MenuItem to={'/'}>MoonTomi</MenuItem>
                <MenuItem to={'/evaluate'}>음평회</MenuItem>
                <MenuItem to={'/upload'}>평가 포스트</MenuItem>
            </div>
        </div>
    );
};

export default Header;