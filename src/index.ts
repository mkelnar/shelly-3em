/*! ******************************************************************************************************** *
 *
 * Copyright 2022 Michal Kelnar
 *
 * SPDX-License-Identifier: BSD-3-Clause
 * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 *
 * ********************************************************************************************************* */

import fetch, { Response } from "node-fetch";

export class Shelly3EM {
    private location : string;
    private readonly api : string;
    private blockCounter : number;

    constructor() {
        this.location = "";
        this.api = "/status";
        this.blockCounter = 0;
    }

    public async FetchData() : Promise<IShellyEM3Status> {
        return this.request(this.location + this.api);
    }

    protected async request($url : string) : Promise<IShellyEM3Status> {
        const responseData : Response = await fetch($url)
        if (!responseData.ok) {
            throw new Error("Error occurred during data fetch: " + responseData.statusText);
        }
        const response : IShellyEM3Status = <IShellyEM3Status>JSON.parse(await responseData.text());
        response.date = new Date(response.unixtime * 1000);

        return response;
    }
}

export interface IShellyEM3Status {
    /**
     * time in format HH:MM
     */
    time : string;
    unixtime : number;
    serial : number;
    mac : string;
    emeters : IShellyEM3[];
    total_power : number;
    emeter_n : IShellyEM3Null;
    update : IShellyUpdate;
    ram_total : number;
    ram_free : number;
    fs_size : number;
    fs_free : number;
    uptime : number;
    /**
     * Extension
     */
    date : Date;
}

export interface IShellyEM3 {
    power : number;
    pf : number;
    current : number;
    voltage : number;
    is_valid : boolean;
    total : number;
    total_returned : number;
}

export interface IShellyEM3Null {
    current : number;
    ixsum : number;
    mismatch : boolean;
    is_valid : boolean;
}

export interface IShellyUpdate {
    status : string;
    has_update : boolean;
    new_version : string;
    old_version : string;
}
