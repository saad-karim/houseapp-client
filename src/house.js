import React from 'react';
import math from 'mathjs'

export class House extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            street: this.props.info.street,
            city: this.props.info.city,
            state: this.props.info.state,
            listPrice: this.props.info.price,
            zEstimate: this.props.info.zEstimate,
            rentEstimate: this.props.info.rentEstimate,
            imageURL: this.props.info.imgurl,
            houseURL: this.props.info.houseURL,
            sqft: this.props.info.sqft,
            equity: this.props.info.equity,
            cashFlow: this.props.info.cashFlow,
        };
    }

    render() {
        var color = "black";
        var intZesimate = parseInt(this.state.equity, 10);
        var comp = math.compare(intZesimate, 15000);
        if (comp === 1) {
          color = "green";
        } else {
          color = "orange";
        }
        comp = math.compare(5000, intZesimate);
        if (comp === 1) {
          color = "red";
        }

        return(
          <div className="zoom">
            <a href={this.state.houseURL} target="_blank">
              <div className="col-md-8">
                <h2>{this.state.street}, {this.state.city}, {this.state.state} | ${this.state.listPrice}</h2>
                <div style={{"paddingBottom": "8px"}}>
                  <b>
                    <span style={{color: color, "paddingRight": "25px", "fontSize": "12pt"}}>Equity: ${this.state.equity}</span>
                    <span style={{"fontSize": "12pt"}}>Cash Flow: ${this.state.cashFlow}</span>
                  </b>
                </div>
                <p>zEstimate: ${this.state.zEstimate}</p>
                <p>Rent Estimate: ${this.state.rentEstimate}</p>
                <p>SQFT: {this.state.sqft}</p>
              </div>
              <div className="col-md-4 pull-right">
                <img src={this.state.imageURL} className="img-thumbnail" alt="200x200" />
              </div>
            </a>
          </div>
        );
    }
}

export default House