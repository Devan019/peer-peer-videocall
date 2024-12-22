import { createContext, useContext, useMemo } from 'react'

import {io} from 'socket.io-client'

const SocketContext = createContext();

export const useSocket = ()=>{
    return useContext(SocketContext)
}

export const SocketProvider = ({children}) => {
    const socketio = useMemo(()=>{
       return io('https://omegal-backend-4j09.onrender.com')
    } , [])
  return (
    <SocketContext.Provider value={socketio}>
        {children}
    </SocketContext.Provider>
  )
}

