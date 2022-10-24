import { Provider } from 'react-redux';

import './App.css';
import store from './store';
import CommentContainer from './ui/CommentContainer';

function App() {
  return (
    <div className='app'>
      <h1>Comment Widget</h1>
      <Provider store={store}>
        <CommentContainer />
      </Provider>
    </div>
  );
}

export default App;
