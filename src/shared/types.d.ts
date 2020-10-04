declare const __DEV__: boolean
declare const __PRODUCTION__: boolean
declare const __CONFIG__: {
  api: string
  firebase: any
  sentry: {
    dsn: string
  }
  algolia: {
    appId: string
    key: string
  }
  ga: {
    ua: 'string'
  }
  recaptcha: {
    siteKey: string
  }
  links: {
    policy: string
  }
}
declare const grecaptcha: any
declare const __SERVER_ENV__: string

declare type FormMode = 'new' | 'update' | 'clone'

/** @deprecated */
declare namespace state {
  interface Root {
    app: App
  }

  interface AdminRoot extends Root {
    exerciseSheet: AdminExerciseSheet
    wikiPage: AdminWikPage
    resources: AdminResource
    exerciseEdit: any
  }

  interface App {
    session: Session
    sideNav: SideNav
    modal: AppModal
    classifications: Classifications
    notifications: Notifications
  }

  interface Task {
    item: {
      taskOrder: [string]
      subTasks: ObjectMap<SubTask>
      allTasks: number
      nextTask: number
      finishedTasks: number
      isFinished: boolean
    }
    error: any
  }

  interface Auth {}

  type Classifications = db.Classifications

  interface Session {
    waitingForUser: boolean
    signInLoading: boolean
    emailSignUpLoading: boolean
    signedIn: boolean
    user: any
    userDetails: any
    token: any
    error: any
    autoSignIn: boolean
  }

  interface SideNav {
    active: boolean
  }

  interface SubTask {
    details: DB.SubTask
    order: Ordered['order']
    status?: 'waiting' | 'active' | 'failed' | 'done' | 'preview'
    hints: [{ item: DB.Hint }]
    hintsLeft: number
    validity?: boolean
  }

  interface AppModal {
    modals: Modal[]
  }

  interface Modal {
    id: string
    modalComponent: () => Promise<any>
    parameters: any
  }

  interface Notifications {
    list: Notification[]
  }

  interface Notification {
    id: string
    type: AlertType
    message: string
    options: NotificationOptions
  }

  interface BaseFormData<T> {
    loading: boolean
    mode: FormMode
    changed: boolean
    saving: boolean
    data: T
    error: any
  }

  interface AdminExerciseSheet extends BaseFormData<ExerciseSheet> {
    removedExercises: string[]
  }

  interface AdminWikPage extends BaseFormData<WikiPageModel> {}

  interface AdminResource {
    data?: MarkdownResources
    error?: any
  }

  interface ResourceFileData {
    isNew: boolean
    url: string
    type: string
    name: string
    file: File
  }
}

declare namespace FB {
  interface UserData {
    uid: string
    disabled: boolean
    email: string
    emailVerified: boolean
    metadata: unknown
    providerData: string
    displayName: string
    customClaim: {
      role: UserRoles
    }
  }
}

declare namespace DB {
  interface Exercise {
    title: string
    description: string
    classifications: Classifications
    subTasks: ObjectMap<SubTask>
    _state: string
  }

  interface Classifications {
    grade: string[]
    subject: string[]
    tags: string[]
    topics: string[]
  }

  interface SubTask extends Ordered {
    title: string
    description: string
    controls: ObjectMap<UserControl>
    solutions: ObjectMap<UserControlSolution>
    hints: ObjectMap<Hint>
  }

  interface Hint extends Ordered {
    text: string
  }
}

declare namespace ui {
  interface ModalProps {
    title?: string
    close: () => void
  }
}

declare interface BaseUserControlProps {
  controlProps: any
  resource?: MarkdownResources
}

declare interface BaseUserControlAdminProps {
  controlProps: any
  value: any
  resource?: MarkdownResources
}

declare interface Ordered {
  order: number
}

declare interface ObjectMap<T> {
  [key: string]: T
}

declare type UIItemStyle =
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'

declare type ButtonType =
  | UIItemStyle
  | 'link'
  | 'outline-danger'
  | 'outline-dark'
  | 'outline-info'
  | 'outline-light'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-warning'

declare type BadgeType = UIItemStyle

declare type AlertType = UIItemStyle

declare interface BaseModalParams {
  onClose?: () => void
  disableBackdropClose?: boolean
}

declare interface NotificationOptions {
  timeout?: number
  description?: string
}

declare interface GridFilterOptions {
  where?: [string | FieldPath, firebase.firestore.WhereFilterOp, any][]
  orderBy?: [string | FieldPath, firebase.firestore.OrderByDirection][]
  limit?: number
  startAfter?: firebase.firestore.QueryDocumentSnapshot
  endBefore?: firebase.firestore.QueryDocumentSnapshot
}

declare type DataSourceEvents = 'loadStart' | 'loadEnd'

declare interface GridDataSource<T> {
  size: number
  refresh()
  loadList(options?: GridFilterOptions): Promise<firebase.firestore.QuerySnapshot>
  getPage(pageNumber: number, limit: number): Promise<T[]>
  on(type: DataSourceEvents, callback: () => void)
}
