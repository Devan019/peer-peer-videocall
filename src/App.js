import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom'
import { SocketProvider } from './provider/SocketProvider';
import Room from './pages/Room';
import PeerProvider from './provider/PeerProvider';

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/room/:roomId' element={<Room />} />
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
