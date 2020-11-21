import React from 'react';
import House from './house'
import Search from './components/search'
import {MLSService} from './services/mls'
import {ZillowService} from './services/zillow'
import './index.css';
import './css/bootstrap.min.css'

export class AllHouses extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        houses: [],
        displayHome: true,
        gettingResults: false,
      };
      this.handleSubmit = this.handleSubmit.bind(this)
  }

  createHouse(house) {
    return (
      <div className="row top-buffer" key={house.street}>
        <House info={house}/>
      </div>
    )
  }

  createHouses(houses) {
    return houses.map(this.createHouse);
  }

  async handleSubmit(e, city, state) {
    e.preventDefault()

    const houses = await this.mlsService(city, state)

    let updated = []
    for (let house of houses) {
      const resp = await this.zillowService(house)

      if (resp.equity) {
        house['equity'] = resp.equity
      }
      if (resp.rentEstimate) {
        house['rentEstimate'] = resp.rentEstimate
      }
      if (resp.zEstimate) {
        house['zEstimate'] = resp.zEstimate
      }
      if (resp.houseURL) {
        house['houseURL'] = resp.houseURL
      }

      updated.push(house)
    }

    this.setState({
      houses: updated,
      displayHome: false,
    })
  }

  async mlsService(city, state) {
    console.info(`Invoking MLS service for ${city}, ${state}`)
    const resp = await MLSService.prototype.get(city, state)
    console.log('mls resp: ', resp)
    return resp
  }

  async zillowService(house) {
    console.info('Invoking Zillow service for house', house)
    const resp = await ZillowService.prototype.get(house)
    return resp
  }

  searchBar() {
    return (
      <div className="bgimg">
        <div style={{"position": "absolute", "top": "50%", "left": "37%"}}>
            <Search onSubmit={this.handleSubmit}/>
        </div>
      </div>
    )
  }

  displayResults() {
    return (
      <div>
        <div className="navbar navbar-inverse navbar-fixed-top">
          <center>
            <Search onSubmit={this.handleSubmit}/> 
          </center>
        </div>
        <div style={{"paddingTop": "50px", "margin": "0 auto", width: "40%"}}>
          <center>
            {this.state.gettingResults ? <span className="gettingResults">Getting Results...</span> : null }
          </center>
        </div>
        <div className="container" style={{"paddingTop": "25px"}}>
              {this.createHouses(this.state.houses)}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.state.displayHome ? this.searchBar() : this.displayResults() }
      </div>
    );
  }
}