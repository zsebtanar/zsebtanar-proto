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
declare const __INITIAL_STATE__: any
declare const __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
declare const grecaptcha: any
declare const __SERVER_ENV__: string

declare type FormMode = 'new' | 'update' | 'clone'

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

  interface BaseUserControl extends Ordered {
    controlType: string
  }

  interface Hint extends Ordered {
    text: string
  }

  type UserControl =
    | UCBinaryChoice
    | UCFractionNumber
    | UCMultiChoice
    | UCNumberList
    | UCSimpleText
    | UCSingleChoice
    | UCSingleNumber

  type UserControlSolution =
    | UCBinaryChoiceSolution
    | UCFractionNumberSolution
    | UCMultiChoiceSolution
    | UCNumberListSolution
    | UCSimpleTextSolution
    | UCSingleChoiceSolution
    | UCSingleNumberSolution

  enum UserControlType {}

  interface UCBinaryChoice extends BaseUserControl {
    controlType: 'binary-choice'
    controlProps: UCBinaryChoiceProps
  }

  interface UCBinaryChoiceProps {
    randomOrder: boolean
    options: ObjectMap<UCBinaryChoiceOption>
  }

  interface UCBinaryChoiceOption extends Ordered {
    label: MDString
    trueLabel: MDString
    falseLabel: MDString
  }

  interface UCBinaryChoiceSolution extends ObjectMap<boolean> {}

  interface UCFractionNumber extends BaseUserControl {
    controlType: 'fraction-number'
    controlProps: UCFractionNumberProps
  }

  interface UCFractionNumberProps {
    prefix?: MDString
    postfix?: MDString
  }

  interface UCFractionNumberSolution {
    numerator: number
    denominator: number
  }

  interface UCMultiChoice extends BaseUserControl {
    controlType: 'multi-choice'
    controlProps: UCMultiChoiceProps
  }

  interface UCMultiChoiceProps {
    randomOrder: boolean
    options: ObjectMap<UCMultiChoiceOption>
  }

  interface UCMultiChoiceOption extends Ordered {
    label: MDString
  }

  interface UCMultiChoiceSolution extends ObjectMap<boolean> {}

  interface UCNumberList extends BaseUserControl {
    controlType: 'number-list'
    controlProps: UCNumberListProps
  }

  interface UCNumberListProps {
    prefix?: MDString
    postfix?: MDString
    fractionDigits: number
    acceptRandomOrder: boolean
    multiLine: boolean
    fields: ObjectMap<UCNumberListField>
  }

  interface UCNumberListField extends Ordered {
    prefix?: MDString
    postfix?: MDString
  }

  interface UCNumberListSolution {
    options: ObjectMap<string>
  }

  interface UCNumberListInput extends ObjectMap<string> {}

  interface UCSimpleText extends BaseUserControl {
    controlType: 'simple-text'
    controlProps: UCSimpleTextProps
  }

  interface UCSimpleTextProps {
    prefix?: MDString
    postfix?: MDString
  }

  interface UCSimpleTextSolution {
    ignoreSpaces?: boolean
    caseSensitive?: boolean
    options: ObjectMap<string>
  }

  interface UCSingleChoice extends BaseUserControl {
    controlType: 'single-choice'
    controlProps: UCSingleChoiceProps
  }

  interface UCSingleChoiceProps {
    options: ObjectMap<UCSingleChoiceOption>
  }

  interface UCSingleChoiceOption {
    label: MDString
  }

  type UCSingleChoiceSolution = string

  interface UCSingleNumber extends BaseUserControl {
    controlType: 'single-number'
    controlProps: UCSingleNumberProps
  }

  interface UCSingleNumberProps {
    prefix?: MDString
    postfix?: MDString
    fractionDigits: number
  }

  type UCSingleNumberSolution = number
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

declare type MDString = string

interface MarkdownResource {
  url: string
  type: string
}

declare type MarkdownResources = ObjectMap<MarkdownResource>

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

declare type ButtonType = UIItemStyle

declare type BadgeType = UIItemStyle

declare type AlertType = UIItemStyle

declare interface BaseModalParams {
  onClose?: () => void
  disableBackdropClose?: boolean
}

interface FractionNumber {
  numerator: number
  denominator: number
}

declare interface NotificationOptions {
  timeout?: number
  description?: string
}

declare interface GridFilterOptions {
  where?: [string | FieldPath, WhereFilterOp, any][]
  orderBy?: [string | FieldPath, OrderByDirection]
}

declare interface GridDataSource<T> {
  size: number
  refresh()
  loadList(options?: GridFilterOptions): Promise<QuerySnapshot>
  getPage(pageNumber: number, limit: number): Promise<T[]>
}

type DispatchProp<Fn> = Fn extends (
  ...actionCreatorArgs: infer Args
) => (...dispatchArgs: unknown[]) => infer Return
  ? (...args: Args) => Return
  : never
