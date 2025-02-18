'use client';

import { useEffect } from 'react';

const HomePage = () => {
    useEffect(() => {
        // Redirect to the admin panel
        window.location.href = '/admin';
    }, []);

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'}}>
            <h1>Redirecting to the Admin Panel...</h1>
        </div>
    );
};

export default HomePage;
