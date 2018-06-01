import React from 'react'
import { connect } from 'react-redux'
import { Route, Router, Switch } from 'react-router-dom'
import { withTracker } from '../shared/component/hoc/withTracker'
import { Loading } from 'shared/component/general/Loading'
import { Overlay } from 'shared/component/modal/Overlay'

import { Header } from './nav/Header'
import { SideNav } from './nav/SideNav'
import { Home } from './page/Home'
import { Page404 } from 'shared/page/Page404'
import { ExercisesByTopic } from 'public/page/ExercisesByTopic'
import { ExercisesByGrade } from 'public/page/ExercisesByGrade'
import { Exercise } from 'shared/page/exercise/Exercise'
import { Footer } from 'public/nav/Footer'
import { Search } from 'public/page/Search'
import { About } from 'shared/page/About'
import { Profile } from 'public/page/Profile'

const mapStateToProps = state => ({
  session: state.app.session
})

export const Routes = connect(mapStateToProps)(function(props) {
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
                <Route path="/" exact component={withTracker(Home)} />
                {props.session.signedIn && (
                  <Route path="/profile" component={withTracker(Profile)} />
                )}
                <Route path="/subject/:subject/:topic" component={ExercisesByTopic} />
                <Route path="/grade/:grade" component={ExercisesByGrade} />
                <Route path="/exercise/:key" component={withTracker(Exercise)} />
                <Route path="/search" component={withTracker(Search)} />
                <Route path="/about" component={withTracker(About)} />
                <Route component={withTracker(Page404)} />
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
