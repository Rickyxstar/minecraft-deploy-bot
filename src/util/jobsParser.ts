import {Job} from "../types/Gitlab"

export default class JobsParser {
    private jobs: Job[] = []

    constructor(jobs: Job[]) {
        this.jobs = jobs
    }

    getPipelines() {
        let piplines: {[pipelineID: number]: any[]} = {}

        for (let i = 0; i < this.jobs.length; i++) {
            const pipelineID = this.jobs[i].pipeline.id

            if(!piplines[pipelineID]) piplines[pipelineID] = []

            piplines[pipelineID].push(this.jobs[i])
        }

        return piplines
    }

    getPipelineStatusList(): {id: number, currentStage: string}[] {
        const pipelines = this.getPipelines()

        let statuses: {id: number, currentStage: string}[] = []

        for (const piplineID in pipelines) {
            let jobStatuses = this.getPipelineStatus(pipelines[piplineID])
            let currentStage = "created"
            
            if(jobStatuses.build === "success") currentStage = "build"
            if(jobStatuses.build === "running") currentStage = "building"
            if(jobStatuses.deploy === "success") currentStage = "deploy"
            if(jobStatuses.deploy === "running") currentStage = "deploying"
            if(jobStatuses.destroy === "success") currentStage = "destroy"
            if(jobStatuses.destroy === "running") currentStage = "destroying"

            if (currentStage === "created") continue

            statuses.push({
                id: parseInt(piplineID),
                currentStage: currentStage
            })
        }

        statuses.reverse()
        
        return statuses
    }

    getPipelineStatus(jobs: Job[]): {[x:string]: string} {
        let status = {}
        for (let i = 0; i < jobs.length; i++) {
           status[jobs[i].stage] = jobs[i].status
        }

        return status
    }

    deploymentStatus() {
        let statusList = this.getPipelineStatusList()
        let currentStatus = "deployed"

        for (let i = 0; i < statusList.length; i++) {
            if (statusList[i].currentStage === "destroy") currentStatus = "destroyed"

            if (statusList[i].currentStage === "destroying") {
                currentStatus = "destroying"
                break
            }
            if (statusList[i].currentStage === "deploying") {
                currentStatus = "deploying" 
                break 
            }
            if (statusList[i].currentStage === "deploy") break  
        }

        return currentStatus
    }

    getDestoryJobID(): number {
        const statusList = this.getPipelineStatusList()
        const pipelines = this.getPipelines()

        let jobID: number = 0
        let deployedPipeline: number = 0

        // Find deployed pipeline
        for (let i = 0; i < statusList.length; i++) {
            if (statusList[i].currentStage === "deploy") {
                deployedPipeline = statusList[i].id
                break
            }  
        }

        // Find destory stage
        const pipelineJobs = pipelines[deployedPipeline]
        for (let i = 0; i < pipelineJobs.length; i++) {
            if (pipelineJobs[i].name === "destroy") {
                jobID = pipelineJobs[i].id
                break
            }
        }

        return jobID
    }

    anyPipelineBuilding(): boolean {
        let statusList = this.getPipelineStatusList()
        let building = false

        for (let i = 0; i < statusList.length; i++) {
            building = statusList[i].currentStage === "building"
            break
        }

        return building
    }
}