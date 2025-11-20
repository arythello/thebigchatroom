import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

function UsernameForm({ user }) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const cleanUsername = username.trim();
        const lowerUsername = cleanUsername.toLowerCase();

        if (cleanUsername.length < 3) {
            setError('Username must be at least 3 characters.');
            setLoading(false);
            return;
        }

        // Simple regex for alphanumeric + underscore
        if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
            setError('Username can only contain letters, numbers, and underscores.');
            setLoading(false);
            return;
        }

        try {
            // Check if username exists in 'usernames' collection
            // We use the lowercase version as the document ID to ensure case-insensitive uniqueness
            const usernameRef = doc(db, "usernames", lowerUsername);
            const usernameSnap = await getDoc(usernameRef);

            if (usernameSnap.exists()) {
                setError('Username is already taken. Please choose another.');
                setLoading(false);
                return;
            }

            // Reserve username
            await setDoc(usernameRef, {
                uid: user.uid,
                originalName: cleanUsername,
                createdAt: new Date()
            });

            // Update Auth Profile
            await updateProfile(user, { displayName: cleanUsername });

            // Reload to refresh auth state and enter chat
            window.location.reload();

        } catch (err) {
            console.error("Error setting username:", err);
            setError('Error setting username. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="sign-in-container">
            <h1>Choose a Username</h1>
            <p>Pick a unique username to be known by.</p>

            <form className="email-form" onSubmit={handleSubmit}>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username (e.g. cool_cat_99)"
                    required
                    maxLength={20}
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Checking availability...' : 'Start Chatting'}
                </button>
            </form>
        </div>
    );
}

export default UsernameForm;
