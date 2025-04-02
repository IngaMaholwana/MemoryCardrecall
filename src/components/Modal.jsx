import { useRef } from "react"

const Modal = ( {content, buttonClass, buttonText, buttonIcon} ) => {
    const dialog = useRef()
    const hideModal = () => dialog.current.close()
    const showModal = () => dialog.current.showModal()
    return (
        <>
        <button type="button" className={buttonClass} onClick={showModal}>
            {buttonIcon}
            {buttonText}
        </button>
        <dialog ref={dialog}>
            <div className="dialog-content">
                {content}
                <button type='button' className='close-modal blue-hover' onClick={hideModal}>Close</button>
            </div>
        </dialog>
        </>
    )
}

export default Modal