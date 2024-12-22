import React, { useEffect, useState } from 'react'
import { useSocket } from '../provider/SocketProvider'
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const [emailId, setemail] = useState("");
  const [roomId, setroom] = useState("")
  const navigate = useNavigate();
  const socket = useSocket();



  useEffect(() => {
    socket.on('joined-room', ({ roomId }) => {
      navigate(`room/${roomId}`)
    })
  }, [socket])

  const handelr = (evt) => {
    evt.preventDefault();
    localStorage.setItem('emailId', emailId)
    socket.emit('join-room' , {emailId , roomId})
  }

  return (
    <div className='w-full h-screen bg-zinc-800 '>
      <form
      onSubmit={handelr}
      >

        <input type='email'
        required 
        value={emailId} 
        onChange={(evt) => { setemail(evt.target.value) }} 
        className='m-2 p-2 rounded-md' 
        placeholder='enter email' />

        <input type='input'
        required
         value={roomId} 
         onChange={(evt) => { setroom(evt.target.value) }} 
         className='m-2 p-2  rounded-md' placeholder='enter room code' />

        <button 
          type='submit'
         className='p-2  rounded-md bg-green-400'>Enter room</button>
      </form>
    </div>
  )
}

export default Home