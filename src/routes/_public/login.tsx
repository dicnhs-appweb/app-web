import {LoginForm} from '@/features/public/login/component/login-form'
import {createFileRoute} from '@tanstack/react-router'
import {z} from 'zod'

export const Route = createFileRoute('/_public/login')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: () => (
    <div className="flex flex-col items-center justify-center h-full">
      <LoginForm />
    </div>
  ),
})
