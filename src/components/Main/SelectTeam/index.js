import React, { Component } from "react";

class SelectTeam extends Component {
  render(){
    const selectTeam = this; 
    const options = selectTeam.props.teams.map(teamOptions);

    function teamOptions(team){
      return <option 
        value={team.id} 
        selected={team.id === selectTeam.props.activeTeam}
      >
        {team.name}
      </option>;
    }

    return <select disabled={selectTeam.props.disabled}>{options}</select>
  }
}

export default SelectTeam;
