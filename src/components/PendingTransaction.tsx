'use client'
import { useState, useEffect } from 'react';

export function PendingTransactionsWindow({ transactionHash }: { transactionHash: string }) {
    const [showWindow, setShowWindow] = useState(true);

    const closeWindow = () => {
        setShowWindow(false);
    };

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (showWindow) {
            timeoutId = setTimeout(() => {
                setShowWindow(false);
            }, 20000);
        }
        return () => clearTimeout(timeoutId);
    }, [showWindow]);

    if (!transactionHash || !showWindow) {
        return null;
    }

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                padding: '10px',
                background: '#6f9ed7',
                zIndex: 999,
            }}
        >
            <p>
                You have a pending transaction. Click on the hash to see it in the block explorer: {' '}
                <a
                    href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {transactionHash}
                </a>
            </p>
            <button onClick={closeWindow}>Close</button>
        </div>
    );
}
