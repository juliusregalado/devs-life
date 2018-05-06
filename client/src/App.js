import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import setAuthToken from './helpers/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/auth_actions';
import store from './store';
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import './App.css';

const token = localStorage.jwtToken;
if(token) {
  setAuthToken(token);
  const decoded = jwt_decode(token)
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    store.dispatch(logoutUser())
    //To do: Clear profile
    window.location.href = '/login'
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <BrowserRouter>
          <div className="App">
            <Navbar />
            <Route exact path='/' component={ Landing } />
            <Route exact path='/register' component={ Register } />
            <Route exact path='/login' component={ Login } />
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
