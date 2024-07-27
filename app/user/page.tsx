import withAuth from '@/components/auth'
import React from 'react'

function User() {
  return (
    <div>User</div>
  )
}

export default withAuth(User);