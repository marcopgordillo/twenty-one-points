import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IBloodPressure {
    id?: number;
    timestamp?: Moment;
    systolic?: number;
    diastolic?: number;
    login?: IUser;
}

export class BloodPressure implements IBloodPressure {
    constructor(public id?: number, public timestamp?: Moment, public systolic?: number, public diastolic?: number, public login?: IUser) {}
}
