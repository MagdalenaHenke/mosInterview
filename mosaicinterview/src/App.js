import React, { useState, useEffect } from 'react';
import './App.css';

import { actionCreators } from './reducer';
import { connect } from 'react-redux';


const API_KEY = '7ffff7bc93f34291a600f8d927d1ad96'; // move this into env.json
const baseUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`

function App({ fetchNews, hasError, isLoading, data }) {
  const [url, setUrl] = useState(baseUrl);

  useEffect(() => {
    fetchNews(url);
  }, [url, fetchNews]) // hmmm, having fetchNews in Here

  console.log(data)

  return (
    <main className="App">
      <header className="App-header">
       {hasError ? <div>Some error happened</div> :
        isLoading ? <div>Loading.</div> :
         <ul>
           {
             data.articles.map(a =>
               <li key={a.publishedAt}>
                 <a href={a.url} target="_blank">{a.title}</a>
               </li>
              )
           }
         </ul>
       }
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
