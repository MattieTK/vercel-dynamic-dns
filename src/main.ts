import fetch from 'node-fetch';
const dotenv = require('dotenv').config()
const publicIP = require('public-ip');
import { VercelRecord, VercelPagination, VercelRecordList } from './types'


const getDomain = async function (vercelKey: string, domain: string): Promise<VercelRecordList> {
    const options = {
        headers: {
            "Authorization": `Bearer ${vercelKey}`,
            "Content-Type": "application/json"
        }
    }
    try {
        let response = await fetch(`https://api.vercel.com/v4/domains/${domain}/records`, options)
        let result: VercelRecordList = await response.json()
        return result
    }
    catch (err) {
        console.log(err)
    }
}

const getRecordID = async function (name: string, recordList: VercelRecordList): Promise<VercelRecord> {
    if (name === undefined) {
        console.error("Name undefined")
        if (recordList.error) {
            console.error("Vercel Error :: ", JSON.stringify(recordList))
        }
        else {
            console.log("Checking subdomain :: ", name)

            return recordList.records.filter(record => record.name == name)[0]
        }
    }
}

const checkIPonRecord = async function (record: VercelRecord): Promise<boolean> {
    if (record === undefined) {
        console.log("Record does not exist")
        return false
    }
    const IP = await publicIP.v4();
    if (IP && IP == record.value) {
        console.log("IP matches :: ", IP)
        return true
    }
    else {
        console.log("IP match failed against :: ", IP)
        return false
    }

}

const updateRecord = async function (vercelKey: string, domain: string, recordToDelete?: VercelRecord, options?: { name: string, type: string }): Promise<{ "uid": string }> {
    try {
        const IP = await publicIP.v4();
        if (recordToDelete) {
            let deleteOptions = {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${vercelKey}`,
                    "Content-Type": "application/json"
                }
            }
            let deleteResponse = await fetch(`https://api.vercel.com/v2/domains/${domain}/records/${recordToDelete.id}`, deleteOptions)
            let deleteResult = await deleteResponse.json()
            console.log("Record deleted :: ", deleteResult)
        }
        console.log(options)
        let createOptions = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${vercelKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": recordToDelete ? recordToDelete.name : options.name,
                "type": recordToDelete ? recordToDelete.type : options.type,
                "value": IP
            })
        }
        let createResponse = await fetch(`https://api.vercel.com/v2/domains/${domain}/records/`, createOptions)
        let createResult = await createResponse.json()
        if (createResult.error) {
            console.error("Error creating record :: ", createResult.error)
            return
        }
        console.log("Record created :: ", createResult)
        return createResult
    }
    catch (err) {
        console.log(err)
    }
}

const loop = async function () {
    let recordList = await getDomain(process.env.VERCEL_API_KEY, process.env.DOMAIN);
    if (recordList) {
        let record = await getRecordID(process.env.SUBDOMAIN, recordList)
        if (record) {
            let recordCheck = await checkIPonRecord(record)
            if (!recordCheck) {
                updateRecord(process.env.VERCEL_API_KEY, process.env.DOMAIN, record)
            }
        }
        else {
            updateRecord(process.env.VERCEL_API_KEY, process.env.DOMAIN, null, { name: process.env.SUBDOMAIN, type: "A" })
        }
    }
}

const timeout = function (): Promise<any> {
    const timeout = parseInt(process.env.TIMEOUT) || 300;
    console.log(`Sleeping :: ${timeout} seconds`)
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve(); }, 1000 * timeout)
    })
}

const main = async function () {
    while (true) {
        await loop()
        await timeout()
    }
}


try {
    main()
}
catch (err) {
    console.error(err)
}
