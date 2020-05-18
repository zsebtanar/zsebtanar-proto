import { Loading } from 'client-common/component/general/Loading'
import { Overlay } from 'client-common/component/modal/Overlay'
import { About } from 'client-common/page/About'
import { JoinUs } from 'client-common/page/JoinUs'
import { Page404 } from 'client-common/page/Page404'
import { History } from 'history'
import * as React from 'react'
import { connect } from 'react-redux'

import { Route, Router, Switch } from 'react-router-dom'
import { AppNotifications } from '../client-common/component/general/AppNotifications'
import { isAdmin } from '../client-common/services/user'

import { Header } from './nav/Header'
import { SideNav } from './nav/SideNav'
import { AdminUtils } from './page/AdminUtils'
import { ClassificationList } from './page/classification/ClassificationList'
import { ExerciseSheetForm } from './page/exerciseSheet/form/ExerciseSheetForm'
import { ExerciseForm } from './page/exerciseEdit/ExerciseForm'
import { ExercisePreview } from './page/ExercisePreview'
import { Exercises } from './page/Exercises'
import { FeedbackList } from './page/FeedbackList'
import { Home } from './page/Home'
import { ExerciseSheetGrid } from './page/exerciseSheet/grid/ExerciseSheetGrid'
import { UserList } from './page/user/UserList'
import { WikiPageForm } from './page/wiki/form/WikiPageForm'
import { WikiPageGrid } from './page/wiki/grid/WikiPageGrid'

interface RoutesProps {
  history: History
}
interface RoutesStateProps {
  session: state.Session
}

const mapStateToProps = (state: any) => ({
  session: state.app.session
})

export const Routes = connect<RoutesStateProps, {}, RoutesProps>(mapStateToProps)(RoutesComponent)

function RoutesComponent(props: RoutesStateProps & RoutesProps) {
  return (
    <div className="app">
      <RouteContent {...props} />
      <Overlay />
    </div>
  )
}

function RouteContent(props: RoutesStateProps & RoutesProps) {
  if (props.session.waitingForUser) {
    return (
      <div>
        <Loading />
      </div>
    )
  }
  if (props.session.signedIn && isAdmin(props.session.token)) {
    return (
      <Router history={props.history}>
        <AdminRoutes />
      </Router>
    )
  }

  return <Home />
}

function AdminRoutes() {
  return (
    <div>
      <div className="container">
        <Header />
        <SideNav />
        <div className="content">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/user" exact component={UserList} />
            <Route path="/classification" exact component={ClassificationList} />

            {/* Exercises */}
            <Route path="/exercise" exact component={Exercises} />
            <Route path="/exercise/add/:clone" component={ExerciseForm} />
            <Route path="/exercise/add/" component={ExerciseForm} />
            <Route path="/exercise/edit/:key" component={ExerciseForm} />
            <Route path="/exercise/view/:key" component={ExercisePreview} />

            {/* Exercises sheet */}
            <Route path="/exercise-sheet" exact component={ExerciseSheetGrid} />
            <Route path="/exercise-sheet/add" component={ExerciseSheetForm} />
            <Route path="/exercise-sheet/edit/:key" component={ExerciseSheetForm} />

            {/* Wiki pages */}
            <Route path="/wiki-page" exact component={WikiPageGrid} />
            <Route path="/wiki-page/add" exact component={WikiPageForm} />
            <Route path="/wiki-page/edit/:key" exact component={WikiPageForm} />

            <Route path="/feedback" component={FeedbackList} />
            <Route path="/utilities" component={AdminUtils} />
            <Route path="/about" component={About} />
            <Route path="/joinus" component={JoinUs} />
            <Route component={Page404} />
          </Switch>
        </div>
      </div>
      <AppNotifications />
    </div>
  )
}
