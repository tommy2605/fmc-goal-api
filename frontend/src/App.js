import React from 'react';
import GoalEditor from './components/GoalEditor';
import axios from 'axios'
import path from 'path'

const publish = async item => {
  console.log(item)
  console.log(process.env.REACT_APP_API)
  try {
    await axios.post(process.env.REACT_APP_API + 'api/goals', item)
    alert('published')
  } catch {
    alert('not published')
  }

}

const App = () => {

  return (
    <div 
      style={{
        padding: '30px'
      }}>
      <div 
        style={{
          width: '900px',
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
          
          onPublish={item => publish(item)}
        />
      </div>
    </div>)
}

export default App;
