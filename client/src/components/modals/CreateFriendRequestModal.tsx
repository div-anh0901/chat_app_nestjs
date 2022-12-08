import React,{FC,SetStateAction,Dispatch,createRef,useEffect}from 'react'
import { MdClose } from 'react-icons/md';
import { ModalContainer, ModalContentBody, ModalHeader } from '.';
import { OverlayStyle } from '../../utils/styles';
import { SendFriendRequestFrom } from '../forms/SendFriendRequestForm';

type Props = {
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const CreateFriendRequestModal: FC<Props> = ({ setShowModal }) => {
    const ref = createRef<HTMLDivElement>();    
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { current } = ref;
        if (current === e.target) {
            setShowModal(true);
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.key === 'Escape' && setShowModal(false);
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);


    return (
        <OverlayStyle ref={ref} onClick={handleOverlayClick}>
            <ModalContainer>
                <ModalHeader>
                    <h2>Send a Friend Request</h2>
                    <MdClose size={32} onClick={()=>setShowModal(false)}/>
                </ModalHeader>
                <ModalContentBody>
                    <SendFriendRequestFrom setShowModal={setShowModal} />
                </ModalContentBody>
            </ModalContainer>
        </OverlayStyle>
    )

}