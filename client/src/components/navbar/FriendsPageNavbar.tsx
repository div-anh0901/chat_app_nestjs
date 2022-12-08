import { useLocation, useNavigate } from "react-router"
import { useState} from 'react';
import { CreateFriendRequestModal } from "../modals/CreateFriendRequestModal";
import { FriendsNavbar, FriendsNavbarItem } from "../../utils/styles/friends";
import { friendsNavbarItems } from "../../utils/constant";
import { Button } from "../../utils/styles/button";
import { AiOutlineUserAdd } from "react-icons/ai";

export const FriendsPageNavbar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            {showModal && <CreateFriendRequestModal setShowModal={setShowModal} />}
            <FriendsNavbar>
                <div className="navLinks">
                    {
                        friendsNavbarItems.map((item) => (
                            <FriendsNavbarItem
                                key={item.id}
                                active={pathname === item.pathname}
                                onClick={() => navigate(item.pathname)}
                            >
                                {item.label}
                            </FriendsNavbarItem>

                        ))
                    }
                </div>
                <Button
                    size="sm"
                    flex={true}
                    variant="primary"
                    onClick={() => setShowModal(true)}
                >
                    <AiOutlineUserAdd size={24} />
                    <span>Add friend</span>
                </Button>
            </FriendsNavbar>
        </>
    )
}