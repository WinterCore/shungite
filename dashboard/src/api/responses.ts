import { User } from "./models";


export interface LoginResponse {
    data  : User;
    token : string;
}
