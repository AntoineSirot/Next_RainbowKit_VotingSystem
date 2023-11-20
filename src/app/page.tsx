'use client'
import React, { useState } from 'react';
import { ConnectButton } from '../components/ConnectButton';
import { Connected } from '../components/Connected';
import { AllPolls } from '../components/AllPolls';
import { SpecificPoll } from '../components/SpecificPoll';
import { CreatePoll } from '../components/CreatePoll';
import { WatchContractEvents } from '../components/WatchContractEvents';

const NavBarButton = ({ label, onClick, active }: {
  label: string;
  onClick: () => void;
  active: boolean;
}) => {
  const activeClass = active ? 'bg-orange-200 text-pink-950' : 'bg-pink-950 text-orange-200';
  const buttonStyle = `border border-white hover:scale-110 text-center my-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${activeClass}`;

  return (
    <button onClick={onClick} className={buttonStyle}>
      {label}
    </button>
  );
};

const Page: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('AllPolls');

  const renderPage = () => {
    switch (currentPage) {
      case 'AllPolls':
        return <AllPolls />;
      case 'SpecificPoll':
        return <SpecificPoll />;
      case 'CreatePoll':
        return <CreatePoll />;
      default:
        return <AllPolls />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-pink-950 to-orange-200 animate-gradient-x flex flex-col">
        <div className="bg-pink-950 mx-auto w-2/3 md:w-3/4 lg:w-2/3 xl:w-1/2 text-center mt-8 bg-opacity-30 py-6 flex flex-col lg:flex-row justify-between items-center">
          <div className="ml-4 mb-2 md:ml-8 lg:ml-12 flex flex-col items-center lg:items-start">
            <h1 className="text-2xl lg:text-4xl mt-4 font-bold text-orange-200 mb-2 lg:mb-4">DAO Simulation</h1>
            <hr className="border-1 border-orange-300 w-1/4 lg:w-1/2 mx-auto mb-2 lg:mb-4" />
            <ConnectButton />
          </div>
          <div className="mr-4 md:mr-8 lg:mr-12 flex justify-center lg:justify-end mt-4 lg:mt-0">
            <NavBarButton
              label="All Polls"
              onClick={() => setCurrentPage('AllPolls')}
              active={currentPage === 'AllPolls'}
            />
            <div className="mr-2 lg:mr-4"></div> {/* Ajout d'un espace entre les boutons */}
            <NavBarButton
              label="Specific Poll"
              onClick={() => setCurrentPage('SpecificPoll')}
              active={currentPage === 'SpecificPoll'}
            />
            <div className="mr-2 lg:mr-4"></div> {/* Ajout d'un espace entre les boutons */}
            <NavBarButton
              label="Create Poll"
              onClick={() => setCurrentPage('CreatePoll')}
              active={currentPage === 'CreatePoll'}
            />
          </div>
        </div>

        <Connected>
          <div className="flex flex-col items-center mt-8">
            <div className="mt-6">{renderPage()}</div>
            <WatchContractEvents />
          </div>
        </Connected>
      </div>
    </>
  );
};
export default Page;
