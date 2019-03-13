import * as React from 'react'
import { Button } from 'client-common/component/general/Button'
import * as renderer from 'react-test-renderer'

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
