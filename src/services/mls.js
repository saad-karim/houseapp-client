import React from 'react';
import RequestSigner from 'aws4';

export class MLSService extends React.Component {

  async get(queryParams) {
    console.info(`MLSService --- Getting MLS listing for: ` + JSON.stringify(queryParams))

    const city = queryParams.city
    const state = queryParams.state

    if ((!city) || (!state)) {
      throw new Error("City and State are required");
    } 

    let price_min = 100000
    let price_max = 250000
    let sqft = 1200
    
    if (queryParams.filters) {
      if (queryParams.filters.price_min) {
        price_min = queryParams.filters.price_min
      }
      if (queryParams.filters.price_max) {
        price_max = queryParams.filters.price_max
      }
      if (queryParams.filters.sqft) {
        sqft = queryParams.filters.sqft
      }
    }

    const host = process.env.REACT_APP_MLS_SERVICE_GATEWAY
    if (!host) {
      throw new Error("MLS service API gateway not specified")
    }
    console.info('MLS service API gateway: ', host)

    const stage = process.env.REACT_APP_STAGE
    const uri = `${stage}/mls?city=${city}&state=${state}&price_min=${price_min}&price_max=${price_max}&sqft=${sqft}`
    console.info('GET ', uri)

    const opts = {
      host: host,
      service: 'execute-api',
      region: 'us-east-1',
      path: uri,
      method: 'GET',
    }
    RequestSigner.sign(opts, { accessKeyId: process.env.REACT_APP_AWS_ID, secretAccessKey: process.env.REACT_APP_AWS_SECRET })

    // To enable IAM, I had to:
    // 1. Configure OPTIONS method to return back CORS related headers
    // 2. Set Authorization and Z-Amz-Date headers in request
    // 3. Path needs to be signed

    try {
      // const response = await fetch(`https://${host}/${stage}/mls?city=${city}&state=${state}`, { // TODO: Catch authorization error
      const response = await fetch(`https://${host}/${uri}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Host': "ai17da5ugl.execute-api.us-east-1.amazonaws.com",
          'X-Amz-Date': opts.headers['X-Amz-Date'],
          'Authorization': opts.headers.Authorization,
        },
      })

      const data = (await response).json()
      if (!response.ok) {
        const error = (await data)
        if (error.error) {
          throw new Error(error.error)
        }
        throw error
      }

      // const data = [
      //   {street: "2201 Mountain Mist Ct Unit 101", city: "Raleigh", state: "NC", price: "180300"},
      //   {street: "4416 Vienna Crest Dr", city: "Raleigh", state: "NC", price: "245000"}
      // ]

      return data
    } catch (error) {
      const e = error.toString()
      throw new Error(`failed to get MLS listing: ${e}`)
    }
  }
}