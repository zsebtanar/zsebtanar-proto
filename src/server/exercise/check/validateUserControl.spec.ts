import { validateUserControl } from './validateUserControl'
import {
  ExerciseDoc,
  ExerciseState,
  ExerciseSubTaskControlsType,
  UserControl,
} from '../../../shared/exercise/types'
import {
  getOptionsFunctionName,
  getSolutionFunctionName,
} from '../../../shared/exercise/userControls/utils'

const SEED = 123

const defEx = (script: string, controls: UserControl[]): ExerciseDoc => ({
  lang: 'hu',
  title: 'test exercise',
  state: ExerciseState.Public,
  created: new Date(),
  createdBy: 'admin',
  updated: new Date(),
  updatedBy: 'admin',
  classifications: [],
  difficulty: 0,
  description: 'Hello world',
  script,
  subTasks: [
    {
      controls,
      title: 'subtask 1',
      description: '',
      hints: [],
    },
  ],
})

describe('Validate User Control', () => {
  describe('static exercises', () => {
    it('Binary choice', () => {
      const ex = defEx('', [
        {
          type: ExerciseSubTaskControlsType.BinaryChoice,
          props: {
            randomOrder: false,
            options: [{ statement: '', falseLabel: '', trueLabel: '' }],
          },
          isDynamic: false,
          solution: [true],
          name: 'binary',
        },
      ])
      expect(validateUserControl(ex, SEED, 0, [[true]])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, [[false]])).toBe(false)
    })

    it('Fraction Number', () => {
      const ex = defEx('', [
        {
          type: ExerciseSubTaskControlsType.FractionNumber,
          isDynamic: false,
          solution: { numerator: 1, denominator: 2 },
          name: 'fraction',
        },
      ])
      expect(validateUserControl(ex, SEED, 0, [{ numerator: 1, denominator: 2 }])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, [{ numerator: 1, denominator: 3 }])).toBe(false)
    })

    it('Multi choice', () => {
      const ex = defEx('', [
        {
          type: ExerciseSubTaskControlsType.MultiChoice,
          props: {
            randomOrder: false,
            options: [{ label: '1' }, { label: '2' }, { label: '3' }],
          },
          isDynamic: false,
          solution: [true, false, false],
          name: 'multi',
        },
      ])
      expect(validateUserControl(ex, SEED, 0, [[true, false, false]])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, [[false, false, false]])).toBe(false)
    })

    it('Number list', () => {
      const ex = defEx('', [
        {
          type: ExerciseSubTaskControlsType.NumberList,
          isDynamic: false,
          solution: ['1', '2', '1.345'],
          name: 'numlist',
        },
      ])
      expect(validateUserControl(ex, SEED, 0, [['1', '2', '1.345']])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, [['1', '2', '3']])).toBe(false)
    })

    it('Simple text', () => {
      const ex = defEx('', [
        {
          type: ExerciseSubTaskControlsType.SimpleText,
          isDynamic: false,
          solution: ['hello', 'world'],
          name: 'text',
        },
      ])
      expect(validateUserControl(ex, SEED, 0, ['hello'])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, ['world'])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, ['hello!'])).toBe(false)
    })

    it('Single choice', () => {
      const ex = defEx('', [
        {
          type: ExerciseSubTaskControlsType.SingleChoice,
          props: {
            options: [{ label: '1' }, { label: '2' }, { label: '3' }],
          },
          isDynamic: false,
          solution: 1,
          name: 'multi',
        },
      ])
      expect(validateUserControl(ex, SEED, 0, [1])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, [2])).toBe(false)
    })

    it('Single Number', () => {
      const ex = defEx('', [
        {
          type: ExerciseSubTaskControlsType.SingleNumber,
          isDynamic: false,
          solution: '42',
          name: 'num',
        },
      ])
      expect(validateUserControl(ex, SEED, 0, [42])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, [84])).toBe(false)
    })
  })

  describe('dynamic exercises', () => {
    it('Binary choice', () => {
      const ex = defEx(
        `
      (def ${getSolutionFunctionName('binary')} (const [true]))
      (def ${getOptionsFunctionName(
        'binary',
      )} (const [{:statement "" :falseLabel "" :trueLabel ""}]))
      `,
        [
          {
            type: ExerciseSubTaskControlsType.BinaryChoice,
            isDynamic: true,
            solution: [],
            name: 'binary',
          },
        ],
      )
      expect(validateUserControl(ex, SEED, 0, [[true]])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, [[false]])).toBe(false)
    })

    it('Fraction Number', () => {
      const ex = defEx(`(def ${getSolutionFunctionName('fraction')} (const 1/2))`, [
        {
          type: ExerciseSubTaskControlsType.FractionNumber,
          isDynamic: true,
          solution: {} as any,
          name: 'fraction',
        },
      ])
      expect(validateUserControl(ex, SEED, 0, [{ numerator: 1, denominator: 2 }])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, [{ numerator: 1, denominator: 3 }])).toBe(false)
    })

    it('Multi choice', () => {
      const ex = defEx(
        `
      (def ${getSolutionFunctionName('multi')} (const [true false false]))
      (def ${getOptionsFunctionName('multi')} (const [{:label "1"} {:label "2"} {:label "3"}]))
      `,
        [
          {
            type: ExerciseSubTaskControlsType.MultiChoice,
            isDynamic: true,
            solution: [],
            name: 'multi',
          },
        ],
      )
      expect(validateUserControl(ex, SEED, 0, [[true, false, false]])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, [[false, false, false]])).toBe(false)
    })

    it('Number list', () => {
      const ex = defEx(`(def ${getSolutionFunctionName('numlist')} (const [1 2 1.345]))`, [
        {
          type: ExerciseSubTaskControlsType.NumberList,
          isDynamic: true,
          solution: [],
          name: 'numlist',
        },
      ])
      expect(validateUserControl(ex, SEED, 0, [['1', '2', '1.345']])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, [['1', '2', '3']])).toBe(false)
    })

    it('Simple text', () => {
      const ex = defEx(`(def ${getSolutionFunctionName('text')} (const ["hello" "world"]))`, [
        {
          type: ExerciseSubTaskControlsType.SimpleText,
          isDynamic: true,
          solution: [],
          name: 'text',
        },
      ])
      expect(validateUserControl(ex, SEED, 0, ['hello'])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, ['world'])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, ['hello!'])).toBe(false)
    })

    it('Single choice', () => {
      const ex = defEx(
        `
      (def ${getSolutionFunctionName('single')} (const 1))
      (def ${getOptionsFunctionName('single')} (const [{:label "1"} {:label "2"} {:label "3"}]))
      `,
        [
          {
            type: ExerciseSubTaskControlsType.SingleChoice,
            isDynamic: true,
            solution: -1,
            name: 'single',
          },
        ],
      )
      expect(validateUserControl(ex, SEED, 0, [1])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, [2])).toBe(false)
    })

    it('Single number', () => {
      const ex = defEx(`(def ${getSolutionFunctionName('num')} (const 42))`, [
        {
          type: ExerciseSubTaskControlsType.SingleNumber,
          isDynamic: true,
          solution: '',
          name: 'num',
        },
      ])
      expect(validateUserControl(ex, SEED, 0, [42])).toBe(true)
      expect(validateUserControl(ex, SEED, 0, [84])).toBe(false)
    })
  })
})
