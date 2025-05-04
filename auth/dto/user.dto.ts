import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { User } from "src/domain/User";

export class UserDto{
    @IsNotEmpty({
        message: 'Name is required',
    })
    @IsString({
        message: 'Email must be a string',
    })
    email: string;
    
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    password: string;

}

export function convertDtoToDomain(userDto: UserDto): User {
    const user = new User();
    user.email = userDto.email;
    user.password  = userDto.password ;

    return user;
}
    