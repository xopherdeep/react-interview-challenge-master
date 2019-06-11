import React, { Component } from "react";
import Search from "./Search";
import Card from "./Card";
import styles from "./styles";
import Modal from 'react-modal';

const API = {
  players : 'http://localhost:3008/players',
  teams : 'http://localhost:3008/teams',
  favorites: 'http://localhost:3008/favorites'
};

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: null,
      players : [],
      headers: [],
      teams: [],
      favorites: [],
      showModal: false,
      isLoading: false,
    };
  }

  loadPlayers = () => {
    const query = (this.state.search) ? '&q='+this.state.search : null;
    fetch(API.players+'?_limit=10'+query)
      .then(response => response.json())
      .then(data => this.setState({ players: data }));
  }

  onTextChange = (value) => {
    this.setState({
      search : value,
    });
    this.loadPlayers();
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  }

  handleCloseModal= () => {
    this.setState({ showModal: false });
  }

  render() {
    const app = this;
    const { search, players, teams, isLoading } = app.state;

    let listPlayers = players.map(playersCard);

    function playersCard(player){
      const team = teams.find(matchTeamById);

      function matchTeamById(team){
        return team.id === player.team;
      }

      const toggleReadonly = app.handleOpenModal;

      if(typeof(team) == 'object')
        player.team = team;

      return <Card {...player} teams={teams} toggleReadonly={toggleReadonly}/>;
    }

    if (isLoading) {
      return <p>Loading ...</p>;
    }

    return (
      <div style={{ ...styles.container, ...this.props.style }}>
        <div style={styles.title}>NBA Interview</div>
        <Search 
          style={styles.search} 
          onTextChange={this.onTextChange} search={search} 
        />
        {listPlayers}
      </div>
    );
  }

  componentDidMount(){
    this.setState({ isLoading: true });

    this.loadPlayers();

    fetch(API.teams)
      .then(response => response.json())
      .then(data => this.setState({ teams: data }));

    fetch(API.favorites)
      .then(response => response.json())
      .then(data => this.setState({ favorites: data, isLoading: false  }));
  }
}

export default Main;
