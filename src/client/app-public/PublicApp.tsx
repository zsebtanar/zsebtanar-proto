import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Navigation, Footer } from './nav'
import { About, Home, JoinUs, Page404, Workarounds, Search } from './pages'

export const PublicApp = React.memo(function PublicAppBase() {
  return (
    <div className="container page-container">
      <Navigation />
      <main className="main-content">
        <Switch>
          <Route path="/" exact component={Home} />
          {/*{props.session.signedIn && <Route path="/profile" component={Profile} />}*/}
          {/*<Route path="/subject/:subject/:topic" component={ExercisesByTopic} />*/}
          {/*<Route path="/grade/:grade" component={ExercisesByGrade} />*/}
          <Route path="/search" component={Search} />
          <Route path="/about" component={About} />
          <Route path="/joinus" component={JoinUs} />
          <Route path="/support" component={Workarounds} />
          <Route component={Page404} />
        </Switch>
      </main>
      <Footer />
    </div>
  )
})
