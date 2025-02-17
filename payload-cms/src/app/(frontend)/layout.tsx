import React from 'react';
import './styles.css';

export const metadata = {
    description: 'The Computer Science Clubs CMS',
    title: 'CSClub CMS',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
    const { children } = props;

    return (
        <html lang="en">
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
