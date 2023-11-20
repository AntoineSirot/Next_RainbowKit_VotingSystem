'use client'
import React, { useState, useEffect } from 'react';
import { useContractRead, useWaitForTransaction, useContractWrite } from 'wagmi';
import { DAOSimulationContract } from './contracts';
import { RemainingTime } from './RemainingTime';
import { PendingTransactionsWindow } from './PendingTransaction';

export function Poll({ index, filter }: { index: number, filter: string }) {
  const [voted, setVoted] = useState(false);
  const [choiceNumber, setChoiceNumber] = useState(0);

  const { data: pollData, isRefetching, refetch, error } = useContractRead({
    ...DAOSimulationContract,
    functionName: 'getPoll',
    args: [BigInt(index)],
  });

  const { write, data, isLoading, isError } = useContractWrite({
    ...DAOSimulationContract,
    functionName: 'voteOnPoll',
  });

  const { data: receipt, isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  useEffect(() => {
    if (voted && !isLoading && !isError) {
      const args: readonly [bigint, bigint] = [BigInt(index), BigInt(choiceNumber)];
      write({ args });
      setVoted(false);
    }
  }, [voted, choiceNumber, index, isLoading, isError, write]);

  if (!pollData) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative" role="alert">
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v6m0 2v2m0 4h.01" />
            </svg>
          </div>
          <div>
            <p className="text-sm">Poll number: {index + 1} might not exist</p>
          </div>
        </div>
      </div>
    );
  }

  const handleChoiceClick = (i: number) => {
    setChoiceNumber(i);
    setVoted(true);
  };


  const [, startTimestamp, finalTimestamp, description, choices, answers, voters] = pollData;

  const currentTimestamp = Date.now() / 1000;
  const pollIsPast = currentTimestamp > Number(finalTimestamp);

  if (filter === 'active' && pollIsPast) {
    return null;
  }

  if (filter === 'past' && !pollIsPast) {
    return null;
  }


  if (isSuccess) {
    console.log('Transaction confirmed');
  }

  function truncateAddress(address: string) {
    if (address.length <= 10) {
      return address;
    } else {
      const truncatedAddress = address.substring(0, 5) + '...' + address.slice(-3);
      return truncatedAddress;
    }
  }

  let activePollBackground = 'bg-orange-200';
  let activePollTextColor = 'text-pink-950';
  let buttonBackground = 'bg-pink-950';
  let buttonTextColor = 'text-orange-200';
  let cursorStyle = '';

  if (pollIsPast) {
    activePollBackground = 'bg-pink-950';
    activePollTextColor = 'text-orange-200';
    buttonBackground = 'bg-orange-200';
    buttonTextColor = 'text-pink-950';
    cursorStyle = 'not-allowed';
  }

  const votes = answers.map((vote: any) => {
    const parsedVote = Number(vote);
    return isNaN(parsedVote) ? 0 : parsedVote;
  });
  const maxVotes = Math.max(...votes);
  const winningChoices = votes.reduce((acc: number[], vote, idx) => {
    if (vote === maxVotes) {
      acc.push(idx);
    }
    return acc;
  }, []);


  return (
    <>
      <div className={`border border-white p-8 m-8 rounded-lg text-center w-120 transition duration-300 ease-in-out transform hover:scale-110 ${activePollBackground} ${activePollTextColor}`}>
        <h2 className="text-xl font-semibold">Poll n°{Number(index) + 1}: {description}</h2>
        <p>Starting time: {new Date(Number(startTimestamp) * 1000).toLocaleString()}</p>
        <p>End Time: {new Date(Number(finalTimestamp) * 1000).toLocaleString()}</p>
        {pollIsPast ? <p className="mt-4">This poll is finished</p> : <RemainingTime finalTimestamp={Number(finalTimestamp)} />}
        <div>
          <h3 className="font-semibold mt-4">Choices:</h3>
          {choices.map((choice, i) => (
            <button
              key={i}
              onClick={pollIsPast ? undefined : () => handleChoiceClick(i)}
              className={`${buttonBackground} hover:scale-110 ${winningChoices.includes(i) || !pollIsPast ? buttonTextColor : 'text-gray-500 bg-opacity-20'} font-semibold rounded-lg px-4 py-2 m-2`}
              style={{ cursor: cursorStyle }}
            >
              {choice}: {votes[i]} {votes[i] === 1 ? 'Vote' : 'Votes'}
            </button>
          ))}
        </div>
        <p className="mt-4">Voters: {voters.map(voter => truncateAddress(voter)).join(', ')}</p>
      </div>
      {isPending && data && (
        <PendingTransactionsWindow transactionHash={data?.hash} />
      )}
    </>
  );

}
