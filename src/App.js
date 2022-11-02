import { useSelector } from 'react-redux';

import './App.css';
import { CommentContainer } from './ui/comment';

function App() {
  const showLoader = useSelector((state) => state.modal.loader);

  return (
    <div className='app'>
      <h1>Comment Widget</h1>
      <CommentContainer />
      {showLoader && <div className='loader'>loading</div>}
    </div>
  );
}

export default App;
