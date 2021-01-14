import React from 'react';
import './BigText.css';

const BigText = ({children}) => {
    return (
        <div className="big-text">
            {children}
        </div>
    );
};

export default BigText;