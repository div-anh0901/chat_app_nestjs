import {useState,useContext} from 'react'
import { UserAvatar } from "../../utils/styles"
import { UserSidebarStyle } from "../../utils/styles"
import { ChatDots,Person ,ArrowCycle} from "akar-icons"
import styles from './index.module.scss'
import { CreateConversationModal } from '../modals/CreateConversationModal'

import { CDN_URL, userSidebarItems } from '../../utils/constant'
import { UserSidebarItem } from './items/UserSidebarItem'
import avatar from '../../_assets_/default_avatar.jpg';
import { AuthContext } from '../../utils/context/AuthContext'
import { UpdatePresenceStatusModal } from '../modals/UpdatePresenceStatusModal'

export const UserSidebar = () => {
    const { user } = useContext(AuthContext);

    const [showModal, setShowModal] = useState(false);
    
    return (
        <>
            {showModal && <UpdatePresenceStatusModal setShowModal={setShowModal} />}
            <UserSidebarStyle>
                <UserAvatar src={user?.profile?.avatar ? CDN_URL.concat(user.profile.avatar) : avatar} alt="avatar" width="55px" onClick={() => setShowModal(true)} />
                <hr className={styles.hr} />
               
                {userSidebarItems.map(item => (
                    <UserSidebarItem key={item.id} item={item} />
                ))}
               
               
            </UserSidebarStyle>
        </>
       
    )
}