import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/components/auth/context'
import { logger } from '@/lib/logger'


export const Route = createFileRoute('/auth/callback')({
    component: CallbackPage,
})

function CallbackPage() {
    const { refresh } = useAuth()
    const navigate = useNavigate()
    const search = useSearch({ from: '/auth/callback' }) as { redirect_to?: string }

    useEffect(() => {
        logger.componentMount('CallbackPage');

        (async () => {
            try {
                logger.info('Processing auth callback', {
                    component: 'CallbackPage',
                    redirectTo: search?.redirect_to
                });

                await refresh()

                const redirectPath = search?.redirect_to ?? '/app';
                logger.navigation(window.location.pathname, redirectPath, {
                    component: 'CallbackPage',
                    reason: 'auth_callback_complete'
                });

                navigate({ to: redirectPath, replace: true })
            } catch (error) {
                logger.error('Auth callback failed', {
                    component: 'CallbackPage',
                    error: (error as Error).message
                });
            }
        })()

        return () => {
            logger.componentUnmount('CallbackPage');
        };
    }, [refresh, navigate, search])

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            {/* TODO: Make the below load in after a few seconds to reduce the flash of the spinner */}
            {/* <WaveLoader bars={5} message="Signing you in…" /> */}
        </div>
    )
}