import React, { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../provider/SocketProvider';
import { usePeer } from '../provider/PeerProvider';
import ReactPlayer from 'react-player';

const Room = () => {
  const socket = useSocket();
  const { peer, createOffer, createAns, setAns, sendStream, stream, setStream } = usePeer();
  const [incomingStream, setIncomingStream] = useState(null);
  const [email, setEmail] = useState(localStorage.getItem('emailId'));
  const [emailYours, setEmailYours] = useState("");

  async function userJoinedHandler({ emailId }) {
    console.log(emailId, "joined");
    const offer = await createOffer();
    socket.emit("incoming-call", { emailId, offer });
    setEmailYours(emailId);
  }

  // Handler: Incoming call
  async function incomingCallHandler({ emailId, offer }) {
    console.log(emailId, "Incoming call with offer:", offer);
    const ans = await createAns(offer);
    socket.emit('ans-call', { emailId, ans });
    setEmailYours(emailId);
  }

 
  async function handleAns({ emailId, ans }) {
    console.log(emailId, "Answer received:", ans);
    await setAns(ans);
  }

  
  async function streamer() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setIncomingStream(stream);
      sendStream(stream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }

  useEffect(() => {
    streamer();
    peer.ontrack = (e) => {
      setIncomingStream(e.streams[0]);
    };

    return () => {
      peer.ontrack = null;
    };
  }, [peer]);

  const negotiationneededHandle = useCallback(async () => {
    const offer = await createOffer();
    socket.emit('incoming-call', { emailId: emailYours, offer });
  }, [createOffer, emailYours, socket]);

  useEffect(() => {
    socket.on('user-joined', userJoinedHandler);
    socket.on('incoming-call', incomingCallHandler);
    socket.on('ans-call', handleAns);
    peer.addEventListener('negotiationneeded', negotiationneededHandle);

    return () => {
      socket.off('user-joined', userJoinedHandler);
      socket.off('incoming-call', incomingCallHandler);
      socket.off('ans-call', handleAns);
      peer.removeEventListener('negotiationneeded', negotiationneededHandle);
    };
  }, [socket, peer, negotiationneededHandle]);

  return (
    <div className='w-full h-screen text-white bg-zinc-800'>
      <h2>{email}</h2>
      <h3>You are connected to {emailYours}</h3>
      <button className='bg-green-500' onClick={() => sendStream(incomingStream)}>Join Now</button>
      <div className='flex justify-between'>
        <ReactPlayer url={incomingStream} playing  />
        <ReactPlayer url={stream} playing  />
      </div>
    </div>
  );
};

export default Room;
