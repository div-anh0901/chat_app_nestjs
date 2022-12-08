import { User } from "../../utils/types"
import {FC} from 'react'
import { CDN_URL } from "../../utils/constant";
import defaultAvatar from '../../_assets_/default_avatar.jpg';
import { UserAvatarContainer } from "../../utils/styles";
type Props = {
    user: User;
}

export const UserAvatar: FC<Props> = ({ user }) => {
    
    const getProfilePicture = () => {
        const {profile } = user;
        return profile && profile.avatar ? CDN_URL.concat(profile?.avatar) : defaultAvatar

    }

    return <UserAvatarContainer src={getProfilePicture()} alt="avatar" />

}