import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IPoint {
    id?: number;
    date?: Moment;
    exercise?: number;
    meals?: number;
    alcohol?: number;
    notes?: string;
    login?: IUser;
}

export class Point implements IPoint {
    constructor(
        public id?: number,
        public date?: Moment,
        public exercise?: number,
        public meals?: number,
        public alcohol?: number,
        public notes?: string,
        public login?: IUser
    ) {}
}
