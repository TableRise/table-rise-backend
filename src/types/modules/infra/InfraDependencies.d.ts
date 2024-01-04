import { ImageStorageClientContract } from 'src/types/modules/clients/ImageStorageClient';
import { UsersRepositoryContract } from 'src/types/modules/infra/repositories/users/UsersRepository';
import { UsersDetailsRepositoryContract } from 'src/types/modules/infra/repositories/users/UsersDetailsRepository';
import { UpdateTimestampRepositoryContract } from 'src/types/modules/infra/repositories/users/UpdateTimestampRepository';

export default interface InfraDependencies {
    imageStorageClientContract: ImageStorageClientContract;
    usersRepositoryContract: UsersRepositoryContract;
    usersDetailsRepositoryContract: UsersDetailsRepositoryContract;
    updateTimestampRepositoryContract:UpdateTimestampRepositoryContract;
}