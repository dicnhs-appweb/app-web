import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/product/edit/$id')({
  component: () => <div>Hello /_auth/product/edit/$id!</div>,
})
