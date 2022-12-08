import { GroupMessageType, MessageType } from "../../utils/types"
import { FC, useContext } from 'react';
import { AuthContext } from "../../utils/context/AuthContext";
import { MessageItemContainer } from "../../utils/styles";
import { formatRelative } from "date-fns";
type Props = {
    message: MessageType | GroupMessageType;
}

export const MessageItemHeader: FC<Props> = ({ message }) => {
    const { user } = useContext(AuthContext);
    return (
        <MessageItemContainer>
            <span
                className="authorName"
                style={{
                    color: user?.id === message.author.id ? '#989898' : '#5E8BFF',
                }}
            >
                {message.author.firstName} {message.author.lastName}

            </span>
            <span className="time" >
                {formatRelative(new Date(message.createdAt), new Date())}
            </span>
        </MessageItemContainer>
    )
}