import React, { useState, useEffect } from 'react';
import './App.css';

import { actionCreators } from './reducer';
import { connect } from 'react-redux';


const API_KEY = '7ffff7bc93f34291a600f8d927d1ad96'; // move this into env.json
const baseUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
const searchBaseUrl = `https://newsapi.org/v2/everything?apiKey=${API_KEY}&pageSize=10`;

function App({ fetchNews, hasError, isLoading, data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [queryTerm, setQueryTerm] = useState('');
  const [page, setPage] = useState(1); // I'll be refetching more than necessary, I'll take that's ok for now

  useEffect(() => {
    fetchNews(baseUrl);
  }, [fetchNews]) // hmmm, having fetchNews in Here

  useEffect(() => {
    if (queryTerm) {
      fetchNews(`${searchBaseUrl}&q=${queryTerm}&page=${page}`);
    }
  }, [fetchNews, queryTerm, page]);

  function handleSubmit(evt) {
    evt.preventDefault();
    setPage(1); // reset pagination
    setQueryTerm(searchTerm);
  }

  return (
    <main className="App">
      <header className="App-header">
        <div>

         {hasError ? <div>Some error happened</div> :
          isLoading ? <div>Loading.</div> :
           <ul>
             { data &&
               data.articles.map(a =>
                 <li key={a.publishedAt}>
                   <a href={a.url} target="_blank" rel="noopener noreferrer">{a.title}</a>
                 </li>
                )
             }
           </ul>
         }
        </div>
        <div>
           <form onSubmit={handleSubmit}>
             <label htmlFor="searchInput">Find news about:</label>
             <input
               type="text"
               value={searchTerm}
               id="searchInput"
               onChange={e => setSearchTerm(e.target.value)}
             />
             <button type="submit">Submit</button>
           </form>
           <input type="number" value={page} onChange={evt => setPage(evt.target.value)}/>
        </div>
      </header>
    </main>
  );
}



const mapStateToProps = state => {
  return {
    isLoading: state.isLoading,
    hasError: state.hasError,
    data: state.data
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchNews: url => dispatch(actionCreators.fetchNews(url))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
