import React, { Component } from "react";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

class SelectTeam extends Component {
  constructor(props) {
    super(props)
    this.state = {
      team : this.props.activeTeam
    };
  }

  render(){
    const selectTeam = this; 
    const options = selectTeam.props.teams.map(teamOptions);

    function teamOptions(team){
      return(
        <MenuItem 
          key={team.id}
          value={team.id} 
        >
          {team.name}
        </MenuItem>
      )
    }

    return (
      <div>
        <FormControl >
        <Select
          key={selectTeam.props.id}
          value={selectTeam.state.team}
          onChange={(e)=>{
            selectTeam.setState({ team : e.target.value});
          }}
          name="team" 
          disabled={selectTeam.props.disabled}
        >
          {options}
        </Select>
      </FormControl>
      </div>
    )
  }
}

export default SelectTeam;
