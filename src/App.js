import React, {useEffect, useState} from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from "pusher-js";
import axios from "axios";

function App() {

  const[messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('messages/sync')
    .then(response => { 
      setMessages(response.data);
    })
  },[])

  useEffect(() => {
    const pusher = new Pusher('b5b078e6aa104ea1c0ff', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessages) => {
      //alert(JSON.stringify(newMessages));
      setMessages([...messages,newMessages])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }

  }, [messages]);

  return (
    <div className="App">
        <div className="app__body">
          <Sidebar />
          <Chat messages= {messages}/>
        </div>
    </div>
  );
}

export default App;
