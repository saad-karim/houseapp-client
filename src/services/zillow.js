import React from 'react';

export class ZillowService extends React.Component {
  async get(house) {
    console.info('Zillow --- getting information for', house)

    const host = process.env.REACT_APP_ZILLOW_SERVICE_GATEWAY
    if (!host) {
      throw new Error("Zillow service API gateway not specified")
    }
    console.info('Zillow service API gateway: ', host)

    try {
      const response = await fetch(`https://${host}/zestimate/state/${house.state}/city/${house.city}/street/${house.street}?listPrice=${house.price}`)
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