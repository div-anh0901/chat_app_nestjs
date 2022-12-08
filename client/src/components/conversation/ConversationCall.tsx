import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { ConversationCallContainer } from "../../utils/styles";


export const ConversationCall = () => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const { localSream,remoteStream} = useSelector((state: RootState) => state.call);
    const dispatch = useDispatch();

    useEffect(() => {
        if (localVideoRef.current && localSream) {
            localVideoRef.current.srcObject = localSream;
            localVideoRef.current.play();
        }
    }, [localVideoRef]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play()
        }
    }, [remoteVideoRef]);


    return (
        <ConversationCallContainer>
            <div>
                <div>
                    <span>You</span>
                </div>
                <video width={400} height={400} ref={localVideoRef} />
            </div>
            <div>
                <div>
                    <span>Recipient</span>
                </div>
                <video ref={remoteVideoRef} width={400} height={400} />
            </div>
        </ConversationCallContainer>
    )



}