import React,{ FC,useContext} from 'react';
import { getUserContextMenuIcon, isGroupOwner } from '../../utils/helpers';
import { ContextMenu, ContextMenuItem } from '../../utils/styles';
import { UserContextMenuActionType } from '../../utils/types';
import { Crown, Icon, Person, PersonCross } from 'akar-icons';
import { useParams } from 'react-router';
import { AuthContext } from '../../utils/context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { removeGroupRecipientThunk, selectGroupById, updateGroupOwnerThunk } from '../../store/groupSlice';
import { removeGroupRecipient } from '../../utils/api';
import { toast } from 'react-toastify';
type Props = {
    points: {x: number, y :number}
}

type CustomerIconProps = {
    type: UserContextMenuActionType;
}

export const CustomIcon: FC<CustomerIconProps> = ({ type }) => {
    const { icon: MyIcon, color } = getUserContextMenuIcon(type);
    return <MyIcon size={20} color={color} />;
}

export const SelectedPariticipantContextMenu: FC<Props> = ({ points }) => {

    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const group = useSelector((state: RootState) => selectGroupById(state, parseInt(id!)));
    const dispatch = useDispatch<AppDispatch>();
    const selectedUser = useSelector((state: RootState) => state.groupSidebar.selectedUser);
    const isOwner = isGroupOwner(user, group);
    const kickUser = () => {
        if (!selectedUser) return;
        dispatch(
            removeGroupRecipientThunk({
                id: parseInt(id!),
                userId: selectedUser.id,
            })
        ).unwrap().then(() => toast('Remove success', { type: 'success', icon: true })).catch((err) => toast(err.message, { type: 'error', icon: true }) )
    }

    const transferGroupOwner = () => {
        console.log(`Transfering Group Owner to ${selectedUser?.id}`);
        if (!selectedUser) return;
        dispatch(updateGroupOwnerThunk({ id: parseInt(id!), newOwnerId: selectedUser.id}))
    }


    
    return (
        <ContextMenu top={points.y} left={points.x}>
            <ContextMenuItem>
                <Person size={20} color="#7c7c7c" />
                <span style={{ color: '#7c7c7c' }}>Profile</span>
            </ContextMenuItem>
            {isOwner && user?.id !== selectedUser?.id && (
                <>
                    <ContextMenuItem onClick={kickUser}>
                        <PersonCross size={20} color="#ff0000" />
                        <span style={{ color: '#ff0000' }}>Kick User</span>
                    </ContextMenuItem>
                    <ContextMenuItem onClick={transferGroupOwner}>
                        <Crown size={20} color="#FFB800" />
                        <span style={{ color: '#FFB800' }}>Transfer Owner</span>
                    </ContextMenuItem>
                </>
            )}
               
        </ContextMenu>
    )
}