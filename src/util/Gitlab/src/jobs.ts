import axios from "axios"
import {JobOptions, Job} from "../../../types/Gitlab"

export default class Jobs {
    private _baseURL: string
    private jobID: number | null
    private _accessToken: string

    constructor(options: JobOptions) {
        this._baseURL = options.baseURL + "/jobs" + ((options.jobID)? "/" + options.jobID: "")
        this._accessToken = options.accessToken

        if (options.jobID) this.jobID = options.jobID
    }

    all(per_page: number = 20) {
        return axios.get<Job[]>(this._baseURL + "?per_page=" + per_page, {
            headers: {
                "PRIVATE-TOKEN": this._accessToken
            }
        })
        .then(res => res.data)
        .catch(e => {
            throw e
        })
    }

    play() {
        return axios.post<Job[]>(this._baseURL + "/play", {}, {
            headers: {
                "PRIVATE-TOKEN": this._accessToken
            }
        })
        .then(res => res.data)
        .catch(e => {
            throw e
        })
    }
}