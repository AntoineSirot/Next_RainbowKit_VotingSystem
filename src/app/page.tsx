import { ConnectButton } from '../components/ConnectButton'
import { Connected } from '../components/Connected'
import { Poll } from '../components/Poll'
import { Polls } from '../components/Polls'
import { SpecificPoll } from '../components/SpecificPoll'

export function Page() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">
        DAO Simulation
      </h1>
      <ConnectButton />

      <Connected>
        <hr />
        <h1 className="text-2xl font-bold underline">
          Specific Poll
        </h1>
        <SpecificPoll />
        <br />
        <hr />
        <h1 className="text-2xl font-bold underline">
          All Polls
        </h1>
        <Polls />

      </Connected>
    </>
  )
}

export default Page
