'use client'
import { useState, useEffect } from 'react'
import { useContractEvent } from 'wagmi'

import { DAOSimulationContract } from './contracts'

export function WatchContractEvents() {
    const [latestEvent, setLatestEvent] = useState<string | null>(null)
    const [showWindow, setShowWindow] = useState(false)

    useContractEvent({
        ...DAOSimulationContract,
        eventName: 'Voted',
        listener: (logs) => {
            const latestLog = logs[logs.length - 1]
            const voterAddress = latestLog.args.voter
            setLatestEvent(`New vote in a poll by ${voterAddress}`)
            setShowWindow(true)
            setTimeout(() => {
                setShowWindow(false)
            }, 20000)
        },
    })

    useContractEvent({
        ...DAOSimulationContract,
        eventName: 'PollCreated',
        listener: (logs) => {
            const latestLog = logs[logs.length - 1]
            const creatorAddress = latestLog.args.creator
            const description = latestLog.args.description
            setLatestEvent(`New poll has been created by ${creatorAddress}: ${description}`)
            setShowWindow(true)
            setTimeout(() => {
                setShowWindow(false)
            }, 20000)
        },
    })

    const closeWindow = () => {
        setShowWindow(false)
    }

    useEffect(() => {
        let timeoutId: NodeJS.Timeout
        if (showWindow) {
            timeoutId = setTimeout(() => {
                setShowWindow(false)
            }, 20000)
        }

        return () => clearTimeout(timeoutId)
    }, [showWindow])

    return (
        <div>
            {showWindow && (
                <div style={{ position: 'fixed', bottom: 0, left: 0, padding: '10px', background: '#94d76f', zIndex: 999 }}>
                    <p>{latestEvent}</p>
                    <button onClick={closeWindow}>Close</button>
                </div>
            )}
        </div>
    )
}
