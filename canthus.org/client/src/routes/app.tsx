import { createFileRoute } from '@tanstack/react-router'
import AppLayout from '@/components/layouts/app'

export const Route = createFileRoute('/app')({
    component: AppLayout,
})


