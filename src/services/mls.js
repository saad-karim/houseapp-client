import React from 'react';

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

    try {
      const response = await fetch(`https://${host}/mls?city=${city}&state=${state}`)
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