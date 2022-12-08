import { SettingsItems } from "../../utils/constant"
import { SettingsSidebarHeader, SettingsSidebarItemContainer, SettingsSidebarStyle } from "../../utils/styles/settings"
import { SettingsSidebarItem } from "./items/SettinsSidebarItem"

export const SettingsSidebar = () => {
    return (
        <SettingsSidebarStyle>
            <SettingsSidebarHeader>
                <span>Settings</span>
            </SettingsSidebarHeader>
            <SettingsSidebarItemContainer>
                {SettingsItems.map((item) => (
                    <SettingsSidebarItem key={item.id} item={item}/>
                ))}
            </SettingsSidebarItemContainer>
        </SettingsSidebarStyle>
    )
}