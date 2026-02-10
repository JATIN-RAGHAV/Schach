export class UserNotCreated extends Error{
        constructor(){
                super("User couldn't be created")
                this.name = this.constructor.name
        }
}

export class UserNotFound extends Error{
        constructor(){
                super("User not Found")
                this.name = this.constructor.name
        }
}

export class UserPassWrong extends Error{
        constructor(){
                super("Wrong Password")
                this.name = this.constructor.name
        }
}

export class UserFindingError extends Error{
        constructor(){
                super("Error related to finding the user")
                this.name = this.constructor.name
        }
}

export class GameNotFound extends Error{
        constructor(){
                super("Game was asked for but it doens't exist")
                this.name = this.constructor.name
        }
}

