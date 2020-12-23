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
        messageForUser: "",
        errorMessage: ""
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

    this.errorMessage = ""
    this.messageForUser = "Getting Results..."

    this.setState({
      displayHome: false,
    })

    const houses = await this.mlsService(city, state)

    // TODO: Rework to make these calls concurrently to improve performance
    let updated = []
    if (houses) {
      if (!Array.isArray(houses)) {
        return
      }

      for (let house of houses) {
        this.zillow(house, updated)
      }
    }

    this.messageForUser = ""
  }

  async zillow(house, updated) {
    const resp = await this.zillowService(house)

    if (!resp) {
      return
    }

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
    if (resp.cashFlow) {
      house['cashFlow'] = resp.cashFlow
    }

    updated.push(house)
    this.setState({
      houses: updated,
    })
  }

  async mlsService(city, state) {
    try {
      const resp = await MLSService.prototype.get(city, state)
      console.log('msp resp: ', resp)

      if (resp.message) {
        this.messageForUser = resp.message
        this.setState({})
      }

      return resp
    } catch (error) {
      console.error('MLS service error: ', error.toString())
      this.errorMessage = error.toString()
      this.setState({
        errorMessage: error.toString()
      })
    }
  }

  async zillowService(house) {
    try {
      const resp = await ZillowService.prototype.get(house)

      if (resp.message) {
        this.messageForUser = resp.message
        this.setState({
          messageForUser: resp.message
        })
      }

      return resp
    } catch (error) {
      this.errorMessage = error.toString()
      this.setState({
        errorMessage: error.toString()
      })
    }
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
        <div className="message">
          <center>
            <span className="userMessage">{this.messageForUser}</span>
            <span className="errMessage">{this.errorMessage}</span>
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