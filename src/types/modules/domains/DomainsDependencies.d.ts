import { StateMachineContract } from './StateMachine';

export default interface DomainsDependencies {
    // <--------- COMMON DOMAIN -------->
    stateMachineContract: StateMachineContract;
}
