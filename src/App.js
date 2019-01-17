import React, { Component } from 'react';
// 3.9 start
import axios from 'axios';
// 3.9 end
import './App.css';
// 4.5 start
// import PropTypes from 'prop-types';
// 4.5 end
import { sortBy } from 'lodash';
import classNames from 'classnames';

const DEFAULT_QUERY = 'redux';
//3.6
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
//3.6
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

// 5.2
// const Loading = () => <div>Loading ...</div>

// 3.5
// const isSearched = searchTerm => item =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

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
      // 5.2
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);

    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);

    //3.7 start
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    //3.7 end

    this.onSort = this.onSort.bind(this);
  }

  //3.7 start
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }
  //3.7 end

  // fetchSearchTopStories(searchTerm) {
  fetchSearchTopStories(searchTerm, page = 0) {
    // 5.2 start
    this.setState({ isLoading: true });
    // 5.2 end
    // fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    // fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    // .then(response => response.json())
    // .then(result => this.setSearchTopStories(result))
    // 3.9 start
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(result => this._isMounted && this.setSearchTopStories(result.data))
    .catch(error => this._isMounted && this.setState({ error }));
    // 3.9 end
    // 3.8 start
    // .catch(error => error);
    // .catch(error => this.setState({ error }));
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
        [searchKey]: { hits: updatedHits, page },
        // 3.7 end
        // 5.2
        isLoading: false
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

  componentWillUnmount() {
    this._isMounted = false;
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

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
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
      error,
      //3.8 end
      // 5.2
      sortKey,
      isSortReverse,
      isLoading
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
            sortKey={sortKey}
            isSortReverse={isSortReverse}
            onSort={this.onSort}
            // pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
          // : null
        }
        {/* 3.6 */}
        <div className="interactions">
          {/* 3.7 start */}
          {/* 5.2 start */}
          {/* <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}> */}
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
          {/* 5.2 end */}
        </div>
      </div>
    );
  }
}

// 5.1 start
// ES6 클래스 컴포넌트
// class Search extends Component {
//   componentDidMount() {
//     this.input.focus();
//   }

//   render() {
//     const {
//       value,
//       onChange,
//       onSubmit,
//       children
//     } = this.props;
//     return (
//       <form onSubmit={onSubmit}>
//         <input
//           type="text"
//           value={value}
//           onChange={onChange}
//           ref={(node) => { this.input = node; }}
//         />
//         <button type="submit">
//           {children}
//         </button>
//       </form>
//     );
//   }
// }

// 함수형 비 상태 컴포넌트(this 객체가 없음)의 경우 이렇게 ↓
// const Search = ({
//   value,
//   onChange,
//   onSubmit,
//   children
// }) => {
//   let input;
//   return (
//     <form onSubmit={onSubmit}>
//       <input
//         type="text"
//         value={value}
//         onChange={onChange}
//         ref={(node) => input = node}
//       />
//     <button type="submit">
//       {children}
//     </button>
//   </form>
//   );
// }

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
// 5.1 end

const Table = ({
  list,
  sortKey,
  isSortReverse,
  onSort,
  onDismiss
}) => {
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse
    ? sortedList.reverse()
    : sortedList;

  return(
    <div className="table">
      <div className="table-header">
        <span style={{ width: '40%' }}>
          <Sort
            sortKey={'TITLE'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
            Title
          </Sort>
        </span>
        <span style={{ width: '30%' }}>
          <Sort
            sortKey={'AUTHOR'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
            Author
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          <Sort
            sortKey={'COMMENTS'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
            Comments
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          <Sort
            sortKey={'POINTS'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
            Points
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          Archive
        </span>
      </div>
      {reverseSortedList.map(item =>
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
  );
}

const Sort = ({
  sortKey,
  activeSortKey,
  onSort,
  children
}) => {
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );

  return (
    <Button
      onClick={() => onSort(sortKey)}
      className={sortClass}
    >
      {children}
    </Button>
  );
}

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

const Loading = () =>
<div>Loading ...</div>

const withLoading = (Component) => ({ isLoading, ...rest }) =>
isLoading
  ? <Loading />
  : <Component { ...rest } />

const ButtonWithLoading = withLoading(Button);

// Button.propTypes = {
//   onClick: PropTypes.func,
//   className: PropTypes.string,
//   children: PropTypes.node,
// };

// Button.defaultProps = {
//   className: '',
// };

// Table.propTypes = {
//   list: PropTypes.array.isRequired,
//   onDismiss: PropTypes.func.isRequired,
// };

// Table.propTypes = {
//   list: PropTypes.arrayOf(
//   PropTypes.shape({
//   objectID: PropTypes.string.isRequired,
//   author: PropTypes.string,
//   url: PropTypes.string,
//   num_comments: PropTypes.number,
//   points: PropTypes.number,
//   })
//   ).isRequired,
//   onDismiss: PropTypes.func.isRequired,
// };



export default App;

//4.3 Start
export {
  Button,
  Search,
  Table,
};
//4.3 End