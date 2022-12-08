import { EditMessagePayload, MessageType } from "../../utils/types"
import React, { FC, Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useParams } from "react-router";

import { EditMessageActionsContainer, EditMessageInputField } from "../../utils/styles";
import { SetState } from "immer/dist/internal";
import { setIsEditing } from "../../store/messageContainerSlice";
import { selectType } from "../../store/selectedSlice";
import { editGroupMessageThunk } from "../../store/groupMessageSlice";
import { editMessageThunk } from "../../store/messages/messageThunk";
type Props = {
    onEditMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EditMessageContainer: FC<Props> = ({
    onEditMessageChange,
}) => {
    const { id: routeId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { messageBeingEdited } = useSelector(
        (state: RootState) => state.messageContainer
    );
    const conversationType = useSelector((state: RootState) => selectType(state));


    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!messageBeingEdited) {
            return;
        }
        const params: EditMessagePayload = {
            id: parseInt(routeId!),
            messageId: messageBeingEdited.id,
            content: messageBeingEdited.content
        };
        conversationType === 'private'
            ? dispatch(editMessageThunk(params)).finally(() =>
                dispatch(setIsEditing(false))
            )
            : dispatch(editGroupMessageThunk(params)).finally(() =>
                dispatch(setIsEditing(false))
            )

    }


    return (<div style={{ width: '100%' }}>
        <form onSubmit={onSubmit}>
            <EditMessageInputField
                value={messageBeingEdited?.content}
                onChange={onEditMessageChange}
            />
        </form>
        <EditMessageActionsContainer>
            <div>
                escape to <span>cancel</span> - enter to <span>save</span>
            </div>
        </EditMessageActionsContainer>
    </div>)
}