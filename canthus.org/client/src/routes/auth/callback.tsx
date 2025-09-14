import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { logger } from '@/lib/logger'
import { WaveLoader } from '@/components/ui/wave-loader'

export const Route = createFileRoute('/auth/callback')({
    component: CallbackPage,
})

function CallbackPage() {
    const navigate = useNavigate()

    useEffect(() => {
        logger.componentMount('CallbackPage');
        logger.info('Auth callback page loaded - should redirect from server', {
            component: 'CallbackPage'
        });

        // Fallback redirect in case server redirect doesn't work
        const fallbackTimer = setTimeout(() => {
            logger.warn('Fallback redirect triggered', {
                component: 'CallbackPage',
                reason: 'server_redirect_timeout'
            });
            navigate({ to: '/app', replace: true });
        }, 3000);

        return () => {
            clearTimeout(fallbackTimer);
            logger.componentUnmount('CallbackPage');
        };
    }, [navigate])

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <WaveLoader />
                <h1 className="text-2xl font-bold mb-2">Signing you in...</h1>
                <p className="text-muted-foreground">Please wait while we complete your authentication.</p>
            </div>
        </div>
    )
}