'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TutorRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/trainer');
    }, [router]);

    return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
            <div className="loading-spinner" />
        </div>
    );
}
