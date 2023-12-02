import { useContext, useState } from "react";
import { CustomContext, CustomContextType } from "./GiglistProvider";

export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { auth } = useContext(CustomContext) as CustomContextType;

    const handleSignUp = async () => {
        try {
            await auth.createUserWithEmailAndPassword(email, password);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};
