// @ts-ignore
import { build, fake } from 'test-data-bot'

const buildUser = build('User').fields({
  // @ts-ignore
  email: fake(f => f.internet.email()),
  // @ts-ignore
  username: fake(f => f.internet.userName()),
  // @ts-ignore
  password: fake(f => f.internet.password()),
})

export { buildUser }
