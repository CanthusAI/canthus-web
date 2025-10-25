import ApiClientPanel from '@/components/app/dev/api-client'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/api-client/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <ApiClientPanel />
        </>
    )
}
