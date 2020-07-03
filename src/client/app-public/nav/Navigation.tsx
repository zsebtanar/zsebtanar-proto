import React, { useState } from 'react'
import { Header } from 'client/app-public/nav/Header'
import { SideNav } from 'client/app-public/nav/SideNav'

export function Navigation(): JSX.Element {
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
