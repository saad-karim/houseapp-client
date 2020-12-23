import React from 'react';
import RequestSigner from 'aws4';

export class ZillowService extends React.Component {
  async get(house) {
    console.info('Zillow --- getting information for', house)

    const host = process.env.REACT_APP_ZILLOW_SERVICE_GATEWAY
    if (!host) {
      throw new Error("Zillow service API gateway not specified")
    }
    console.info('Zillow service API gateway: ', host)

    const stage = process.env.REACT_APP_STAGE
    const opts = {
      host: host,
      service: 'execute-api',
      region: 'us-east-1',
      path: `/${stage}/zestimate/state/${house.state}/city/${house.city}/street/${house.street}?listPrice=${house.price}`,
      method: 'GET',
    }
    RequestSigner.sign(opts, { accessKeyId: process.env.REACT_APP_AWS_ID, secretAccessKey: process.env.REACT_APP_AWS_SECRET })

    try {
      const response = await fetch(`https://${host}/${stage}/zestimate/state/${house.state}/city/${house.city}/street/${house.street}?listPrice=${house.price}`, {
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

      return data
    } catch (error) {
      throw new Error(`failed call to Zillow API server for '${house.street}': ${error}`)
    }
  }
}