import React, { Component } from "react";
import styles from "./styles";

class Search extends Component {
  state = {
    query: '',
  }

  handleChange = (element) => {
    this.props.onTextChange(this.search.value);
  }

  render(){
    return <div style={{ ...styles.container, ...this.props.style }}>
        <input 
          placeholder="Search..." 
          ref={input => this.search = input}
          onChange={this.handleChange}
        />
      </div>;
  }

}

export default Search;
