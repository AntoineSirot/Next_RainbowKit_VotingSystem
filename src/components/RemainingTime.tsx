import React, { useState, useEffect } from 'react';

export function RemainingTime({ finalTimestamp }: { finalTimestamp: number }) {
    const calculateTimeRemaining = () => {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const timeRemaining = Number(finalTimestamp) - currentTimestamp;

        if (timeRemaining <= 0) {
            return 'Poll ended';
        }

        const days = Math.floor(timeRemaining / (24 * 60 * 60));
        const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
        const seconds = Math.floor(timeRemaining % 60);

        return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    };

    const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = calculateTimeRemaining();
            setTimeRemaining(remaining);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return <p className="mt-4">Time remaining: {timeRemaining}</p>;
};
