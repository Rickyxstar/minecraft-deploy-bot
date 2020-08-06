import {config} from "dotenv"
import {Client, Message} from "discord.js"
import Gitlab from "./src/util/Gitlab"
import JobParser from "./src/util/jobsParser"
import MessageParser from "./src/util/messageParser"

config()

// Discord
const client = new Client()

// Gitlab
const gitlab = new Gitlab(String(process.env.GITLAB_TOKEN))

client.on("ready", () => {
    console.log("Starting up " + client.user?.tag)
})

client.on("message", (message) => {
    // Only watch one channel
    if(message.channel.id === process.env.CHANNEL_ID) {
        const messageParser = new MessageParser(message)

        // is this message for me?
        if(messageParser.forMe) {
            switch (messageParser.command) {
                case "status":
                    status(messageParser)
                    break;

                case "deploy":
                    deploy(messageParser)
                    break;

                case "destroy":
                    destroy(messageParser)
                    break;

                case "info":
                    info(messageParser)
                    break;
            
                default:
                    help(messageParser)
                    break;
            }
        }
    }
})

client.login(process.env.BOT_TOKEN)

const status = async (message: MessageParser) => {
    // Get Jobs
    const jobs = await gitlab.projects(parseInt(String(process.env.PROJECT_ID))).jobs(50)

    // Parse jobs
    const jobParser = new JobParser(jobs)
    const status = jobParser.deploymentStatus()

    message.message.reply("The Crit Cola Minecraft server is currently " + status)
}

const deploy = async (message: MessageParser) => {
    let authorized = await message.isAuthorized()

    if (!authorized) {
        message.message.reply("You're not authorized to preform this action")
        return
    }

    // Get Jobs
    const jobs = await gitlab.projects(parseInt(String(process.env.PROJECT_ID))).jobs(50)

    // Parse jobs
    const jobParser = new JobParser(jobs)
    const status = jobParser.deploymentStatus()

    // Check if deployed
    if(status !== "destroyed") {
        message.message.reply("The Crit Cola Minecraft server is not currently destroyed")
        return
    }

    // Make sure another pipeline isnt running
    if ( jobParser.anyPipelineBuilding()) {
        message.message.reply("Server already deploying")
        return
    }

    try {
        const pipeline = await gitlab.projects(parseInt(String(process.env.PROJECT_ID))).pipeline().start()
        if(pipeline) message.message.reply("Deploying the Crit Cola Minecraft server!") 
    } catch (e) {
        console.log(e)
        message.message.reply("Could not deploy the Crit Cola Minecraft server")
    }
}

const destroy = async (message: MessageParser) => {
    let authorized = await message.isAuthorized()

    if (!authorized) {
        message.message.reply("You're not authorized to preform this action")
        return
    }

    const MCproject = gitlab.projects(parseInt(String(process.env.PROJECT_ID)))

    // Get Jobs
    const jobs = await MCproject.jobs(50)

    // Parse jobs
    const jobParser = new JobParser(jobs)

    try {
        const job = await MCproject.job(jobParser.getDestoryJobID()).play()
        if(job) {
            message.message.reply("Destroying the Crit Cola Minecraft server!")
        }
    }
    catch(e) {
        console.log(e)
        message.message.reply("Could not destroy the Crit Cola Minecraft server!")
    }
}

const help = async (message: MessageParser) => {
    message.message.reply("**Crit Cola Minecraft server!** \n\nAvailable commands:\n!mc status \n!mc info \n!mc deploy \n!mc destory")
}

const info = async (message: MessageParser) => {
    message.message.reply("\n**Mod pack:** Sky Factory 4 \n**Version:** 4.2.2 \n**MC Version:** 1.12.2 \n**Server:** minecraft.critcola.com")
}
