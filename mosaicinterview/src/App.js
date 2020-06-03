import React, { useState, useEffect } from 'react';
import './App.css';

import { actionCreators } from './reducer';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


const API_KEY = '7ffff7bc93f34291a600f8d927d1ad96'; // move this into env.json
const baseUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
const searchBaseUrl = `https://newsapi.org/v2/everything?apiKey=${API_KEY}&pageSize=10`;

function App({ fetchNews, hasError, isLoading, articles, reorderArticles }) {
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

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const arts = reorder(
      articles,
      result.source.index,
      result.destination.index
    );


    reorderArticles(arts);
  }

  return ( // do I need provided placeholder?
    <main className="App">
      <header className="App-header">
        <div>
         {hasError ? <div>Some error happened</div> :
          isLoading ? <div>Loading.</div> :

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                       <ul>
                         {
                           articles && articles.map((a, index) => (
                             <Draggable draggableId={a.publishedAt} index={index}>
                               {

                               p => (
                                 <li
                                   key={a.publishedAt}
                                   ref={p.innerRef}
                                   {...p.draggableProps}
                                   {...p.dragHandleProps}
                                >
                                 <a href={a.url} target="_blank" rel="noopener noreferrer">{a.title}</a>
                               </li>
                               )
                               }
                             </Draggable>
                            ))
                         }
                       </ul>

                </div>
               )}
             </Droppable>
           </DragDropContext>
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
           <input
             type="number"
             min={1}
             value={page}
             onChange={evt => setPage(evt.target.value)}
            />
        </div>
      </header>
    </main>
  );
}



const mapStateToProps = state => {
  return {
    isLoading: state.isLoading,
    hasError: state.hasError,
    articles: state.articles
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchNews: url => dispatch(actionCreators.fetchNews(url)),
    reorderArticles: articles => dispatch(actionCreators.reorderArticles(articles)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
