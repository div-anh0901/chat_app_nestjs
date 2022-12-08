import { CirclePlusFill } from 'akar-icons';
import { useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { addAttachment, incrementAttachmentCounter } from '../../store/message-panel/MessagePanelSlice';
import { useToast } from '../../utils/hook/useToast';
import { FileInput } from '../../utils/styles/inputs/Textarea';
import { DivMouseEvent, InputChangeEvent } from '../../utils/types';
import styles from './index.module.scss';

export const MessageAttachmentActionIcon = () => {
    const attachmentIconRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dipatch = useDispatch<AppDispatch>();
    const { error } = useToast({ theme: 'dark' });
    const { attachmentCounter, attachments } = useSelector((state: RootState) => state.messagePanel);


    const onClick = (e: DivMouseEvent) => {
        fileInputRef.current?.click();
    }


    const onChange = (e: InputChangeEvent) => {
        const file = e.target.files?.item(0);
        if (attachments.length >= 5) {
            return error('Maximum 5 Attachments Allowed', { position: 'top-center' });

        }
        if (file && file.size > 1000000) {
            return error('File exceds limit : 1MB', { position: 'top-center' });
        }
        if (file)
            dipatch(addAttachment({ id: attachmentCounter, file }));
            dipatch(incrementAttachmentCounter());
    }

    return (
        <div ref={attachmentIconRef} onClick={onClick}>
            <CirclePlusFill size={36} className={styles.icon} cursor="pointer" />
            <FileInput
                ref={fileInputRef}
                type="file"
                accept='image/*'
                onChange={onChange}
            />
        </div>
    )
}