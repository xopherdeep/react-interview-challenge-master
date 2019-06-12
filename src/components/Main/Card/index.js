import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import "./_card.css";
import SelectTeam from "../SelectTeam";
import Switch from '@material-ui/core/Switch';
import Input from '@material-ui/core/Input';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import EditIcon from '@material-ui/icons/Edit';
import RestoreIcon from '@material-ui/icons/Save';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';

import MCard from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

class Card extends Component {
  state = {
    id: 0,
    player: [],
    readonly : true, 
    favorite: false 
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

  render(){
    const card = this;
    const player = card.props.player;
    return (
      <MCard className="card-container" style={{ ...card.props.style }} >
        <form onSubmit={card.saveCard} id={player.id} ref={'form-'+player.id}>
          <input 
            type="hidden" name="id" value={player.id} 
          />
          <Input
            key={player.id} 
            defaultValue={player.name} 
            onChange={card.changeName}
            disabled={card.state.readonly} 
            name="name" 
            inputProps={{
              'aria-label': 'Description',
            }}
          />
          <img src={'http://localhost:3008/'+player.image} alt="player_image" />
          <div>
            <SelectTeam 
              key={player.id}
              teams={card.props.teams} 
              activeTeam={card.props.player.team.id} 
              disabled={card.state.readonly} 
            />
          </div>
          <BottomNavigation>
              <IconButton aria-label="Edit/Save"
                onClick={card.toggleReadonly} 
                color={card.state.readonly ? "inherit" : "primary" } 
              >
                {card.state.readonly
                  ? <EditIcon/>
                  :<RestoreIcon/> 
                }
              </IconButton>
              <IconButton 
                aria-label="Favorite" 
                color={card.props.isFavorite ? "secondary": "inherit"} 
                onClick={card.toggleFavorite}
              >
                <FavoriteIcon/>
              </IconButton>
          </BottomNavigation>
        </form>
      </MCard>
    )
  }

  componentDidMount(){
    const app = this;
    app.setState({
      id : app.props.player.id,
      favorite : app.props.isFavorite,
      player: app.props.player
    });
  }

  toggleReadonly = () => {
    const card = this;
    card.setState({
      readonly : (card.state.readonly) ? false : true 
    },function(){
      if(card.state.readonly){
        const form = card.refs['form-'+card.props.player.id];
        card.saveCard( form );
      }
    });
  }

  toggleFavorite = (e) => {
    const card = this;

    card.setState({
      favorite: card.props.isFavorite ? false : true 
    }, updateFavorite);

    function updateFavorite(){
      if(card.state.favorite){
        card.addFavorite();
      } else {
        card.removeFavorite();
      }
    }
  }

  saveCard = (player) => {
    const card = this;
    const API = {
      player : 'http://localhost:3008/players/'+player.id.value,
    };

    card.fetch(API.player, {
      method: 'PATCH',
      body: { 
        name : player.name.value,
        team: player.team.value
      }
    });
  }

  addFavorite = () => {
    const card = this;
    const playerId = card.props.player.id;
    card.fetch(card.API.favorites,{ 
      method : 'POST',
      body : {
        id: playerId,
        player: playerId,
        checked :card.state.favorite 
      }
    }, card.props.toggleFavorite);
  }

  removeFavorite = () => {
    const card = this;
    card.fetch(card.API.favorites + card.props.player.id, { 
      method : 'DELETE'
    }, card.props.toggleFavorite);
  }

};

export default Card;
