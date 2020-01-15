import React, { useState } from 'react'
import { Header } from 'client-public/components/nav/Header'
import { SideNav } from 'client-public/components/nav/SideNav'

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
