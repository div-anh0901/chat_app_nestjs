import { CirclePlus, CirclePlusFill, FaceVeryHappy } from 'akar-icons';
import React, { Dispatch, FC, SetStateAction ,useState} from 'react'
import { CharacterLimit, MessageInput, MessageInputContainer } from '../../utils/styles'
import { MessageTextField } from '../inputs/MessageTextField';
import styles from './index.module.scss';
import { MessageAttachmentActionIcon } from './MessageAttachmentActionIcon';
type Props = {
  content: string,
  setContent: Dispatch<SetStateAction<string>>,
  placeholderName: String,
  sendMessage: () => void;
  sendTypingStatus:()=> void
  }

export const MessageInputField: FC<Props> = ({ content, placeholderName, setContent, sendMessage, sendTypingStatus }) => {
  
  const ICON_SIZE = 36;
  const MAX_LENGTH = 2048;
  const [isMultiLine, setIsMultiLine] = useState(false);
  const atMaxLength = content.length === MAX_LENGTH;


  return (
    <MessageInputContainer isMultiLine={isMultiLine}>
      <MessageAttachmentActionIcon/>
      <form onSubmit={sendMessage} className={styles.form} >
        {/* <MessageInput
          value={content}
          onChange={updateContent}
          onKeyDown={sendTypingStatus}
          placeholder={`Send a message to ${placeholderName}`}
        /> */}
        <MessageTextField
          message={content}
          setMessage={setContent}
          maxLength={MAX_LENGTH}
          setIsMultiLine={setIsMultiLine}
          sendTypingStatus={sendTypingStatus}
          sendMessage={sendMessage}
        />
      </form>
      <FaceVeryHappy className={styles.icon} size={ICON_SIZE} />
      {atMaxLength && (
        <CharacterLimit atMaxLength={atMaxLength} >
          {`${content.length}/${MAX_LENGTH}`}
        </CharacterLimit>
      )}
    </MessageInputContainer>
  )
}

export default MessageInputField