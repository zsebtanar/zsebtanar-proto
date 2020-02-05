import React from 'react'

interface Props {
  error: Error
}

export function ErrorMsg({ error }: Props) {
  return <div className="alert alert-danger col-md-8 mx-auto">{error.message}</div>
}
