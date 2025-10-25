import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
    component: AppIndex,
})

export default function AppIndex() {
    return (
        <>
        </>
    );
}
