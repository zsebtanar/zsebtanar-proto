import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'

import createHistory from 'history/createBrowserHistory'
import Header from './nav/Header'
import Home from './page/Home'
import Page404 from 'shared/page/Page404'
import Overlay from 'shared/component/modal/Overlay'
import ExercisesByTopic from 'public/page/ExercisesByTopic'
import Exercise from 'public/page/Exercise'
import ExercisesByGrade from 'public/page/ExercisesByGrade'
import SideNav from './nav/SideNav'
import Footer from 'public/nav/Footer'

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
        <SideNav/>
        <div className="content">
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/subject/:subject/:topic" component={ExercisesByTopic}/>
            <Route path="/grade/:grade" component={ExercisesByGrade}/>
            <Route path="/exercise/:key" component={Exercise}/>
            <Route component={Page404}/>
          </Switch>
        </div>
        <Footer/>
      </div>
      <Overlay/>
    </div>
  </Router>
