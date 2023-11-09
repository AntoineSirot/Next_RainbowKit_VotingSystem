import { useState, useEffect } from 'react';
import { useContractRead, useWaitForTransaction, useContractWrite } from 'wagmi'; // Include useContractWrite from 'wagmi'.
import { DAOSimulationContract } from './contracts';

export function Poll({ index }: { index: number }) {
  const [voted, setVoted] = useState(false);
  const [choiceNumber, setChoiceNumber] = useState(0);

  const handleChoiceClick = (choice, i) => {
    console.log(`Choice n°${i + 1} clicked: ${choice}`);
    setChoiceNumber(i);
    setVoted(true);
  };

  const { data: pollData, isRefetching, refetch, error } = useContractRead({
    ...DAOSimulationContract,
    functionName: 'getPoll',
    args: [BigInt(index)],
  });

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

  const [, startTimestamp, finalTimestamp, description, choices, answers, voters] = pollData;

  const currentTimestamp = Date.now() / 1000; // Convert milliseconds to seconds
  const isPast = currentTimestamp > Number(finalTimestamp);

  const { write, data, isLoading, isError } = useContractWrite({
    ...DAOSimulationContract, // Use the contract from your Poll component.
    functionName: 'voteOnPoll', // Set the function name for voting.
  });

  useEffect(() => {
    if (voted && !isLoading && !isError) {
      const args = [BigInt(index), BigInt(choiceNumber)];
      write({ args });
      setVoted(false);
    }
  }, [voted, choiceNumber, index, isLoading, isError]);

  const { data: receipt, isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  if (isSuccess) {
    console.log('Transaction confirmed');
  }

  return (
    <div className={`border border-black p-4 m-4 rounded-lg text-center ${isPast ? 'bg-green-200' : 'bg-blue-200'}`}>
      <h2 className="text-xl font-semibold">Poll n°{Number(index) + 1}: {description}</h2>
      <p>Starting time: {new Date(Number(startTimestamp) * 1000).toLocaleString()}</p>
      <p>End Time: {new Date(Number(finalTimestamp) * 1000).toLocaleString()}</p>
      <div>
        <h3 className="font-semibold mt-2">Choices:</h3>
        {choices.map((choice, i) => (
          <button
            key={i}
            onClick={isPast ? null : (() => handleChoiceClick(choice, i))}
            className={`${isPast ? 'bg-green-500 cursor-not-allowed' : isPast ? 'bg-green-500' : 'bg-blue-500'} ${isPast ? 'pointer-events-none' : 'hover:'}${isPast ? null : isPast ? 'bg-blue-700' : 'bg-green-700'} text-white font-semibold rounded-lg px-3 py-2 m-1`}
          >
            {choice}: {Number(answers[i]) > 1 ? `${Number(answers[i])} Votes` : `${Number(answers[i])} Vote`}
          </button>
        ))}
      </div>
      <p>Voters: {voters.join(', ')}</p>
    </div>
  );
}
