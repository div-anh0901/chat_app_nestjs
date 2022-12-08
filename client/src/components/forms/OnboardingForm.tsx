import {useState,useRef } from 'react';
import { completeUserProfile } from '../../utils/api';
import { FileInput, OnboardingAboutField, OnboardingInputField, SubmitOnboardingFormButton, UploadAvatarButton, UploadedAvatar, UploadedAvatarContainer } from '../../utils/styles/inputs/Textarea';
import styles from './index.module.scss';
import { FiFileMinus } from 'react-icons/fi';
export const OnboardingForm = () => {
    const [file, setFile] = useState<File>();
    const [sourse, setSourse] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLLabelElement>(null);
    const [username, setUsername] = useState('');

    const [about ,setAbout] = useState('');


    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length) {
            const file = files.item(0);
            if (file) {
                setSourse(URL.createObjectURL(file));
                setFile(file)
            }
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === imageContainerRef.current || e.target === labelRef.current) {
            fileInputRef.current?.click();
        }
    }

    const reset = () => {
        setFile(undefined);
        setSourse('');
    }


    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (file) {
            const data = new FormData();
            data.append('file', file);
            data.append('username', username);
            data.append('about', about);
            return completeUserProfile(data).then((res) => console.log(res)).catch(err => console.log(err));

        }
    }

    return (
        <form className={styles.onboardingForm} onSubmit={onSubmit}>
            <div>
                <label htmlFor="username" className={styles.onboardingLabel}>Username</label>
                
            </div>
            <OnboardingInputField id='username' type="text" placeholder='@yourusername' value={username} onChange={(e) => setUsername(e.target.value)} />
            <div onClick={handleClick}>
                <label htmlFor="about" className={styles.onboardingLabel}>About Yourself</label>    
            </div>
            <OnboardingAboutField id='about' maxLength={20} value={about} onChange={e => setAbout(e.target.value)} />
            {
                sourse && (<UploadedAvatarContainer>
                    <div className='side' >
                        <UploadedAvatar src={sourse} alt='avatar' />
                        <div className='fistName'>
                            asdjhasduiashdjisadgsayhudgaudasdjhasduias
                        </div>
                        <FiFileMinus size={40} color="#ff0000" onClick={reset}/>
                    </div>
                </UploadedAvatarContainer>)
            }
            <UploadAvatarButton  onClick={handleClick} ref={imageContainerRef} >
                <label
                    ref={labelRef}
                    htmlFor="file"
                    onClick={(e) => e.preventDefault()}
                >
                    Upload Avatar
                </label>
                <FileInput
                    id='file'
                    type='file'
                    accept="image/jpg, image/jpeg, image/png"
                    ref={fileInputRef}
                    onChange={onFileChange}
                />
            </UploadAvatarButton>
            <SubmitOnboardingFormButton>Submit</SubmitOnboardingFormButton>
        </form>
    )

}