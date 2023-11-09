'use client'

import React from 'react';
import { Poll } from './Poll';
import { useContractRead } from 'wagmi';
import { DAOSimulationContract } from './contracts';

export function Polls() {
    const { data: numberOfPolls, isFetched: lengthIsFetched, error: pollsLengthError } = useContractRead({
        ...DAOSimulationContract,
        functionName: 'getSizeOfPools',
    });

    if (!lengthIsFetched) {
        return <div>Loading...</div>;
    }

    if (pollsLengthError) {
        return <div>Error loading poll data: {pollsLengthError.message}</div>;
    }

    const pollIndices = Array.from({ length: Number(numberOfPolls) }, (_, index) => index);

    return (
        <div>
            <h1>All Polls</h1>
            {pollIndices.map((index) => (
                <Poll key={index} index={index} />
            ))}
        </div>
    );
};

