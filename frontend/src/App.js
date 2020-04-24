import React from 'react';
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
          item={{
            id: 'this_is_owners_id',
            publishDate: new Date(2020, 2, 20),
            content: '<b>hello</b>, <i>World</i>!',
            culture: 'id',
            title: 'this is not just another title'
          }}
          
          onPublish={item => console.log(item)}
        />
      </div>
    </div>)
}

export default App;
