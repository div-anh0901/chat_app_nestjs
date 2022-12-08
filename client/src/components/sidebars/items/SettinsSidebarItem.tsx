import { SettingsItemType } from "../../../utils/types"
import {FC } from 'react'
import { SettingsSidebarItemStyle } from "../../../utils/styles/settings";
import { useLocation, useNavigate } from "react-router";
import { getSettingSidebarIcon } from "../../../utils/helpers";
type Props = {
    item: SettingsItemType;
}


export const SettingsSidebarItem: FC<Props> = ({ item }) => {
    
    const navigate = useNavigate();
    const {pathname } = useLocation();

    const Icon = getSettingSidebarIcon(item.id);
    const ICON_SIZE = 30;
    const SRTOKE_WIDTH = 2;

    return (
        <SettingsSidebarItemStyle
            onClick={()=>navigate(item.pathname)}
            isActive={item.pathname === pathname}
        >
            <div className="settingItem" >
                <Icon size={ICON_SIZE} strokeWidth={SRTOKE_WIDTH} />
                <span>{ item.label}</span>
            </div>
        </SettingsSidebarItemStyle>
    )

}
