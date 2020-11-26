import React from 'react';

export class ZillowService extends React.Component {
  async get(house) {
    console.info('Zillow --- getting information for', house)

    try {
      const response = await fetch(`https://2h9m1ne759.execute-api.us-east-1.amazonaws.com/dev/houses/state/${house.state}/city/${house.city}/street/${house.street}?listPrice=${house.price}`)
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