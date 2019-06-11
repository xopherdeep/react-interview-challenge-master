import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import styles from "./styles";
import "./_card.css";
import SelectTeam from "../SelectTeam";
import Switch from '@material-ui/core/Switch';
import Input from '@material-ui/core/Input';

const initialState = {
  readonly : true, 
  favorite: false 
}

class Card extends Component {
  constructor(props) {
      super(props)
      this.state = initialState;
  }
  reset() {
      this.setState(initialState);
  }

  API = {
    players : 'http://localhost:3008/players/',
    favorites: 'http://localhost:3008/favorites/',
  };

  fetch = (api, options, callback) => {
    fetch(api,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: options.method,
      body: JSON.stringify(options.body)
    }).then(callback);
  }

  toggleReadonly = () => {
    const card = this;
    card.setState({
      readonly : (card.state.readonly) ? false : true 
    });
  }

  toggleFavorite = (e) => {
    const card = this;
    card.setState({
      favorite: e.target.checked 
    });

    if(e.target.checked){
      card.fetch(card.API.favorites,{ 
        method : 'POST',
        body : {
          id: e.target.value,
          player: e.target.value,
          checked : e.target.checked
        }
      }, card.props.toggleFavorite);
    }else{
      card.fetch(card.API.favorites + e.target.value,{ 
        method : 'DELETE'
      }, card.props.toggleFavorite);
    }
  }

  saveCard = (e) => {
    const card = this;
    const player = e.target;
    e.preventDefault();

    const API = {
      player : 'http://localhost:3008/players/'+player.id.value,
    };

    fetch(API.player,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify({ 
        name : player.name.value,
        team: player.team.value
      })
    });
  }

  onChange = (value) => {
    this.setState({name: value})
  
  }

  componentDidMount(){
    const card = this;
    console.log(card.props);
    card.setState({...card.props});
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.startTime !== this.state.startTime) {
      this.setState({ startTime: nextProps.startTime });
    }
  }

  render(){
    const card = this;
    return <div className="card-container" style={{ ...styles.container, ...card.props.style }} >
      <form onSubmit={card.saveCard} id={card.props.id}>
        <Input
          key={card.props.id} 
          defaultValue={card.props.name} 
          disabled={card.state.readonly} 
          name="name" 
          onChange={card.onChange}
          inputProps={{
            'aria-label': 'Description',
          }}
        />
        <input type="hidden" name="id" value={card.props.id}/>
        <img src={'http://localhost:3008/'+card.props.image} style={styles.playerImage} alt="player_image" />
        <div>
          <SelectTeam teams={card.props.teams} activeTeam={card.props.team.id} disabled={card.state.readonly} />
        </div>
        <div>
          <Button type="submit" onClick={card.toggleReadonly} variant="contained" color="primary">
            {card.state.readonly ? 'Edit' : 'Save'}
          </Button>
        </div>
        <label for={'player-'+card.props.id}>
          ♥
        </label>
        <Switch
          checked={card.props.isFavorite}
          onChange={card.toggleFavorite}
          id={'player-'+card.props.id}
          value={card.props.id}
          color="primary"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </form>
    </div>
  }
};

export default Card;
