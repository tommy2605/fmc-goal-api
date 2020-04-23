import React, {useState} from 'react';
import GoalEditor from './components/GoalEditor';

const App = () => {

  return (
    <div 
      style={{
        padding: '30px'
      }}>
      <div 
        style={{
          width: '600px',
          height: '500px',
          padding: '20px',
          backgroundColor: '#f5f5f5'
        }}>
        <GoalEditor 
        />
      </div>
    </div>)
}

export default App;
