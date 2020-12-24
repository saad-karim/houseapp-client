import React from 'react';

export class Search extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        city: "",
        state: "",
      }
      this.onSubmit = this.props.onSubmit
  }

  updateCityInputValue(evt) {
    this.setState({
      city: evt.target.value
    });
  }

  updateStateInputValue(evt) {
    this.setState({
      state: evt.target.value
    });
  }

  render() {
    return (
      <div>
        <div>
          <form className="navbar-form inline" onSubmit={(e) => this.onSubmit(e, this.state.city, this.state.state)}>
            <div className="form-group input-pad">
              <input className="form-control" placeholder="City" value={this.state.city} onChange={evt => this.updateCityInputValue(evt)} type="text" name="city" />
            </div>
            <div className="form-group input-pad">
              <input className="form-control" placeholder="State" value={this.state.state} onChange={evt => this.updateStateInputValue(evt)} type="text" name="state" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">
              Search
            </button>
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