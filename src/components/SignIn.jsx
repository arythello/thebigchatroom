import React, { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, githubProvider } from '../firebase';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState(null);

    const signInWithGoogle = () => {
        signInWithPopup(auth, googleProvider).catch((error) => {
            console.error("Error signing in with Google", error);
            setError(error.message);
        });
    };

    const signInWithGithub = () => {
        signInWithPopup(auth, githubProvider).catch((error) => {
            console.error("Error signing in with Github", error);
            setError(error.message);
        });
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="sign-in-container">
            <h1>Welcome Back</h1>
            <p>Sign in to continue to The Big Chat Room</p>

            <div className="auth-buttons">
                <button className="sign-in-btn google-btn" onClick={signInWithGoogle}>
                    Sign in with Google
                </button>
                <button className="sign-in-btn github-btn" onClick={signInWithGithub}>
                    Sign in with GitHub
                </button>
            </div>

            <div className="divider">
                <span>or</span>
            </div>

            <form className="email-form" onSubmit={handleEmailAuth}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="submit-btn">
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <button className="toggle-auth" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
        </div>
    );
}

export default SignIn;
