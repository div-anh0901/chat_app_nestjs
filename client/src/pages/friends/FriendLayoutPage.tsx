import { AiOutlineUserAdd } from "react-icons/ai";
import { Outlet, useLocation, useNavigate, useParams } from "react-router"
import { FriendsPageNavbar } from "../../components/navbar/FriendsPageNavbar";
import { friendsNavbarItems } from "../../utils/constant";
import { Button } from "../../utils/styles/button";
import { FriendsNavbar, FriendsNavbarItem, FriendsPageStyle } from "../../utils/styles/friends";
import { FriendsPage } from "./FriendsPage";



export const FriendLayoutPage = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    return (
        <FriendsPageStyle>
            <FriendsPageNavbar/>
            {pathname === '/friends' && <FriendsPage />}
            <Outlet />
        </FriendsPageStyle>
    )
}