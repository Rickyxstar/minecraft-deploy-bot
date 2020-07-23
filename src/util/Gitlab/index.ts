import { GitlabOptions } from "../../types/Gitlab"
import Projects from "./src/projects"

export default class Gitlab {
    private accessToken: string
    gitLabHost: string = "gitlab.com"
    private secure: boolean = true
    private version: string = "v4"
    
    constructor(accessToken: string, options: GitlabOptions = {}) {
        this.accessToken = accessToken
        if (options.host) this.gitLabHost = options.host
        if (options.secure) this.secure = options.secure
        if (options.version) this.version = options.version
    }

    projects(projectID: number | undefined = undefined) {
        return new Projects({
            baseURL: this.baseURL(),
            accessToken: this.accessToken,
            projectID: projectID
        })
    }

    private baseURL() {
        let protocal = (this.secure)? "https://": "http://"

        return protocal + this.gitLabHost + "/api/" + this.version
    }
}