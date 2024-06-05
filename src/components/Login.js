// Webpage to allow a user to log in as a customer, doorman or venue using flux

import React, { Component } from 'react';

import { connect } from 'react-redux';

import NavBar from './NavBar';

class Login extends Component{
    // Button to allow the user to select signing in as a customer, doorman or vendor
    // The user type is stored in the Redux store
    // The current user is displayed at the top of the page

    render(){
        return (
            <section>
            <NavBar />
            <div>
                <h1>Select User</h1>
                <h2>Current User: {this.props.userType}</h2>
                <button onClick={() => this.props.dispatch({ type: 'USERLOGIN' })}>Customer</button>
                <button onClick={() => this.props.dispatch({ type: 'DOORMANLOGIN' })}>Doorman</button>
                <button onClick={() => this.props.dispatch({ type: 'VENDORLOGIN' })}>Vendor</button>
            </div>
            </section>
        );
    }

}


const mapStateToProps = (state) => ({
    userType: state.user.user,
  });
  

export default connect(mapStateToProps)(Login);