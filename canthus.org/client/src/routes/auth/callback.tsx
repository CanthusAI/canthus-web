import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/components/auth/context'

export const Route = createFileRoute('/auth/callback')({
    component: CallbackPage,
})

function CallbackPage() {
    const { refresh } = useAuth()
    const navigate = useNavigate()
    const search = useSearch({ from: '/auth/callback' }) as { redirect_to?: string }

    useEffect(() => {
        (async () => {
            await refresh()
            navigate({ to: search?.redirect_to ?? '/app', replace: true })
        })()
    }, [refresh, navigate, search])

    return (
        <div className="flex items-center justify-center min-h-[60vh]">

            {/* TODO: Make the below load in after a few seconds to reduce the flash of the spinner */}
            {/* <WaveLoader bars={5} message="Signing you in…" /> */}
        </div>
    )
}


