# DAO Polling Platform

This repository hosts a web3 front-end project that simulates a Decentralized Autonomous Organization (DAO), enabling users to create and participate in polls that persist for defined durations. The deployed project can be accessed on Sepolia via Vercel at the following link:

[Project Deployment on Vercel](https://next-rainbow-kit-voting-system.vercel.app/)

## Getting Started

To run the project locally, execute the following commands:
```
npm i
npm run dev
```

## Contract Address

**Smart Contract** (deployed on Sepolia): 0x05697d1EdEA74E16bB8306ac6255e7f3972A1935
## Technical Stack

 - [Wagmi](https://wagmi.sh)
 - [Next.js](https://nextjs.org)
 - [RainbowKit Documentation](https://rainbowkit.com/docs/introduction)
 - [Vercel for deployment](https://vercel.com)

## Key Features
### Main Functionality:

The platform comprises three distinct pages with specific purposes:


- **All Polls**: This primary page displays all polls by ID. Users can utilize the switch button to filter polls based on ones they've already voted on or those that are finished. It allows voting on active polls that the user hasn't participated in yet; by clicking on a choice and signing the transaction.
- **Specific Poll**: Users can navigate to this page by specifying the ID of a particular poll they're interested in. Similar to the "All Polls" page, users can vote on their chosen poll here.
- **Create Poll**: This interface enables anyone to create a new poll. Requirements include a description, duration, and a minimum of two choices. The interface includes functionalities such as the "+" and "-" buttons, allowing users to add more than two choices and create more complex polls.

### Additional Functionality:

Two supplementary features enhance user experience across all pages:

- **Pending Transaction Listener**: Whenever a transaction is pending, a notification window appears at the bottom right of the screen, alerting users to the pending transaction and providing a clickable hash link to view it on Etherscan.
- **Event Listener**: Users receive notifications at the bottom left of their screens when someone votes or creates a new poll. These notifications provide details about the nature of the event and relevant information.

### Bugs and Issues

If you find any issues or have suggestions, please open an issue or create a pull request on this repository.

Thank you for your support !