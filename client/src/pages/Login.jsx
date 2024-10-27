import { useContext } from "react";
import {Alert, Button, Form, Row, Col, Stack} from "react-bootstrap"
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {

    const {loginUser,loginError,loginInfo,isLoginLoading,updateLoginInfo} = useContext(AuthContext)

    return (<>
    <Form onSubmit={loginUser}>
        <Row style={{
            height:"100vh",
            justifyContent:"center",
            textAlign:"center",
            paddingTop:"10%"
        }}>
            <Col xs={4}>
                <Stack gap={4}>
                    <h2>LogIn</h2>
                    <Form.Control type="email" placeholder="Email ID" onChange={(e) => {
                        updateLoginInfo({...loginInfo, email:e.target.value})
                    }}/>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => {
                        updateLoginInfo({...loginInfo, password:e.target.value})
                    }}/>
                    <Button variant="primary" type="submit">
                        {isLoginLoading ? "Loggin you in..." : "Login"}
                    </Button>
                    {loginError?.error && (
                        <Alert variant="danger">
                            <p>{loginError?.message}</p>
                        </Alert>
                    )}
                    <p>Don't have an account?  <Link to={"/register"}>Create Account</Link></p>
                </Stack>
            </Col>
        </Row>
    </Form>
    </>);
};
 
export default Login;