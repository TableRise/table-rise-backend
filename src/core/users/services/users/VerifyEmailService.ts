import {
    UserInstance,
    UserVerifyEmail,
} from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { stateFlowsKeys } from 'src/domains/common/enums/stateFlowsEnum';

export default class VerifyEmailService {
    private readonly _usersRepository;
    private readonly _stateMachine;
    private readonly _emailSender;
    private readonly _logger;

    constructor({
        usersRepository,
        stateMachine,
        emailSender,
        logger,
    }: UserCoreDependencies['verifyEmailServiceContract']) {
        this._usersRepository = usersRepository;
        this._stateMachine = stateMachine;
        this._emailSender = emailSender;
        this._logger = logger;
    }

    private async _send(user: UserInstance, flow: stateFlowsKeys): Promise<UserInstance> {
        this._logger('info', 'Send - SendEmail - VerifyEmailService');
        this._emailSender.type = 'verification';

        const emailSendResult = await this._emailSender.send(
            {
                username: user.nickname,
                subject: 'Email de verificação - TableRise',
            },
            user.email
        );

        if (!emailSendResult.success) {
            this._logger(
                'error',
                'Some error ocurred in email sending - VerifyEmailService'
            );
            HttpRequestErrors.throwError('user-inexistent');
        }

        user.inProgress.code = emailSendResult.verificationCode as string;

        await this._stateMachine.machine(flow, user);

        return user;
    }

    public async sendEmail({ email, flow }: UserVerifyEmail): Promise<void> {
        this._logger('info', 'SendEmail - VerifyEmailService');
        const userInDb = await this._usersRepository.findOne({ email });

        const userToUpdate = await this._send(userInDb, flow as stateFlowsKeys);

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userToUpdate,
        });
    }
}
