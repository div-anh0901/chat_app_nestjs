import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { removeAttachment } from "../../store/message-panel/MessagePanelSlice";
import { MessageAttachmentStyle, MessageAttachmentContainerStyle } from "../../utils/styles";
import { Attachment } from "../../utils/types";
import { MessageImageCanvas } from "./MessageImageCanvas";
import { RiDeleteBin6Fill } from 'react-icons/ri';


export const MessageAttachmentContainer = () => {
    const { attachments} = useSelector((state: RootState) => state.messagePanel);
    const dispatch = useDispatch<AppDispatch>();

    const onDeleteAttachment = (attachments: Attachment) => {
        dispatch(removeAttachment(attachments));
    }

    return (
        <MessageAttachmentContainerStyle>
            {
                attachments.map((att) => (
                    <MessageAttachmentStyle
                        key={att.id}
                        style={{
                            display: 'flex',
                            alignItems:'center' 
                        }}
                    >
                        <MessageImageCanvas file={att.file} />
                        <RiDeleteBin6Fill
                            color="red"
                            style={{ position: 'absolute', zIndex: 1, right: 15, top: 10 }}
                            size={30}
                            onClick={() => onDeleteAttachment(att)}
                        />
                        <div>{att.file.name}</div>
                    </MessageAttachmentStyle>
                ))
            }
        </MessageAttachmentContainerStyle>
    )
}