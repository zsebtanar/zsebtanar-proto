import React, { useState } from 'react'
import { Header } from './Header'
import { SideNav } from './SideNav'

export function Navigation() {
  const [isSideNavOpen, setSideNav] = useState<boolean>(false)

  const openSideNav = () => setSideNav(true)
  const closeSideNav = () => setSideNav(false)

  return (
    <>
      <Header onOpenSideNav={openSideNav} />
      <SideNav isOpen={isSideNavOpen} onCloseSideNav={closeSideNav} />
    </>
  )
}
