import React, { useState } from 'react'
import { Header } from 'client/app-admin/nav/Header'
import { SideNav } from 'client/app-admin/nav/SideNav'

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
