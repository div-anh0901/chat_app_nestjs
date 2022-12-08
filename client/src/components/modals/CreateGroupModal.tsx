import React,{FC, Dispatch,SetStateAction,createRef,useEffect,useState} from 'react';
import { ModalContainer, ModalContentBody, ModalHeader } from '.';
import { OverlayStyle } from '../../utils/styles';
import { ConversationType } from '../../utils/types';
import { MdClose } from 'react-icons/md';
import { CreateGroupForm } from '../forms/CreateGroupForm';

type Props = {
    setShowModal: Dispatch<SetStateAction<boolean>>
}

export const CreateGroupModal: FC<Props> = ({ setShowModal }) => {
    const ref = createRef<HTMLDivElement>();
    const [type, setType] = useState<ConversationType>();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.key === 'Escape' && setShowModal(false);
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { current } = ref;
        if (current === e.target) {
            setShowModal(false);
        }


    }

    return (
        <OverlayStyle ref={ref} onClick={handleOverlayClick}>
            <ModalContainer>
                <ModalHeader>
                    <h2>Create Group</h2>
                    <MdClose size={32} onClick={ ()=>setShowModal(false)} />
                </ModalHeader>
                <ModalContentBody>
                    <CreateGroupForm setShowModal={setShowModal}/>
                </ModalContentBody>
            </ModalContainer>
        </OverlayStyle>
    )


}