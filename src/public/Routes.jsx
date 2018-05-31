import React from 'react'
import { connect } from 'react-redux'
import { Route, Router, Switch } from 'react-router-dom'
import Loading from 'shared/component/general/Loading'

import Header from './nav/Header'
import Home from './page/Home'
import Page404 from 'shared/page/Page404'
import Overlay from 'shared/component/modal/Overlay'
import ExercisesByTopic from 'public/page/ExercisesByTopic'
import { Exercise } from 'shared/page/exercise/Exercise'
import ExercisesByGrade from 'public/page/ExercisesByGrade'
import SideNav from './nav/SideNav'
import Footer from 'public/nav/Footer'
import Search from 'public/page/Search'
import About from 'shared/page/About'
import Profile from 'public/page/Profile'

const mapStateToProps = state => ({
  session: state.app.session
})

export default connect(mapStateToProps)(function(props) {
  return (
    <Router history={props.history}>
      <div className="app">
        {props.session.waitingForUser ? (
          <div>
            <Loading />
          </div>
        ) : (
          <div className="container">
            <Header />
            <SideNav />
            <div className="content">
              <Switch>
                <Route path="/" exact component={Home} />
                {props.session.signedIn && <Route path="/profile" component={Profile} />}
                <Route path="/subject/:subject/:topic" component={ExercisesByTopic} />
                <Route path="/grade/:grade" component={ExercisesByGrade} />
                <Route path="/exercise/:key" component={Exercise} />
                <Route path="/search" component={Search} />
                <Route path="/about" component={About} />
                <Route component={Page404} />
              </Switch>
            </div>
            <Footer />
          </div>
        )}
        <Overlay />
      </div>
    </Router>
  )
})
