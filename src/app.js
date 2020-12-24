import React from 'react';
import House from './house'
import Search from './components/search'
import {MLSService} from './services/mls'
import {ZillowService} from './services/zillow'
import { DropdownButton, Dropdown } from 'react-bootstrap';
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
        errorMessage: "",
        sortedAsc: false,
        sortOn: 'zEstimate'
      };
      this.handleSubmit = this.handleSubmit.bind(this)
      this.displaySortArrow = this.displaySortArrow.bind(this)
      this.sort = this.sort.bind(this)
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

    let updated = []
    if (houses) {
      if (!Array.isArray(houses)) {
        return
      }

      for (let house of houses) {
        this.zillow(house, updated)
      }
    }

    this.messageForUser = null
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
      houses: updated.sort((a, b) => (b.zEstimate - a.zEstimate)),
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
      this.messageForUser = ""
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
      this.messageForUser = ""
    }
  }

  sort(key) {
    if (this.state.sortedAsc) {
      this.setState({
        sortedOn: key,
        houses: this.state.houses.sort((a, b) => (b[key] - a[key])),
        sortedAsc: false,
      })
    } else {
      this.setState({
        sortedOn: key,
        houses: this.state.houses.sort((a, b) => (a[key] - b[key])),
        sortedAsc: true,
      })
    }
  }

  searchBar() {
    return (
      <div className="bgimg">
        <div className="homeSearchBar">
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
        {/* <div className="container" style={{"paddingTop": "25px"}}> */}
        <div className="container">
          <div className="sort">
            <DropdownButton id="dropdown-basic-button" title="Sort">
              <Dropdown.Item onClick={() => this.sort('zEstimate')}>zEstimate {this.displaySortArrow('zEstimate')}</Dropdown.Item>
              <Dropdown.Item onClick={() => this.sort('cashFlow')}>Cash Flow {this.displaySortArrow('cashFlow')}</Dropdown.Item>
              <Dropdown.Item onClick={() => this.sort('price')}>Price {this.displaySortArrow('price')}</Dropdown.Item>
              <Dropdown.Item onClick={() => this.sort('equity')}>Equity {this.displaySortArrow('equity')}</Dropdown.Item>
            </DropdownButton>
          </div>
          <div className="house-container">
            {this.createHouses(this.state.houses)}
          </div>
        </div>
      </div>
    )
  }

  displaySortArrow(key) {
    if (key == this.state.sortedOn) {
      if (this.state.sortedAsc) {
        return (
          <img className="sorted-arrow" src="up.png"></img>
        )
      } else {
        return (
          <img className="sorted-arrow" src="down.png"></img>
        )
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.displayHome ? this.searchBar() : this.displayResults() }
      </div>
    );
  }
}