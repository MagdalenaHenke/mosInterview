const initialState = {
  isLoading: true,
  hasError: false,
  data: {},
}

const actionTypes = {
  initiateFetch: "INIT_FETCH",
  receiveData: "FETCH_SUCCESS",
  receiveError: "FETCH_ERROR"
}

const initiateFetch = () => ({ type: actionTypes.initiateFetch });
const receiveData = (data) => ({ type: actionTypes.receiveData, data: data });
const receiveError = () => ({ type: actionTypes.receiveError });
const fetchNews = url => dispatch => {
  dispatch(initiateFetch());
  fetch(url).then(res => res.json())
  .then(data => {
    dispatch(receiveData(data || []));
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
  fetchNews
}

function reducer(state, action) {
  // console.log('action received', action)
  switch(action.type) {
    case actionTypes.initiateFetch: {
      return {
        ...state,
        isLoading: true,
        hasError: false,
        data: {}
      }
    }
    case actionTypes.receiveData: {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        data: action.data
      }
    }
    case actionTypes.receiveError : {
      console.log('An error happened!'); // TODO: handle errors better
      return {
        data: {},
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