import axios from "axios"
import Jobs from "../src/jobs"
import {PipelineOptions, Pipeline} from "../../../types/Gitlab"

export default class Pipelines {
    private baseURL: string
    private piplineID: number | null
    private accessToken: string

    constructor(options: PipelineOptions) {
        this.baseURL = options.baseURL + "/pipeline"
        this.accessToken = options.accessToken

        if (options.pipeLineID) this.piplineID = options.pipeLineID
    }

    all() {
        return axios.get<Pipeline[]>(this.baseURL + "s", {
            headers: {
                "PRIVATE-TOKEN": this.accessToken
            }
        })
        .then(res => res.data.map((pipeline) => ({
            ...pipeline,
            jobs: new Jobs({
                baseURL: this.baseURL + "/" + pipeline.id,
                accessToken: this.accessToken
            })
        })
        ))
        .catch(e => {
            throw e
        })
    }

    start(ref: string = "master") {
        return axios.post(this.baseURL, {
            ref: ref
        },
        {
            headers: {
                "PRIVATE-TOKEN": this.accessToken
            }
        })
        .then(res => res.data)
        .catch(e => {
            console.log(e)
            throw e
        })
    }
}