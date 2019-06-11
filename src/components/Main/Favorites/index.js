import React, { Component } from "react";
import './_favorites.css';

class Favorites extends Component {
  render(){
    const fav = this;
    return <div className="favorites-container">{'♥'} <b>{fav.props.count}</b></div>;
  }
}

export default Favorites;
