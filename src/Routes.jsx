import React from 'react'

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import Home from './page/Home'
import AddExercise from './page/admin/AddExercise'
import SignIn from './page/user/SignIn'
import SignUp from './page/user/SignUp'
import Header from './component/nav/Header'

export default (props) =>
  <Router history={{}}>
    <div className="container">
      <Header/>
      <div>
        <Route exact path="/" component={Home}/>
        <Route path="/add-exercise" component={AddExercise}/>
        <Route path="/sign-up" component={SignUp}/>
        <Route path="/sign-in" component={SignIn}/>
      </div>

      <footer className="footer">
        <p>&copy; Zsebtanár Nonprofit Alapítvány {new Date().getFullYear()}</p>
      </footer>

    </div>
  </Router>
