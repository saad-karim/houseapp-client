import React from 'react';

export class MLSService extends React.Component {

  async get(city, state) {
    console.info(`MLSService --- Getting MLS listing for ${city}, ${state}`)

    if ((city === "") || (state === "")) {
      throw new Error("City and State are required");
    } 

    try {
      const response = await fetch("https://jn6cxjfjye.execute-api.us-east-1.amazonaws.com/dev/mls?city="+city+"&state="+state)
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
      const e = error.toString()
      throw new Error(`failed to get MLS listing: ${e}`)
    }
  }
}