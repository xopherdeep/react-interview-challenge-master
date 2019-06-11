import React, { Component } from "react";
import styles from "./styles";
import "./_card.css";
import SelectTeam from "../SelectTeam";

class Card extends Component {
  state = {
    readonly : true 
  }

  toggleReadonly = () => {
    const card = this;
    card.setState({
      readonly : (card.state.readonly) ? false : true 
    });
  }

  saveCard = (e) => {
    const card = this;
    const player = null;
    e.preventDefault();
    console.log(e.target.id.value);

    const API = {
      player : 'http://localhost:3008/players/'+e.target.id.value,
    };

    fetch(API.player,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'patch',
      body: JSON.stringify({ 
         name : e.target.name.value 
      })
    })
  }

  render(){
    const card = this;
    let playerName = card.props.name;
    return <div className="card-container" style={{ ...styles.container, ...card.props.style }}>
      <form onSubmit={card.saveCard} className="card">
        <input type="hidden" name="id" value={card.props.id}/>
        <div style={styles.name}>
          <input type="text" value={playerName} disabled={card.state.readonly} name="name" />
        </div>
        <img src={'http://localhost:3008/'+card.props.image} style={styles.playerImage} alt="player_image" />
        <div>
          <SelectTeam teams={card.props.teams} activeTeam={card.props.team.id} disabled={card.state.readonly} />
        </div>
        <div>
          <button onClick={card.toggleReadonly}>
            {card.state.readonly ? 'Edit' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  }
};

export default Card;
