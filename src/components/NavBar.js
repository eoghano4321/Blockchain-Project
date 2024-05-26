// Navigation bar

import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <div>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/createwallet">Create Wallet</Link>
            <Link to="/sendtransaction">Send Transaction</Link>
        </div>
    );
}

export default NavBar;