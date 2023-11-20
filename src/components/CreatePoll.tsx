'use client'
import React, { useState, useEffect } from 'react';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { DAOSimulationContract } from './contracts';
import { PendingTransactionsWindow } from './PendingTransaction';

export function CreatePoll() {
    const [description, setDescription] = useState('');
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [choices, setChoices] = useState(['', '']);
    const [created, setCreated] = useState(false);
    const [error, setError] = useState('');

    const { write, data } = useContractWrite({
        ...DAOSimulationContract,
        functionName: 'createPoll',
    });

    const { data: receipt, isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: data?.hash });


    useEffect(() => {
        if (created) {
            const durationInSeconds = (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60);
            const args = [BigInt(durationInSeconds), description, choices];
            write({ args });
            setCreated(false);
        }
    }, [created]);

    const handleChoiceChange = (index, value) => {
        const newChoices = [...choices];
        newChoices[index] = value;
        setChoices(newChoices);
    };

    const handleDaysChange = (value) => {
        const newDays = value >= 0 ? value : 0;
        setDays(newDays);
    };

    const handleHoursChange = (value) => {
        const newHours = value >= 0 ? value : 0;
        setHours(newHours);
    };

    const handleMinutesChange = (value) => {
        const newMinutes = value >= 0 ? value : 0;
        setMinutes(newMinutes);
    };

    const handleAddChoice = () => {
        setChoices([...choices, '']);
    };

    const handleDeleteChoice = () => {
        if (choices.length > 0) {
            const newChoices = [...choices];
            newChoices.pop();
            setChoices(newChoices);
        }
    };

    const handleCreatePoll = () => {
        if (
            choices.length < 2 ||
            choices.some(choice => choice.trim() === '') ||
            description.trim() === ''
        ) {
            setError('Error: Please provide at least two non-empty choices, a non-empty description');
            return;
        }
        setError('');
        setCreated(true);
    };

    const inputStyle = "border-pink-950 border rounded bg-orange-200 px-2 py-1";

    return (
        <>
            <div className="border-pink-950 border text-pink-950 px-64 py-16 m-8 rounded-lg text-center w-120 bg-orange-200 bg-opacity-80 mx-auto max-w-3xl">
                <h2 className="text-xl font-semibold">Create a New Poll</h2>
                <div className="mt-4">
                    <label className="block mb-2 font-semibold">Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={inputStyle}
                    />
                </div>
                <div className="mt-4">
                    <label className="block mb-1 font-semibold">Duration:</label>
                    <div className="flex justify-center">
                        <div className="flex flex-col items-center mr-8">
                            <span>Days</span>
                            <input
                                type="number"
                                value={days}
                                onChange={(e) => handleDaysChange(e.target.value)}
                                className={inputStyle}
                                min={0}
                                max={99}
                            />
                        </div>
                        <div className="flex flex-col items-center mr-8">
                            <span>Hours</span>
                            <input
                                type="number"
                                value={hours}
                                onChange={(e) => handleHoursChange(e.target.value)}
                                className={inputStyle}
                                min={0}
                                max={23}
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <span>Minutes</span>
                            <input
                                type="number"
                                value={minutes}
                                onChange={(e) => handleMinutesChange(e.target.value)}
                                className={inputStyle}
                                min={0}
                                max={59}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block mb-2 font-semibold">Choices:</label>
                    {choices.map((choice, index) => (
                        <div key={index} className="mb-2">
                            <input
                                type="text"
                                value={choice}
                                onChange={(e) => handleChoiceChange(index, e.target.value)}
                                className={inputStyle}
                            />
                        </div>
                    ))}
                    <button
                        onClick={handleAddChoice}
                        className="bg-orange-200 border border-pink-950 text-pink-950 font-semibold rounded-lg px-4 py-2 mr-2 hover:scale-110"
                    >
                        +
                    </button>
                    <button
                        onClick={handleDeleteChoice}
                        className="bg-pink-950 text-orange-200 font-semibold rounded-lg px-4 py-2 hover:scale-110"
                    >
                        -
                    </button>
                </div>
                <button
                    onClick={handleCreatePoll}
                    className="bg-pink-950 text-orange-200 font-semibold rounded-lg px-4 py-2 mt-4  hover:scale-110"
                >
                    Create Poll
                </button>
                {error && <p className="text-red-500">{error}</p>}

            </div>
            {isPending && (
                <PendingTransactionsWindow transactionHash={data?.hash} />
            )}
        </>
    );
}
