import { UserSidebarItemType } from "../../../utils/types"
import {FC} from 'react'
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { getUserSidebarIcon } from "../../../utils/helpers";
import { IConBadge, UserSidebarItemStyle } from "../../../utils/styles";

type Props = {
    item: UserSidebarItemType;
}


export const UserSidebarItem: FC<Props> = ({ item }) =>{

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const friendRequests = useSelector((state: RootState) => state.friends.friendRequests);
    const Icon = getUserSidebarIcon(item.id);
    const ICON_SIZE = 30;
    const STROKE_WIDTH = 2;


    const isActive = () => {
        if (pathname.includes('/groups') && item.id === 'conversations')
            return true;
        return pathname.includes(item.pathname);
    };

    console.log()

    return <UserSidebarItemStyle
        onClick={() => navigate(item.pathname)}
        active={isActive()}
    >
        <Icon size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
        {item.id === 'friends' && friendRequests.length > 0&& (
            <IConBadge>
                {friendRequests.length>9 ? '10+':friendRequests.length}
            </IConBadge>
        )}
    </UserSidebarItemStyle>

 } 