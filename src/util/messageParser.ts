import { readFileSync } from "fs"
import { Message, User } from "discord.js"

export default class MessageParser {
    message: Message
    user: User
    forMe: boolean
    command: string

    constructor(message: Message) {
        this.message = message
        this.forMe = this.thisForMe()
        this.user = message.author
        
        if(this.forMe) {
            this.command = this.getCommand()
            console.log(this.user.username + "#" + this.user.discriminator + " requsted "+this.command)
        }
    }

    thisForMe(): boolean {
        return this.message.content.substr(0, 3) === "!mc"
    }

    getCommand() {
        let message = this.message.content.substr(4)
        
        return message.split(" ")[0]
    }

    async isAuthorized() {
        let authorized = false

        const users = await readFileSync("users.txt", "utf-8").split("\n")
        const author = this.user.username + "#" + this.user.discriminator

        for (let i = 0; i < users.length; i++) {
            if(users[i] === author) {
                authorized = true;
                break
            } 
        }

        return authorized
    }
}
