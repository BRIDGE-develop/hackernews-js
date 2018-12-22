import React from 'react';
import axios from 'axios';
// import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
//const PATH_BASE = 'https://hn.foo.bar.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

//ES5
//const url_es5 = PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY;

//ES6
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;
console.log(url);

// const list = [
//   {
//     title: 'React',
//     url: 'https://reactjs.org/',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: 'Redux',
//     url: 'https://github.com/reactjs/redux',
//     author: 'Dan Abramov, Andrew Clark',
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   },
//   {
//     title: 'Java',
//     url: 'https://github.com/reactjs/redux',
//     author: 'Java Abramov, Andrew sss',
//     num_comments: 2,
//     points: 5,
//     objectID: 2,
//   },
// ];

// function isSearched(searchTerm){
//   return function(item){
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// ↓↓↓arrowfunc
// const isSearched = searchTerm => item => {
//   //console.log('isSearched' + item.title);
//   return item.title.toLowerCase().includes(searchTerm.toLowerCase())
// }

 // class Search extends React.Component {
 //   render() {
 //     const {value, onChange, children} = this.props;
 //     return (
 //       <form>
 //         {children}
 //         <input 
 //           type = "text" 
 //           value={value}
 //           onChange = {onChange}
 //           />
 //       </form>
 //     );
 //   }
 // }
// function Search({value, onChange, children}) {
//   //const {value, onChange, children} = props;
//   return (
//     <form>
//       {children}&nbsp;
//       <input 
//         type = "text" 
//         value={value}
//         onChange = {onChange}/>
//     </form>
//   )
// }
 const Search = ({ value, onChange, onSubmit, children }) => 
 <form onSubmit={onSubmit}>
   <input 
     type = "text" 
     value={value}
     onChange = {onChange}
     />
   <button type = "submit">
    {children}
   </button> 
 </form>
 
 const Button = ({onClick, className = '', children}) =>
   <button
     onClick={onClick}
     className={className}
     type="button"
     >
   {children}
 </button>

// class Button extends React.Component {
//   render() {
//     const {
//       onClick,
//       className = '',
//       children,
//     } = this.props;
    
//     return (
//       <button
//         onClick={onClick}
//         className={className}
//         type="button"
//         >
//         {children}
//       </button>
//     );
//   }
// }

const largeColumn = {width: '40%',};
const midColumn = {width: '30%',};
const smallColumn = {width: '10%',};

 const Table = ({list, onDismiss}) => 
   <div className = "table">
   {/* map() 메서드 앞에 filter() 메서드를 같이 사용하는 것이 일반적입니다. */}
   {list.map(item => {
     return (
       <div key = {item.objectID} className = "table-row">
         <span style={largeColumn}><a href={item.url}>{item.title}</a></span>
         <span style={midColumn}>{item.author}</span>
         <span style={smallColumn}>{item.num_comments}</span>
         <span style={smallColumn}>{item.points}</span>
         <span style={smallColumn}>
           <Button onClick={() => onDismiss(item.objectID)}
             className="button-inline">
             Dismiss
           </Button>
         </span>
       </div>
     )}
   )}
 </div>
 
// class Table extends React.Component{
//   render(){
//     const {list, pattern, onDismiss} = this.props;
    
//     return (
//       <div>
//         {/* map() 메서드 앞에 filter() 메서드를 같이 사용하는 것이 일반적입니다. */}
//         {list.filter(isSearched(pattern)).map(item => {
//           return (
//             <div key = {item.objectID}>
//               <span><a href={item.url}>{item.title}</a></span>
//               <span>{item.author}</span>
//               <span>{item.num_comments}</span>
//               <span>{item.points}</span>
//               <span>
//                 <Button onClick={() => onDismiss(item.objectID)}>
//                   Dismiss
//                 </Button>
//                 {/* 
//                 <button onClick={() => onDismiss(item.objectID)}>
//                   dismiss
//                 </button>
//                 */}
//                 {/* 
//                 <button onClick={this.onClickMe}>
//                   Click Me 
//                 </button>
//                 */}
//               </span>
//             </div>
//           )}
//         )}
//       </div>
//     );
//   }
// }
class App extends React.Component {
  
  _isMounted = false;
  constructor(props){

    super(props);
    
    this.state = {
      //list : list,
      //list,
      results : null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null
    }
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  onSearchSubmit(event) {
    
    const { searchTerm } = this.state;

    this.setState({ searchKey : searchTerm});

    if(this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    //검색 버튼을 클릭하면 브라우저가 새로고침 되는데 
    //이는 HTML 폼 전송 콜백에 대한 네이티브 브라우저 동작입니다. 
    //리액트에서는 네이티브 브라우저 동작을 방지하기 위해 preventDefault() 이벤트 메서드를 자주 사용합니다.
    event.preventDefault();
    //event.stopPropagation();
    //event.nativeEvent.stopImmediatePropagation();
  }

  setSearchTopStories(result){
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    
    const oldHits = results && results[searchKey]
    ? result[searchKey].hits
    : [];

    // const oldHits = page !== 0
    // ? this.state.result.hits: [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];
    
    this.setState({ 
      //result : { hits: updatedHits, page}
      results: {
        ...results,
        [searchKey] : { hits: updatedHits, page}
      }
    
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    console.log(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    // fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    // .then(response => response.json())
    // .then(result => this.setSearchTopStories(result))
    // .catch(error => this.setState({ error }));
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    //.then(response => response.json())
    // .then(result => this.setSearchTopStories(result.data))
    // .catch(error => this.setState({ error }));
    .then(result => this._isMounted && this.setSearchTopStories(result.data))
    .catch(error => this._isMounted && this.setState({ error }));
  }

  //componentDidMount() 메서드는 컴포넌트가 마운트 될 때 한 번만 호출됩니다. 
  //일반적으로 이 메서드에서 비동기 API를 사용합니다. 
  //응답받은 외부 데이터는 내부 컴포넌트 상태에 저장되어 컴포넌트가 업데이트 되면 render() 메서드가 실행됩니다.
  componentDidMount() {
    this._isMounted = true;

    const { searchTerm } = this.state;

    this.setState({searchKey : searchTerm});
    this.fetchSearchTopStories(searchTerm);
    // fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    // .then(response => response.json())
    // .then(result => this.setSearchTopStories(result))
    // .catch(error => error);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onSearchChange(event){
    console.log('onSearchChange');
    this.setState({ searchTerm : event.target.value})
  }
  
  onDismiss(id){

    const { searchKey, results } = this.state;
    const {hits, page } = results[searchKey];
    console.log(id);
    // function isNotId(item){
    //   return item.objectID !== id;
    // }
    const isNotId = item => item.objectID !== id;
    //const updatedList = this.state.result.hits.filter(isNotId);
    const updatedHits = hits.filter(isNotId);
    //this.setState({ list: updatedList });
    this.setState({ 
      //result: Object.assign({}, this.state.result, { hits: updatedHits })
      results: {
        ...results,
        [searchKey] : {hits: updatedHits, page }
      }
     });
  }

  render() {
    const {
      searchTerm, 
      results,
      searchKey,
      error
    } = this.state;

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
    if(!results) { return null; }

    return (
      <div className = "page">
        <div className = "interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
            >
            Search
          </Search>
        </div>

        { error
          ? <div className="interactions">SDFDSFSD
            <p>Something went wrong.</p>
          </div>
          : <Table
            list={list}
            onDismiss={this.onDismiss}
          />
        }
        
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}


export default App;
