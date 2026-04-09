'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TutorRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/trainer');
    }, [router]);

    return (
        <div className="flex justify-center pt-16">
            <div className="loading-spinner" />
        </div>
    );
}
