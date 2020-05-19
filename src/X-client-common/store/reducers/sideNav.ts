export const OPEN_SIDE_NAV = 'OPEN_SIDE_NAV'
export const CLOSE_SIDE_NAV = 'CLOSE_SIDE_NAV'

export function openSideNav() {
  return { type: OPEN_SIDE_NAV }
}

export function closeSideNav() {
  return { type: CLOSE_SIDE_NAV }
}

const initialState = {
  active: false
}

export default function sideNav(state: state.SideNav = initialState, action): state.SideNav {
  switch (action.type) {
    case OPEN_SIDE_NAV:
      return { active: true }
    case CLOSE_SIDE_NAV:
      return { active: false }
    default:
      return state
  }
}
