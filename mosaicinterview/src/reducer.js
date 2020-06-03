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

const actionCreators = {
  initiateFetch: () => ({ type: actionTypes.initiateFetch }),
  receiveData: (data) => ({ type: actionTypes.receiveData, data: data }),
  receiveError: () => ({ type: actionTypes.receiveError }),
  fetchNews: url => dispatch => {
    dispatch(actionCreators.initiateFetch());
    fetch(url).then(res => res.json())
    .then(data => {
      dispatch(actionCreators.receiveData(data || []));
    })
    .catch(error => {
      dispatch(actionCreators.receiveError());
    })
  }
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
        ...state,
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