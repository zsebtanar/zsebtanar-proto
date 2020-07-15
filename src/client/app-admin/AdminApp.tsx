import React from 'react'
import { Switch, Route } from 'react-router'
import { AdminUtils } from 'client/app-admin/pages/AdminUtils'
import { UserList } from 'client/user/pages/UserList'
import { Loading } from 'client/generic/components/Loading'
import { useUser } from 'client/user/providers/UserProvider'
import { FeedbackGrid } from 'client/feedback/pages/FeedbackGrid'
import { ClassificationsAdminPage } from 'client/classification/pages/ClassificationsAdmin'
import { ExerciseGrid } from 'client/exercise/pages/ExerciseGrid'
import { ExerciseForm } from 'client/exercise/pages/ExerciseForm'
import { WikiPageGrid } from 'client/wiki/page/WikiPageGrid'
import { WikiPageForm } from 'client/wiki/page/WikiPageForm'
import { Navigation } from './nav/Navigation'
import { Page404 } from './pages/Page404'
import { Home } from './pages/Home'

export const AdminApp = React.memo(function AdminAppBase() {
  const { isLoading } = useUser()

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="page-container">
      <Navigation />
      <main className="main-content">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/user" exact component={UserList} />
          <Route path="/classifications" exact component={ClassificationsAdminPage} />

          {/*/!* Exercises *!/*/}
          <Route path="/exercise" exact component={ExerciseGrid} />
          <Route path="/exercise/add/" component={ExerciseForm} />
          <Route path="/exercise/edit/:id" component={ExerciseForm} />
          {/*<Route path="/exercise/view/:id" component={ExercisePreview} />*/}

          {/*/!* Exercises sheet *!/*/}
          {/*<Route path="/exercise-sheet" exact component={ExerciseSheetGrid} />*/}
          {/*<Route path="/exercise-sheet/add" component={ExerciseSheetForm} />*/}
          {/*<Route path="/exercise-sheet/edit/:id" component={ExerciseSheetForm} />*/}

          {/*/!* Wiki pages *!/*/}
          <Route path="/wiki-page" exact component={WikiPageGrid} />
          {<Route path="/wiki-page/add" exact component={WikiPageForm} />}
          {<Route path="/wiki-page/edit/:id" exact component={WikiPageForm} />}

          <Route path="/feedback" component={FeedbackGrid} />
          <Route path="/utilities" component={AdminUtils} />
          <Route component={Page404} />
        </Switch>
      </main>
    </div>
  )
})
