'use client'
import React, { useEffect, useState } from 'react';
import { Poll } from './Poll';
import { useContractRead, useAccount } from 'wagmi';
import { DAOSimulationContract } from './contracts';

export function AllPolls() {
    const [polls, setPolls] = useState(0);
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'past'
    const [showVoted, setShowVoted] = useState('all'); // 'all', 'voted', 'notVoted'
    const [activeToggleActive, setActiveToggleActive] = useState(2); // 1: 'active', 2: 'both', 3: 'inactive'
    const [activeToggleVoted, setActiveToggleVoted] = useState(2); // 1: 'voted', 2: 'all', 3: 'notVoted'
    const [key, setKey] = useState(false);
    const [hideAll, setHideAll] = useState(false);

    const { address } = useAccount()

    const { data: boolArray, isFetched: isBoolArrayFetched, error: boolArrayError, refetch: refetchBoolArray, isRefetching: loadingBoolArray } = useContractRead({
        ...DAOSimulationContract,
        functionName: 'getVotedPolls',
        args: [address]
    });

    const { data: numberOfPolls, isFetched: lengthIsFetched, error: pollsLengthError, isRefetching: loadingRefetch, refetch: refetchAllPolls } = useContractRead({
        ...DAOSimulationContract,
        functionName: 'getSizeOfPolls',
        onSuccess(numberOfPolls) {
            setPolls(Number(numberOfPolls));
        },
    });

    const handleRefetch = async () => {
        await refetchAllPolls();
        await refetchBoolArray();
        setHideAll(true);
        handleToggleChangeActive(1);
        handleToggleChangeVoted(1);
        setKey(true);
    };

    useEffect(() => {
        if (key) {
            handleToggleChangeActive(2);
            handleToggleChangeVoted(2);
            setKey(false);
            setHideAll(false);
        }
    }, [key]);

    if (!isBoolArrayFetched) {
        return <div>Loading...</div>;
    }

    if (boolArrayError) {
        return <div>Error loading data: {boolArrayError.message}</div>;
    }

    if (!lengthIsFetched) {
        return <div>Loading...</div>;
    }

    if (pollsLengthError) {
        return <div>Error loading poll data: {pollsLengthError.message}</div>;
    }


    const pollIndices = Array.from({ length: polls }, (_, index) => index);

    let filteredIndices = [];
    if (showVoted == 'all') {
        filteredIndices = pollIndices;
    }
    else {
        filteredIndices = boolArray.reduce((acc, voted, index) => {
            if ((showVoted == 'voted' && voted) || (showVoted == 'notVoted' && !voted)) {
                return [...acc, index];
            }
            return acc;
        }, []);
    }

    const handleToggleChangeVoted = (position) => {
        setActiveToggleVoted(position);
        switch (position) {
            case 1:
                setShowVoted('voted');
                break;
            case 2:
                setShowVoted('all');
                break;
            case 3:
                setShowVoted('notVoted');
                break;
            default:
                break;
        }
    };

    const handleToggleChangeActive = (position) => {
        setActiveToggleActive(position);
        switch (position) {
            case 1:
                setFilter('active');
                break;
            case 2:
                setFilter('all');
                break;
            case 3:
                setFilter('past');
                break;
            default:
                break;
        }
    };

    const toggleClassName = "flex-1 text-center py-2 cursor-pointer transition duration-300";
    const activeToggle = "bg-pink-950 text-orange-200";
    const switchClassName = "flex justify-between bg-orange-200 text-pink-950 rounded-full mb-4 overflow-hidden";
    const containerStyle = "w-[450px]";

    return (
        <div className="text-center">
            <button onClick={handleRefetch} className={`mb-4 px-4 py-2 flex-1 rounded-md ${activeToggle} hover:scale-110`}>Refetch</button>
            {!hideAll && (
                <div className="max-w-md mx-auto">
                    <div className={`${containerStyle} ${switchClassName}`}>
                        <div className={`${toggleClassName} ${activeToggleVoted === 1 ? activeToggle : ''}`} onClick={() => handleToggleChangeVoted(1)}>Already Voted Polls</div>
                        <div className={`${toggleClassName} ${activeToggleVoted === 2 ? activeToggle : ''}`} onClick={() => handleToggleChangeVoted(2)}>Both</div>
                        <div className={`${toggleClassName} ${activeToggleVoted === 3 ? activeToggle : ''}`} onClick={() => handleToggleChangeVoted(3)}>Not Voted Polls</div>
                    </div>
                    <div className={`${containerStyle} ${switchClassName} mb-8`}>
                        <div className={`${toggleClassName} ${activeToggleActive === 1 ? activeToggle : ''}`} onClick={() => handleToggleChangeActive(1)}>Active Polls</div>
                        <div className={`${toggleClassName} ${activeToggleActive === 2 ? activeToggle : ''}`} onClick={() => handleToggleChangeActive(2)}>Both</div>
                        <div className={`${toggleClassName} ${activeToggleActive === 3 ? activeToggle : ''}`} onClick={() => handleToggleChangeActive(3)}>Past Polls</div>
                    </div>
                </div>
            )}
            {hideAll ? null : (
                <div className="w-full flex flex-wrap justify-center">
                    {filteredIndices.map((index) => (
                        <Poll key={index} index={index} filter={filter} />
                    ))}
                </div>
            )}
        </div>
    );
}
