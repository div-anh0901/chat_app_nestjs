import { Edit, MoonFill } from "akar-icons"
import { useContext, useEffect, useState } from "react"
import { MoonLoader } from "react-spinners"
import { UserAvatar } from "../../components/settings/profile/UserAvatar"
import { UserBanner } from "../../components/settings/profile/UserBanner"
import { updateUserProfile } from "../../utils/api"
import { CDN_URL } from "../../utils/constant"
import { AuthContext } from "../../utils/context/AuthContext"
import { OverlayStyle, Page } from "../../utils/styles"
import { Button } from "../../utils/styles/button"
import { ProfileAboutSection, ProfileAboutSectionHeader, ProfileDescriptionField, ProfileEditActionBar, ProfileSection, SettingsProfileUserDetails } from "../../utils/styles/settings"

export const SettingsProfilePage = () => {
    const { user ,updateAuthUser} = useContext(AuthContext);

    const [about, setAbout] = useState(user?.profile?.about || '');
    const [bannerSource, setBannerSource] = useState(CDN_URL.concat(user?.profile?.banner || ''));
    const [bannerFile, setBannerFile] = useState<File>();
    const [bannerSourceCopy, setBannerSourceCopy] = useState(bannerSource);

    const [avatarFile, setAvatarFile] = useState<File>();
    const [avatarSource, setAvatarSource] = useState(CDN_URL.concat(user?.profile?.avatar || ''))
    const [avatarSourceCopy, setAvatarSourceCopy] = useState(avatarSource);

    const [loading, setLoading] = useState(false);

    const [aboutCopy, setAboutCopy] = useState(about);
    const [isEditing, setIsEditing] = useState(false);

    const isChanged = () => aboutCopy !== about || bannerFile || avatarFile;

    useEffect(() => {
        setAbout(user?.profile?.about || '');
    }, [user?.profile?.about]);

    useEffect(() => {
        setBannerSource(CDN_URL.concat(user?.profile?.banner || ''));
        setBannerSourceCopy(CDN_URL.concat(user?.profile?.banner || ''))
    }, [user?.profile?.banner])

    const reset = () => {
        setAboutCopy(about);
        setBannerSourceCopy(bannerSource);
        setAvatarSourceCopy(avatarSource)
        setIsEditing(false);
        setAvatarFile(undefined)
        setBannerFile(undefined);
        URL.revokeObjectURL(bannerSourceCopy);
        URL.revokeObjectURL(avatarSourceCopy);

    }

    const save = async () => {
        const formData = new FormData();
        bannerFile && formData.append('banner', bannerFile);
        avatarFile && formData.append('avatar', avatarFile);
        about !== aboutCopy && formData.append('about', aboutCopy);
        try {
            setLoading(true);
            const { data: updatedUser } = await updateUserProfile(formData);
            console.log(updatedUser)
            updateAuthUser(updatedUser);
            setIsEditing(false);
            URL.revokeObjectURL(bannerSourceCopy);
            URL.revokeObjectURL(avatarSourceCopy);
            setAvatarFile(undefined)
            setBannerFile(undefined);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            {
                loading && (
                    <OverlayStyle>
                        <MoonLoader size={40} color="#fff" />
                    </OverlayStyle>
                )
            }
            <Page>
                <UserBanner
                    bannerSource={bannerSource}
                    bannerSourceCopy={bannerSourceCopy}
                    setBannerSourceCopy={setBannerSourceCopy}
                    setBannerFile={setBannerFile}
                />
                <ProfileSection>
                    <SettingsProfileUserDetails>
                        <UserAvatar
                            avatarSource={avatarSource}
                            avatarSourceCopy={avatarSourceCopy}
                            setAvatarSourceCopy={setAvatarSourceCopy}
                            setAvatarFile={setAvatarFile}
                        />
                        <span>@username</span>
                    </SettingsProfileUserDetails>
                    <ProfileAboutSection>
                        <ProfileAboutSectionHeader>
                            <label htmlFor="about" >About me</label>
                            <Edit
                                strokeWidth={2}
                                size={28}
                                onClick={() => setIsEditing(!isEditing)}
                            />
                        </ProfileAboutSectionHeader>
                        <ProfileDescriptionField
                            maxLength={200}
                            value={aboutCopy}
                            disabled={!isEditing}
                            onChange={(e) => setAboutCopy(e.target.value)}
                        />

                    </ProfileAboutSection>
                </ProfileSection>
                {isChanged() && (
                    <ProfileEditActionBar>
                        <div>
                            <span>You have unsaved changes</span>
                        </div>
                        <div className="buttons">
                            <Button size="md" variant="secondary" onClick={reset} >
                                Reset
                            </Button>
                            <Button size="md" onClick={save} >Save</Button>
                        </div>
                    </ProfileEditActionBar>

                )}
            </Page>
        
        </>
        
    )
}