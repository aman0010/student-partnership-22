import { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import axios from "axios";
import "./App.css";

function App() {
    const [username, setUsername] = useState("");
    const [msg, setMsg] = useState("");

    function checkValid(username) {
        if (!username) {
            setMsg("Enter a username");
            return;
        }
        axios
            .get(`http://localhost:8000/validate/${username}`)
            .then((res) => {
                if (res.data.msg) setMsg(res.data.msg);
            })
            .catch((err) => {
                console.log(err);
                setMsg("Error occured");
            });
    }

    const handleClick = (event) => {
        event.preventDefault();
        checkValid(username);
    };

    return (
        <div className="App">
            <Col md={{ span: 6, offset: 3 }} className="my-3">
                <h3>Student Partnership</h3>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={handleClick}>
                        Check
                    </Button>
                </Form>
                <div className="my-3">{msg}</div>
            </Col>
        </div>
    );
}

export default App;
