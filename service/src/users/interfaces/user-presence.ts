import { User, UserPresence } from "src/utils/typeorm";
import { UpdateStatusMessageParams } from "src/utils/types";


export interface IUserServicePresence {
    createPresence(): Promise<UserPresence>;
    updateStatus(params: UpdateStatusMessageParams): Promise<User>;
}