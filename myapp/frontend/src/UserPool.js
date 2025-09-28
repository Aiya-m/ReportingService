import { CognitoUserPool } from "amazon-cognito-identity-js"

const poolData = {
    UserPoolId: "us-east-1_4wFdFGByS",
    ClientId: "5qgbfvf4sgc5m3ia95dd92hjls"
}

export default new CognitoUserPool(poolData);