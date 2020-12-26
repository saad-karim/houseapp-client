import React from 'react';
import { Dropdown } from 'react-bootstrap';

export class Search extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        queryParams: {
          "city": undefined,
          "state": undefined,
          "filters": {
            "price_min": undefined,
            "price_max": undefined,
            "sqft": undefined,
          },
        },
      }
      this.onSubmit = this.props.onSubmit
  }

  updateCityInputValue(evt) {
    evt.persist()
    this.setState(prevState => {
      prevState.queryParams.city = evt.target.value
      this.queryParams = prevState
    });
  }

  updateStateInputValue(evt) {
    evt.persist()
    this.setState(prevState => {
      prevState.queryParams.state = evt.target.value
      this.queryParams = prevState
    });
  }

  updateFilterPriceMin(evt) {
    evt.persist()
    this.setState(prevState => {
      prevState.queryParams.filters.price_min = evt.target.value
      this.queryParams = prevState
    });
  }

  updateFilterPriceMax(evt) {
    evt.persist()
    this.setState(prevState => {
      prevState.queryParams.filters.price_max = evt.target.value
      this.queryParams = prevState
    });
  }

  updateFilterSqft(evt) {
    evt.persist()
    this.setState(prevState => {
      prevState.queryParams.filters.sqft = evt.target.value
      this.queryParams = prevState
    });
  }

  render() {
    return (
      <div>
        <div>
          <form className="navbar-form inline" onSubmit={(e) => this.onSubmit(e, this.state.queryParams)}>
            <div className="form-group input-pad">
              <input className="form-control float-left" placeholder="City" onChange={evt => this.updateCityInputValue(evt)} type="text" name="city" />
            </div>
            <div className="form-group input-pad">
              <input className="form-control float-left" placeholder="State" onChange={evt => this.updateStateInputValue(evt)} type="text" name="state" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">
              Search
            </button>
            <Dropdown className="filter-button">
              <Dropdown.Toggle size="lg" id="dropdown-basic">
                Filter
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <div className="filter-menu-container">
                  <div className="filter-item">
                    Price - Min: <input type="text" name="pricemin" value={this.state.queryParams.filters.price_min} onChange={evt => this.updateFilterPriceMin(evt)}/>
                  </div>
                  <div className="filter-item">
                    Price - Max: <input type="text" name="pricemax" onChange={evt => this.updateFilterPriceMax(evt)}/>
                  </div>
                  <div className="filter-item">
                    SQFT: <input type="text" name="sqft" onChange={evt => this.updateFilterSqft(evt)}/>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </form>
        </div>
        <center>
          {this.state.gettingResults ? <span className="gettingResultsHome">Getting Results...</span> : null }
        </center>
      </div>
    )
  }
}

export default Search