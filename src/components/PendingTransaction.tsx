'use client'
import { useState, useEffect } from 'react';

export function PendingTransactionsWindow({ transactionHash }: { transactionHash: string }) {
    const [showWindow, setShowWindow] = useState(true);

    const closeWindow = () => {
        setShowWindow(false);
    };

    useEffect(() => {
        let timeoutId;

        if (showWindow) {
            timeoutId = setTimeout(() => {
                setShowWindow(false);
            }, 20000);
        }
        return () => clearTimeout(timeoutId);
    }, [showWindow]);

    return (
        <>
            {showWindow && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        right: 0,
                        padding: '10px',
                        background: '#eee',
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
            )}
        </>
    );
}
