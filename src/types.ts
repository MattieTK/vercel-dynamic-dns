export interface VercelRecord {
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

export interface VercelPagination {
    count: number,
    next?: number,
    prev?: number

}

export interface VercelRecordList {
    error?: object,
    records: [VercelRecord],
    pagination: VercelPagination
}