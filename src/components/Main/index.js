import React, { Component } from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import Search from "./Search";
import Favorites from "./Favorites";
import Pagination from "./Pagination";
import Card from "./Card";
import styles from "./styles";
import Modal from 'react-modal';

import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HeartIcon from '@material-ui/icons/Favorite';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';

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
      totalPlayers: 0,
      page: 1,
      limit: 10,
      teams: [],
      favorites: [],
      isLoading: false,
    };
  }

  loadPlayers = (search) => {
    const app = this;
    const page = '?_page='+app.state.page;
    const limit = '&_limit='+app.state.limit;
    const query = (app.state.search) ? '&q='+app.state.search : '';

    fetch(API.players+page+limit+query)
      .then(countPages)
      .then(data => app.setState({ players: data }));

    function countPages(response){
      app.setState({ 
        totalPlayers: response.headers.get('X-Total-Count'), 
        paginate: response.headers.get('Link') 
      })
      return response.json();
    }
  }

  setPage = (page) => {
    const app = this;
    app.setState({ page : page }, app.loadPlayers);
  }

  onTextChange = (e) => {
    this.setState({
      search : e.target.value,
    },this.loadPlayers);
  }

  toggleFavorite = () => {
    fetch(API.favorites)
      .then(response => response.json())
      .then(data => this.setState({ favorites: data, isLoading: false  }));
  }
  render() {
    const app = this;
    const { search, players, favorites, teams, isLoading } = app.state;

    let listPlayers = players.map(playersCard);
    function playersCard(player){
      const team = teams.find(matchTeamById);

      function matchTeamById(team){
        return team.id === player.team;
      }

      let isFavorite = false;
      const favorite = favorites.findIndex(f => f.player == player.id)
      if( favorite >= 0 ){
        isFavorite = favorites[favorite].checked ;
      }
      console.log(isFavorite)

      if(typeof(team) == 'object')
        player.team = team;

      const toggleReadonly = app.handleOpenModal;
      return <Card isFavorite={isFavorite} {...player} teams={teams} toggleReadonly={toggleReadonly} toggleFavorite={app.toggleFavorite}/>;
    }

    if (isLoading) {
      return <p>Loading ...</p>;
    }
     const classes= {
       title : {
         width: '200px'
       
       },
       search : {
         marginLeft: '20px',
         width: '60%'
       },
       inputRoot : {
         color: 'white',
         paddingLeft: '25px'
       },
       inputInput: {
         color: 'white'
       },
        searchIcon: {
          width: '25px',
          height: '50%',
          position: 'absolute',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
     };

    return (
      <div style={{ ...styles.container, ...app.props.style }}>
      <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={classes.title}>
              NBA Interview
            </Typography>
              <div style={classes.search}>
                <div style={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  style={classes.inputRoot}
                  onChange={app.onTextChange}
                  inputProps={{ 'aria-label': 'Search' }}
                />
              </div>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <Pagination setPage={app.setPage} page={app.state.page} total={app.state.totalPlayers} limit={app.state.limit}/>
                <IconButton aria-label="Show 4 new mails" color="inherit">
                  <Badge badgeContent={favorites.length} color="secondary">
                    <HeartIcon />
                  </Badge>
                </IconButton>

              </div>
          </Toolbar>
        </AppBar>
        <div style={styles.title}></div>
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
