import { IUser } from 'app/core/user/user.model';

export const enum Unit {
    Kg = 'Kg',
    lb = 'lb'
}

export interface IPreference {
    id?: number;
    weeklyGoal?: number;
    weightUnits?: Unit;
    user?: IUser;
}

export class Preference implements IPreference {
    constructor(public id?: number, public weeklyGoal?: number, public weightUnits?: Unit, public user?: IUser) {}
}
