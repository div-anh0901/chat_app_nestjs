import { Conversation } from "../../utils/types"
import { FC, useContext } from 'react';
import { AuthContext } from "../../utils/context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { getRecipientFromConversation } from "../../utils/helpers";
import { ConversationSidebarItemDetails, ConversationSidebarItemStyle } from "../../utils/styles";
import styles from './index.module.scss';
type Props = {
    conversation:Conversation
}

export const ConversationSideBarItem: FC<Props> = ({ conversation }) => {
    
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const recipient = getRecipientFromConversation(conversation, user);
    const MESSAGE_LENGTH_MAX = 20;

    const lastMessageContent = () => {
        const {lastMessageSent} = conversation;
        if (lastMessageSent) {
            return lastMessageSent.content.length >= MESSAGE_LENGTH_MAX ? lastMessageSent.content.slice(0, MESSAGE_LENGTH_MAX).concat('...') : lastMessageSent.content
        }
        return null
    }
    return (
        <>
            <ConversationSidebarItemStyle
                onClick={() => navigate(`/conversations/${conversation.id}`)}
                selected={parseInt(id!) === conversation.id}
            >
                <div className={styles.conversationAvatar}></div>
                <ConversationSidebarItemDetails>
                    <span className="conversationName">
                        {`${recipient?.firstName} ${recipient?.lastName}`}
                    </span>
                    <span className="conversationLastMessage">
                        {lastMessageContent()}
                    </span>
                </ConversationSidebarItemDetails>
            </ConversationSidebarItemStyle>
        </>
    );
}