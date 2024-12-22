import { createContext, useContext, useMemo } from 'react'

import {io} from 'socket.io-client'

const SocketContext = createContext();

export const useSocket = ()=>{
    return useContext(SocketContext)
}

export const SocketProvider = ({children}) => {
    const socketio = useMemo(()=>{
       return io('http://localhost:8001')
    } , [])
  return (
    <SocketContext.Provider value={socketio}>
        {children}
    </SocketContext.Provider>
  )
}

