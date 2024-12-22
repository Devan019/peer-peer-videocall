import { createContext, useContext, useMemo , useEffect , useState } from "react";

const PeerContext = createContext();

export function usePeer() {
    return useContext(PeerContext);
}

const PeerProvider = ({ children }) => {
    const [stream, setstream] = useState("")
    const peer = useMemo(() => {
        return new RTCPeerConnection({
            iceServers: [{
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.com:3478"
                ]
            }]
        })
    }, [])

    const createOffer = async() => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer
    }

    const createAns = async(offer) => {
        await peer.setRemoteDescription(offer)
        const ansDec = await peer.createAnswer()
        await peer.setLocalDescription(ansDec)
        return ansDec
    }

    const setAns = async(ans) => {
        await peer.setRemoteDescription(ans)
    }


    const sendStream = (stream) => {
        const streams =  stream.getTracks();
        streams.forEach(st => {
            peer.addTrack(st , stream);
        });
        
    }

    const handleStream = (evt) => {
        setstream(evt.streams[0])
    }

    useEffect(()=>{
        peer.addEventListener('track' , handleStream);

        return () => {
            peer.removeEventListener('track' , handleStream)
        }
    } , [peer])

    return (
        <PeerContext.Provider value={{peer , createOffer , createAns , setAns , sendStream , stream , setstream}}>
            {children}
        </PeerContext.Provider>
    )
}

export default PeerProvider