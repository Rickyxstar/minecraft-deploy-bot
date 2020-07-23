import {ProjectOptions, Pipeline} from "../../../types/Gitlab"
import Pipelines from "./pipelines"
import Jobs from "./jobs"
import JobsParser from "../../jobsParser"

export default class Project {
    private baseURL: string
    private projectID: number
    private accessToken: string

    constructor(options: ProjectOptions) {
        this.baseURL = options.baseURL + "/projects" + ((options.projectID)? "/" + options.projectID: "")
        this.accessToken = options.accessToken
        
        if (options.projectID) this.projectID = options.projectID
    }

    pipelines() {
        return new Pipelines({
            baseURL: this.baseURL,
            accessToken: this.accessToken,
            pipeLineID: undefined,
        }).all()
    }

    pipeline() {
        return new Pipelines({
            baseURL: this.baseURL,
            accessToken: this.accessToken,
            pipeLineID: undefined,
        })
    }

    jobs(per_page: number = 20) {
        return new Jobs({
            baseURL: this.baseURL,
            accessToken: this.accessToken
        }).all(per_page)
    }

    job(jobID: number) {
        return new Jobs({
            baseURL: this.baseURL,
            accessToken: this.accessToken,
            jobID: jobID
        })
    }
}