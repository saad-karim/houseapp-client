import React from 'react';

export class ZillowService extends React.Component {
  async get(house) {
    console.info('Zillow --- getting information for', house)

    try {
      const response = fetch(`https://2h9m1ne759.execute-api.us-east-1.amazonaws.com/dev/houses/state/${house.state}/city/${house.city}/street/${house.street}?listPrice=${house.price}`)
      const json = (await response).json()

      return json
    } catch (error) {
      throw new Error("failed call to Zillow API server: ", error.toString())
    }
  }
}