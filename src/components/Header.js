import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import './Header.css';

const MenuItem = ({active, children, to}) => (
    <Link to={to} className={`menu-item ${active ? 'active': ''}`}> 
            {children}
    </Link>
)

const Header = (props, context) => {
    const { router } = context;
    return (
        <div>
            <div className="logo">
                <a href="http://moontomi.ga">
                    <img src="http://3.35.178.151/images/logo/MoonTomi_Logo.png" alt="logo"/>
                </a>
            </div>
            <div className="menu">
                <MenuItem to={'/'} active={router.isActive('/', true)}>Home</MenuItem>
                <MenuItem to={'/review'} active={router.isActive('/review', true)}>비평</MenuItem>
                <MenuItem to={'/evaluate/1'} active={router.location.pathname.includes('/evaluate')}>음평회</MenuItem>
                <MenuItem to={'/lookup'} active={router.isActive('/lookup', true)}>둘러보기</MenuItem>
                <MenuItem to={'/upload'} active={router.isActive('/upload', true)}>업로드</MenuItem>
            </div>
        </div>
    );
};

Header.contextTypes = {
    router: PropTypes.object,
};

export default Header;