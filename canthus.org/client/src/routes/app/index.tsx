import { createFileRoute } from '@tanstack/react-router'
import ApiClientPanel from '@/components/app/dev/api-client';

export const Route = createFileRoute('/app/')({
    component: AppIndex,
})

export default function AppIndex() {
    return (
        <>
            <ApiClientPanel />
        </>
    );
}
