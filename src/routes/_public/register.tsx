import {RegisterForm} from '@/features/public/register/component/register-form'
import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/_public/register')({
  component: () => (
    <div className="flex flex-col items-center justify-center h-full">
      <RegisterForm />
    </div>
  ),
})
