import { useEffect, useRef, useState } from 'react';

const Modal = ({ onClose, onEdit, currentTodo }) => {
    const [content, setContent] = useState(currentTodo.content);
    const modalRef = useRef(null);

    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.focus();
            modalRef.current.setSelectionRange(content.length, content.length);
            modalRef.current.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            });
        }
    });

    function handleEditSubmit(e) {
        e.preventDefault();
        onEdit(content);
        onClose();
    }
    return (
        <div className="modal-overlay" onClick={onClose}>
            <form
                className='modal-content'
                onSubmit={(e) => handleEditSubmit(e)}
                onClick={(e) => e.stopPropagation()}>
                <h1>일정 수정</h1>
                <textarea
                    defaultValue={content}
                    onChange={(e) => setContent(e.target.value)}
                    tabIndex={1}
                    maxLength={100}
                    ref={modalRef}
                    type="text"
                    placeholder="Edit Todo"
                />
                <div className="flex">
                    <button>
                        저장
                    </button>
                </div>
                <button title="닫기" onClick={onClose}>
                    X
                </button>
            </form>
        </div>
    );
};

export default Modal;