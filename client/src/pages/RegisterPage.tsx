import React from 'react'
import { RegisterForm } from '../components/forms/register/index'
import { Page } from '../utils/styles'

function RegisterPage() {
  return (
    <Page display='flex' justifyContent='center' alignItems='center'  > 
        <RegisterForm/>
    </Page>
  )
}

export default RegisterPage