import React, { Component } from "react";

import Pagination from "./Pagination";
import CardList from "./CardList";
import styles from "./styles";
import "./_style.css";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import HeartIcon from '@material-ui/icons/Favorite';

const API = {
  players : 'http://localhost:3008/players',
  teams : 'http://localhost:3008/teams',
  favorites: 'http://localhost:3008/favorites'
};

class Main extends Component {
  constructor(props) {
    super(props);
    const app = this;

    app.state = {
      isLoading: false,
      favorites: [],
      teams: [],
      players : [],
      search: '',
      page: 1,
      limit: 10,
    };
  }

  render() {
    const app = this;

    if (app.isLoading) {
      return <p>Loading ...</p>;
    }

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" style={styles.title}>
              NBA Interview
            </Typography>
            <Pagination setPage={app.setPage} page={app.state.page} total={app.state.totalCount} limit={app.state.limit}/>
            <div style={styles.search}>
              <div style={styles.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                style={styles.inputRoot}
                onChange={app.setSearch}
                inputProps={{ 'aria-label': 'Search' }}
              />
            </div>
            <div style={styles.grow} />
            <div className={styles.sectionDesktop}>
              <IconButton aria-label="My Favorites" color="inherit">
                <Badge badgeContent={app.state.favorites.length} color="secondary">
                  <HeartIcon />
                </Badge>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <div style={styles.players}>
          <CardList 
            teams={app.state.teams}
            players={app.state.players}
            favorites={app.state.favorites}
            toggleFavorite={app.setFavorites} 
          /> 
        </div>
      </div>
    );
  }

  componentDidMount(){
    const app = this;
    app.loadData();
  }

  loadData = () => {
    const app = this;
    app.setState({ isLoading: true });
    app.loadTeams()
      .then(app.loadFavorites)
      .then(app.hasLoaded);
  }

  loadFavorites = () => {
    const app = this;
    return fetch(API.favorites)
      .then(response => response.json())
      .then(data => app.setState({ favorites: data }))
  };

  loadTeams = () => {
    const app = this;
    return fetch(API.teams)
      .then(response => response.json())
      .then(data => app.setState({ teams: data }))
  };

  loadPlayers = () => {
    const app = this;
    const page = '?_page='+app.state.page;
    const limit = '&_limit='+app.state.limit;
    const query = (app.state.search) ? '&q='+app.state.search : '';

    return fetch(API.players + page + limit + query)
      .then(setTotalCount)
      .then(data => app.setState({ players: data }));

    function setTotalCount(response){
      app.setState({ 
        totalCount: response.headers.get('X-Total-Count') 
      })
      return response.json();
    }
  }

  hasLoaded = () => {
    const app = this;
    app.setState({ isLoading: false  });
  }

  setPage = (page) => {
    const app = this;
    app.setState({ page : page, isLoading: true }, loadPage);
    function loadPage(){
      app.loadPlayers().then(app.hasLoaded) 
    }
  }

  setSearch = (e) => {
    const app = this;
    app.setState({
      search : e.target.value,
      page : 1
    }, app.loadPlayers);
  }

  setFavorites = () => {
    return fetch(API.favorites)
      .then(response => response.json())
      .then(data => this.setState({ favorites: data }));
  }
}

export default Main;
