import { Loading } from 'client-common/component/general/Loading'
import { withTracker } from 'client-common/component/hoc/withTracker'
import { Overlay } from 'client-common/component/modal/Overlay'
import { About } from 'client-common/page/About'
import { Exercise } from 'client-common/page/exercise/Exercise'
import { Page404 } from 'client-common/page/Page404'
import { History } from 'history'
import * as React from 'react'
import { connect } from 'react-redux'
import { Route, Router, Switch } from 'react-router-dom'
import { Footer } from './nav/Footer'

import { Header } from './nav/Header'
import { SideNav } from './nav/SideNav'
import { ExercisesByGrade } from './page/ExercisesByGrade'
import { ExercisesByTopic } from './page/ExercisesByTopic'
import { Home } from './page/Home'
import { Profile } from './page/Profile'
import { Search } from './page/Search'
import { Workarounds } from '../client-common/page/Workarounds'

interface RoutersProps {
  history: History
}

interface RoutersStateProps {
  session: state.Session
}

const mapStateToProps = state => ({
  session: state.app.session
})

export const Routes = connect<RoutersStateProps, {}, RoutersProps>(mapStateToProps)(function(
  props: RoutersProps & RoutersStateProps
) {
  return (
    <Router history={props.history}>
      <div className="app">
        {props.session.waitingForUser ? (
          <div>
            <Loading />
          </div>
        ) : (
          <Switch>
            <Route exact path="/exercise/:key" component={Exercise} />
            <Route component={App(props)} />
          </Switch>
        )}
        <Overlay />
      </div>
    </Router>
  )
})

const App = props => () => {
  return (
    <div className="container app-container">
      <Header />
      <SideNav />
      <div className="content app-content">
        <Switch>
          <Route path="/" exact component={withTracker(Home)} />
          {props.session.signedIn && <Route path="/profile" component={withTracker(Profile)} />}
          <Route path="/subject/:subject/:topic" component={ExercisesByTopic} />
          <Route path="/grade/:grade" component={ExercisesByGrade} />
          <Route path="/search" component={Search} />
          <Route path="/about" component={withTracker(About)} />
          <Route path="/support" component={withTracker(Workarounds)} />
          <Route component={withTracker(Page404)} />
        </Switch>
      </div>
      <Footer />
    </div>
  )
}
