import React from 'react'
import { LoginForm } from '../components/forms/login'
import { Page } from '../utils/styles'

export default function LoginPage() {
  return (
    <Page display='flex' justifyContent='center' alignItems='center'>
      <LoginForm/>
    </Page>
  )
}
