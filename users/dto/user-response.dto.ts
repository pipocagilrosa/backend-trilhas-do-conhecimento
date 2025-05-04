import { User } from "../entity/users.entity";

export class UserResponse{

      name: string;

      email: string;

      birthDate: string;
}

export function convertDomainToResponse(user: User): UserResponse {
    const userResponse = new UserResponse();
    userResponse.name = user.name;
    userResponse.email  = user.email;
    userResponse.birthDate  = user.birthDate ;

    return userResponse;
}