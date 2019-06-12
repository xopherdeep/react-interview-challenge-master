import React, { Component } from "react";
import IconButton from '@material-ui/core/IconButton';
import FastForward from '@material-ui/icons/FastForward';
import FastRewind from '@material-ui/icons/FastRewind';
import Back from '@material-ui/icons/KeyboardArrowLeft';
import Forward from '@material-ui/icons/KeyboardArrowRight';
import './_pagination.css';

class Pagination extends Component {
  state = {
    page : 0,
    first: 0,
    prev : 0,
    next : 0,
    last : 0,
    total: 0,
    limit: 0
  }
  setPage = (currentPage) => {
    currentPage = currentPage ? currentPage : 1;
    const page = this;
    page.setState({
      page: currentPage,
      prev: currentPage-1,
      next: currentPage+1,
      last: Math.ceil(page.props.total / page.props.limit)
    },() => {
      page.props.setPage(currentPage) 
    });
  }
  clickFirst = () =>{
    const page = this;
    page.setPage(page.state.first);
  }
  clickPrev = () =>{
    const page = this;
    page.setPage(page.state.prev);
  }
  clickNext= () =>{
    const page = this;
    page.setPage(page.state.next);
  }
  clickLast= () =>{
    const page = this;
    page.setPage(page.state.last);
  }
  componentDidMount(){
    const page = this;
    page.setPage(page.props.page);
  }
  render(){
    const page = this;
    return ( 
      <div className="pagination-container">
        <IconButton  aria-label="First"
          color="inherit"
          onClick={page.clickFirst} 
          disabled={page.props.page <= 1}
        >
          <FastRewind />
        </IconButton>
        <IconButton aria-label="Prev"
          color="inherit"
          onClick={page.clickPrev} 
          disabled={page.props.page <= 1}
        >
          <Back />
        </IconButton>
        {page.props.page}
        <IconButton aria-label="Next"
          color="inherit"
          onClick={page.clickNext} 
          disabled={page.props.page >= page.state.last}  
        >
          <Forward />
        </IconButton>
        <IconButton aria-label="Last"
          color="inherit"
          onClick={page.clickLast} 
          disabled={page.props.page === page.state.last} 
        >
          <FastForward />
        </IconButton>
      </div>
    );
  }
}

export default Pagination;
