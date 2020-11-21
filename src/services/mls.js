import React from 'react';

export class MLSService extends React.Component {

  async get(city, state) {
    console.info(`MLSService --- getting MLS listing for ${city}, ${state}`)

    if ((city === "") || (state === "")) {
      throw new Error("City and State are required");
    } 

    try {
      const response = fetch("https://jn6cxjfjye.execute-api.us-east-1.amazonaws.com/dev/mls?city="+city+"&state="+state)
      const json = (await response).json()

      return json
    } catch (error) {
      throw new Error("failed to get MLS listing", error)
    }
  }
}