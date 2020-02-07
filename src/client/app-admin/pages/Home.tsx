import React from 'react'
import { useUser } from 'client/user/providers/UserProvider'
import { isAdmin } from 'client/user/services/user'

export function Home() {
  const { userToken, user, loggedIn } = useUser()
  return (
    <div className="msg-block">
      <h2 className="text-center">
        {!loggedIn || !isAdmin(userToken) ? (
          <div>
            <div>Üdv a Zsebtanár oldalon!</div>
            <div>
              Kérlek <a href="/">itt jelentkezz be</a> mint admin.
            </div>
          </div>
        ) : (
          `Szia ${user?.displayName ?? user?.email}`
        )}
      </h2>
    </div>
  )
}
