import React, {useState, useEffect, useContext, createContext} from "react"
import Pool from "../UserPool";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";

const AccountContext = createContext();

const Account = (props) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getSession = async () => {
        return new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            if (user) {
                user.getSession((err, session) => {
                    if (err) {
                        reject();
                    } else {
                        resolve(session);
                    }
                })
            } else {
                reject("No user found");
            }
        });
    }

    useEffect(() => {
        getSession().then(session => {
            // ถอดรหัส Token เพื่อเอา "Roles"
            const payload = session.getIdToken().payload;
            const roles = payload['custom:Role'] ? [payload['custom:Role']] : [];
            setUser({
                username: payload['cognito:username'],
                email: payload.email,
                roles: roles
            });
            setIsLoading(false);
        }).catch((err) => {
            // ไม่ได้ล็อกอิน
            setUser(null);
            setIsLoading(false);
        });
    }, []);

    const authenticate = async (Username, Password) => {
        return new Promise((resolve, reject) => {
            const authDetails = new AuthenticationDetails({ Username, Password });
            const cognitoUser = new CognitoUser({ Username, Pool });

            cognitoUser.authenticateUser(authDetails, {
                onSuccess: (session) => {
                    console.log("Login success!", session);
                    const payload = session.getIdToken().payload;
                    const roles = payload['custom:Role'] ? [payload['custom:Role']] : [];
                    setUser({
                        username: payload['cognito:username'],
                        email: payload.email,
                        roles: roles
                    });
                    resolve(session)
                },
                onFailure: (err) => {
                    console.error("Login failure:", err);
                    reject(err);
                },
                newPasswordRequired: (data) => {
                    console.log("New password required");
                    resolve(data)
                }
            });
        });
    };

    const logout = () => {
        const user = Pool.getCurrentUser();
        if (user) {
            user.signOut();
            setUser(null);
        }
    }

    const refreshSession = () => {
        return new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            if (!user) return reject("No user logged in");

            user.getSession((err, session) => {
                if (err) return reject(err);
                resolve(session);
            });
        });
    };

    const getUserAttributes = () => {
        return new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            if (!user) return reject("No user logged in");

            user.getSession((err, session) => {
                if (err) return reject(err);

                user.getUserAttributes((err, attributes) => {
                    if (err) return reject(err);
                    const result = {};
                    attributes.forEach(attr => (result[attr.getName()] = attr.getValue()));
                    // Also include username from ID token
                    result["cognito:username"] = session.getIdToken().payload["cognito:username"];
                    resolve(result);
                });
            });
        });
    };

    return (
        <AccountContext.Provider
            value={{ authenticate, getSession, logout, user, isLoading, refreshSession, getUserAttributes }}
        >
            {props.children}
        </AccountContext.Provider>
    );
};

const useAccount = () => useContext(AccountContext);

export { Account, AccountContext, useAccount };