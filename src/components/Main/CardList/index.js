import React, { Component } from "react";
import Card from "../Card";

class CardList extends Component{
  render(){
    const cardList = this;
    const { players, favorites, teams } = cardList.props;

    return players.map(renderCard);
    function renderCard(player){
      const favorited = favorites.findIndex(f => f.player === player.id);
      const team = teams.find(matchTeamById);
      function matchTeamById(team){
        return team.id === player.team;
      }

      if(typeof(team) === 'object')
        player.team = team;

      return (
        <Card 
          player={player} 
          teams={teams}
          isFavorite={favorited >= 0} 
          toggleFavorite={cardList.toggleFavorite}
        />
      );
    }
  }

  toggleFavorite = () => {
    const cardList = this;
    cardList.props.toggleFavorite();
  }
}

export default CardList;
