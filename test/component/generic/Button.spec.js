import React from 'react'
import { Button } from '../../../src/shared/component/general/Button'
import renderer from 'react-test-renderer'

describe('Button', () => {
  it('renders correctly the default', () => {
    const tree = renderer.create(<Button>button text</Button>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly the submit', () => {
    const tree = renderer.create(<Button submit>button text</Button>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly the primary', () => {
    const tree = renderer.create(<Button primary>button text</Button>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
