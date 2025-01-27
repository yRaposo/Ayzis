import { Suspense } from 'react';

export default function SuspenseWrapper({ children }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
    );
}