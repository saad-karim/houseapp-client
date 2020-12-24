import React from 'react';
import RequestSigner from 'aws4';

export class MLSService extends React.Component {

  async get(city, state) {
    console.info(`MLSService --- Getting MLS listing for ${city}, ${state}`)

    if ((city === "") || (state === "")) {
      throw new Error("City and State are required");
    } 

    const host = process.env.REACT_APP_MLS_SERVICE_GATEWAY
    if (!host) {
      throw new Error("MLS service API gateway not specified")
    }
    console.info('MLS service API gateway: ', host)

    const stage = process.env.REACT_APP_STAGE
    const opts = {
      host: host,
      service: 'execute-api',
      region: 'us-east-1',
      path: `/${stage}/mls?city=${city}&state=${state}`,
      method: 'GET',
    }
    RequestSigner.sign(opts, { accessKeyId: process.env.REACT_APP_AWS_ID, secretAccessKey: process.env.REACT_APP_AWS_SECRET })

    // To enable IAM, I had to:
    // 1. Configure OPTIONS method to return back CORS related headers
    // 2. Set Authorization and Z-Amz-Date headers in request
    // 3. Path needs to be signed

    try {
      const response = await fetch(`https://${host}/${stage}/mls?city=${city}&state=${state}`, {
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