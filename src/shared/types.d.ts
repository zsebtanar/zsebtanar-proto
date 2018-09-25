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
  },
  links: {
    policy: string
  }
}
declare const __INITIAL_STATE__: any
declare const __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
declare const grecaptcha: any

declare namespace state {
  interface Root {
    app: App
  }

  interface App {
    session: Session
    sideNav: SideNav
    modal: AppModal
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
    closeModal: (id: string) => void
  }

  interface Modal {
    id: string
    modalComponent: () => Promise<any>
    parameters: any
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
    options: ObjectMap<number>
  }

  interface UCSimpleText extends BaseUserControl {
    controlType: 'simple-text'
    controlProps: UCSimpleTextProps
  }

  interface UCSimpleTextProps {
    prefix?: MDString
    postfix?: MDString
  }

  interface UCSimpleTextSolution {
    ignoreSpaces: boolean
    caseSensitive: boolean
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

declare type MarkdownResources = ObjectMap<string>

declare interface Ordered {
  order: number
}

declare interface ObjectMap<T> {
  [key: string]: T
}

declare type Buttontype =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'info'
  | 'warning'
  | 'dark'

declare interface BaseModalParams {
  onClose?: () => void
  disableBackdropClose?: boolean
}

interface FractionNumber {
  numerator: number
  denominator: number
}
