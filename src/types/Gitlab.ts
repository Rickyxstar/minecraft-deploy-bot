import Jobs from "../util/Gitlab/src/jobs";

export interface GitlabOptions {
    host?: string
    secure?: boolean
    version?: string
}

interface SubClassOptions {
    baseURL: string
    accessToken: string
}

export interface ProjectOptions extends SubClassOptions {
    projectID?: number
}

export interface PipelineOptions extends SubClassOptions {
    pipeLineID?: number
}

export interface Pipeline {
    id: number
    sha: string
    ref: string
    status: PipelineStatus
    created_at: string
    updated_at: string
    web_url: string
    jobs: Jobs
}

enum PipelineStatus {
    running = "running",
    pending = "pending", 
    success = "success", 
    failed = "failed", 
    canceled = "cancled", 
    skipped = "skipped", 
    created = "created", 
    manual = "manual"
}

export interface JobOptions extends SubClassOptions {
    jobID?: number
}

export interface Job {
    id: number
    status: PipelineStatus
    stage: string
    name: string
    ref: string
    tag: boolean
    coverage: null
    allow_fairlure: boolean
    created_at: string
    started_at: string
    finished_at: string
    duration: number
    user: {
        id: number
        name: string
        username: string
        state: string
        avatar_url: string
        web_url: string
        bio: string
        bio_html: string
        locaiton: string
        public_email: string
        skype: string
        linkedin: string
        twitter: string
        website_url: string
        organization: string
        job_title: string
        work_infermation: null
    }
    pipeline: {
        id: number
        sha: string
        ref: string
        status: PipelineStatus
        created_at: string
        updated_at: string
        web_url: string
    }
}

