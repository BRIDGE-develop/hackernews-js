import React, { Component } from 'react';
// 3.9 start
import axios from 'axios';
// 3.9 end
import './App.css';
// 4.3 start
import fetch from 'isomorphic-fetch';
// 4.3 end

const DEFAULT_QUERY = 'redux';
//3.6
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
//3.6
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

// 3.5
// const isSearched = searchTerm => item =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  // 3.9 start
  _isMounted = false;
  // 3.9 end

  constructor(props) {
    super(props);

    this.state = {
      // 3.7 start
      // result: null,
      results: null,
      searchKey: '',
      error: null,
      // 3.7 end
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);

    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);

    //3.7 start
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    //3.7 end
  }

  //3.7 start
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }
  //3.7 end

  // fetchSearchTopStories(searchTerm) {
  fetchSearchTopStories(searchTerm, page = 0) {
    // fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    // fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    // 3.8 start
    // .catch(error => error);
    // 3.9 start
    // .catch(error => this.setState({ error }));
    .catch(error => this._isMounted && this.setState({ error }));
    // 3.9 end
    // 3.8 end
  }

  setSearchTopStories(result) {
    // 3.6 start
    const { hits, page } = result;
    // 3.7 start
    const { searchKey, results } = this.state;
    
    // const oldHits = page !== 0
    // ? this.state.result.hits
    // : [];
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    // 3.7 end

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      // 3.7 start
        results: { 
        // hits: updatedHits, page 
        ...results,
        [searchKey]: { hits: updatedHits, page }
        // 3.7 end
      }
    });
    // this.setState({ result });
    // 3.6 end
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    // 3.7 start
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    // 3.7 end
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  componentDidMount() {
    // 3.9 start
    this._isMounted = true;
    // 3.9 end
    const { searchTerm } = this.state;

    // 3.5
    // fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    //   .then(response => response.json())
    //   .then(result => this.setSearchTopStories(result))
    //   .catch(error => error);
    // 3.7 start
    this.setState({ searchKey: searchTerm });
    // 3.7 end
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onDismiss(id) {
    // 3.7 start
    // const isNotId = item => item.objectID !== id;
    // const updatedHits = this.state.result.hits.filter(isNotId);

    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    // 3.7 end

    this.setState({ 
      // 3.5
      //list: updatedList 
      // result: Object.assign({}, { hits: updatedHits })
      // 3.7 start
      // result: Object.assign({}, this.state.result, { hits: updatedHits })
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
      // 3.7 end
      // 3.5
      // result: { ...this.state.result, hits: updatedHits }
    });
  }

  render() {
    const { 
      searchTerm, 
      //3.7 start
      // result,
      results,
      searchKey,
      //3.7 end
      //3.8 start
      error
      //3.8 end
    } = this.state;
    // 3.6
    // 3.7 start
    // const page = (result && result.page) || 0;
    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
      ) || [];

    // 3.7 end
    if (error) {
      return <p>Something went wrong.</p>;
    }
    // 3.2
    // if (!result) { return null; }

    //3.8 start

    //3.8 end

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {/* 3.4 */}
        {/* { result
          ? <Table */}
        { results &&
          <Table
            // 3.7 start
            // list={result.hits}
            list={list}
            // 3.7 end
            // pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
          // : null
        }
        {/* 3.6 */}
        <div className="interactions">
          {/* 3.7 start */}
          {/* <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}> */}
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
          {/* 3.7 end */}
          More
          </Button>
        </div>
      </div>
    );
  }
}

const Search = ({ 
  value, 
  onChange,
  onSubmit, 
  children 
}) =>
  <form onSubmit={onSubmit}>
    {/* 3.5 */}
    {/* {children} <input */}
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

const Table = ({ list, onDismiss }) =>
  <div className="table">
    {/* 3.5 */}
    {/* {list.filter(isSearched(pattern)).map(item => */}
    {list.map(item =>
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>
          {item.author}
        </span>
        <span style={{ width: '10%' }}>
          {item.num_comments}
        </span>
        <span style={{ width: '10%' }}>
          {item.points}
        </span>
        <span style={{ width: '10%' }}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>

const Button = ({
  onClick,
  className = '',
  children,
}) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

export default App;

//4.3 Start
export {
  Button,
  Search,
  Table,
};
//4.3 End