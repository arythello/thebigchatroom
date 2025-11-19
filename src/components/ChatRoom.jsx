import React, { useState, useRef, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, orderBy, limit, addDoc, serverTimestamp } from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';

function ChatRoom() {
    const dummy = useRef();
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt'), limit(50)); // Limit to last 50 messages

    const [messages] = useCollectionData(q, { idField: 'id' });
    const [formValue, setFormValue] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid, photoURL, displayName } = auth.currentUser;

        await addDoc(messagesRef, {
            text: formValue,
            createdAt: serverTimestamp(),
            uid,
            photoURL,
            displayName: displayName || 'Anonymous'
        });

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        if (dummy.current) {
            dummy.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <>
            <header>
                <h3>The Big Chat Room</h3>
                <SignOut />
            </header>

            <main>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                <span ref={dummy}></span>
            </main>

            <form onSubmit={sendMessage}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say something nice..." />
                <button type="submit" disabled={!formValue}>🕊️</button>
            </form>
        </>
    );
}

function SignOut() {
    return auth.currentUser && (
        <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    )
}

function ChatMessage(props) {
    const { text, uid, photoURL, displayName } = props.message;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <div className={`message ${messageClass}`}>
            <img src={photoURL || 'https://api.dicebear.com/9.x/avataaars/svg?seed=' + uid} alt="Avatar" />
            <div className="message-content">
                <span className="username">{displayName}</span>
                <p>{text}</p>
            </div>
        </div>
    )
}

export default ChatRoom;
