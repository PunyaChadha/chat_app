import {Alert, Button, Form, Row, Col, Stack} from "react-bootstrap"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Register = () => {
    const {regInfo, updateRegInfo, registerUser, regError, isRegLoading} = useContext(AuthContext);
    return (<>
    <Form onSubmit={registerUser}>
        <Row style={{
            height:"100vh",
            justifyContent:"center",
            textAlign:"center",
            paddingTop:"10%"
        }}>
            <Col xs={4}>
                <Stack gap={4}>
                    <h2>Register</h2>
                    <Form.Control type="text" placeholder="Name" onChange={(e) => {
                        updateRegInfo({...regInfo, name:e.target.value})
                    }}/>
                    <Form.Control type="email" placeholder="Email ID" onChange={(e) => {
                        updateRegInfo({...regInfo, email:e.target.value})
                    }}/>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => {
                        updateRegInfo({...regInfo, password:e.target.value})
                    }}/>
                    <Button variant="primary" type="submit">
                        {isRegLoading ? "Creating your account..." : "Register"}
                    </Button>
                    {regError?.error && (
                        <Alert variant="danger">
                            <p>{regError?.message}</p>
                        </Alert>
                    )}
                    <p>Already have an account? <Link to={"/login"}>Login</Link></p>
                </Stack>
            </Col>
        </Row>
    </Form>
    </>);
};
 
export default Register;