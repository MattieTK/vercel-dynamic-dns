export type VercelRecord = {
    id: string,
    slug: string,
    name: string,
    type: string,
    value: string,
    mxPriority?: string,
    creator: string,
    created: number,
    updated: number,
    createdAt: number,
    updatedAt: number
}

export type VercelPagination = {
    count: number,
    next?: number,
    prev?: number

}

export type VercelRecordCreation = {
    uid: string,
    updated?: number,
}

export type VercelRecordList = {
    error?: object,
    records: [VercelRecord],
    pagination: VercelPagination
}
