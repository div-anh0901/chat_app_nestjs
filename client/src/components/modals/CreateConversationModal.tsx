import React, { createRef, useState, Dispatch, FC, useEffect } from 'react'
import { OverlayStyle } from '../../utils/styles'
import {CreateConversationForm} from '../forms/CreateConversationForm'
import { ModalContainer, ModalContentBody, ModalHeader } from './index'
import { MdClose } from 'react-icons/md';
import { ConversationTypeForm } from '../forms/ConversationTypeForm';
import { ConversationType } from '../../utils/types';

type Props = {
  setShowModal: Dispatch<React.SetStateAction<boolean>>,
}

export const CreateConversationModal: FC<Props>= ({setShowModal})=> {
  const ref = createRef<HTMLDivElement>();
  const [type, setType] = useState<ConversationType>('private');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.key === 'Escape' && setShowModal(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handOverlayClick = (e: React.MouseEvent<HTMLDivElement,MouseEvent>) => {
    const { current } = ref;
    if (current === e.target) {
      //console.log("Close Modal");
      setShowModal(false);
    }
  }
  return (
    <OverlayStyle ref={ref} onClick={(e) => {
      handOverlayClick(e)
     }}>
      <ModalContainer>
        <ModalHeader>
          <h2>
            Create a Conversation
          </h2>
          <MdClose size={36} onClick={()=>setShowModal(false)} />
        </ModalHeader>
        <ModalContentBody>
          <CreateConversationForm  setShowModal={setShowModal} />
        </ModalContentBody>
      </ModalContainer>
    </OverlayStyle>
  )
}
