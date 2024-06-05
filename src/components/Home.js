// Home Page

import React from 'react';

import NavBar from './NavBar';

// Webpage to allow a user to log in as a customer, doorman or venue using flux


function Home() {
    return (
        <section>
            <NavBar />
            <div>
                <h1>Home</h1>
                <p>Welcome to the Advanced Ticket System</p>
            </div>
        </section>
    );
}

export default Home;