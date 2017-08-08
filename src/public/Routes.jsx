import React from 'react'

import { Router, Route, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import Header from './nav/Header'
import Home from './page/Home'
import SignIn from './page/auth/SignIn'
import SignUp from './page/auth/SignUp'
import Page404 from 'shared/page/Page404'
import Overlay from 'shared/component/modal/Overlay'
import ExercisesByTopic from 'public/page/ExercisesByTopic'

export const history = createHistory({
  basename: '/',
  forceRefresh: false,
  getUserConfirmation: (message, callback) => callback(window.confirm(message)),
  keyLength: 6
})

export default (props) =>
  <Router history={history}>
    <div className="app">
      <div className="container">
        <Header/>
        <div className="content">
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/sign-up" component={SignUp}/>
            <Route path="/sign-in" component={SignIn}/>
            <Route path="/subject/:subject/:topic" component={ExercisesByTopic}/>
            <Route path="/grade/:subject/:grade" component={ExercisesByTopic}/>
            <Route component={Page404}/>
          </Switch>
        </div>

        <footer className="footer">
          <p>&copy; Zsebtanár Nonprofit Alapítvány {new Date().getFullYear()}</p>
        </footer>

      </div>
      <Overlay/>
    </div>
  </Router>
