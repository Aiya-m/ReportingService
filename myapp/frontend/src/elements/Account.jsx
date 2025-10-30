import React, {createContext} from "react"
import Pool from "../UserPool";
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const AccountContext = createContext();

const Account = (props) => {
    const getSession = async () => {
        return await new Promise((resolve, reject) => {
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
                reject();
            }
        });
    }
    const authenticate = async (Username, Password) => {
        return await new Promise((resolve, reject) => {
            const authDetails = new AuthenticationDetails({
                Username,
                Password,
            });

            const cognitoUser = new CognitoUser({
                Username,
                Pool,
            });

            cognitoUser.authenticateUser(authDetails, {
                onSuccess: (session) => {
                    console.log("Login success!", session);
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
        })
    }

    const logout = () => {
        const user = Pool.getCurrentUser();
        if (user) {
            user.signOut();
        }
    }

    return (
        <AccountContext.Provider value={{ authenticate, getSession, logout }}>
            {props.children}
        </AccountContext.Provider>
    )
}

export {Account, AccountContext};