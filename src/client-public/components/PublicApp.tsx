import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Page404 } from './pages/Page404'
import { Navigation, Footer } from 'client-public/components/nav'
import { About } from './pages/About'
import { Home } from '../pages/Home'

export function PublicApp() {
  return (
    <div className="container page-container">
      <Navigation />
      <main className="main-content">
        <Switch>
          <Route path="/" exact component={Home} />
          {/*{props.session.signedIn && <Route path="/profile" component={Profile} />}*/}
          {/*<Route path="/subject/:subject/:topic" component={ExercisesByTopic} />*/}
          {/*<Route path="/grade/:grade" component={ExercisesByGrade} />*/}
          {/*<Route path="/search" component={Search} />*/}
          <Route path="/about" component={About} />
          {/*<Route path="/joinus" component={JoinUs} />*/}
          {/*<Route path="/support" component={Workarounds} />*/}
          <Route component={Page404} />
        </Switch>
      </main>
      <Footer />
    </div>
  )
}
