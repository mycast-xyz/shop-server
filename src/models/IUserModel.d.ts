import { User } from './User';

export interface IUserModel {

    getUsers(): Promise<User[]>;
    getUser(hash: string): Promise<User | null>;

    rewardCoin(hash: string, reward: number): Promise<boolean>;
}