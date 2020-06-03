const initialState = {
  isLoading: true,
  hasError: false,
  articles: {},
}

const actionTypes = {
  initiateFetch: "INIT_FETCH",
  receiveData: "FETCH_SUCCESS",
  receiveError: "FETCH_ERROR",
  reorderArticles: "SET_ARTICLES"

}

const initiateFetch = () => ({ type: actionTypes.initiateFetch });
const receiveData = (articles) => ({ type: actionTypes.receiveData, articles: articles });
const receiveError = () => ({ type: actionTypes.receiveError });
const reorderArticles = (articles) => ({ type: actionTypes.reorderArticles, articles: articles });

const fetchNews = url => dispatch => {
  dispatch(initiateFetch());
  fetch(url).then(res => res.json())
  .then(data => {
    dispatch(receiveData(data.articles || []));
  })
  .catch(error => {
    console.log('fetchError');
    dispatch(receiveError());
  })
}

const actionCreators = {
  initiateFetch,
  receiveData,
  receiveError,
  fetchNews,
  reorderArticles
}

function reducer(state, action) {
  // console.log('action received', action)
  switch(action.type) {
    case actionTypes.initiateFetch: {
      return {
        ...state,
        isLoading: true,
        hasError: false,
        articles: {}
      }
    }
    case actionTypes.receiveData: {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        articles: action.articles
      }
    }
    case actionTypes.reorderArticles: {
      return {
        ...state,
        articles: action.articles,
      }
    }
    case actionTypes.receiveError : {
      console.log('An error happened!'); // TODO: handle errors better
      return {
        articles: {},
        isLoading: false,
        hasError: true,
      }
    }
    default: {
      return state;
    }
  }
}

export {
  reducer,
  actionTypes,
  actionCreators,
  initialState
}