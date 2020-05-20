import React from 'react';
import styles from './Auth.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tab from 'react-bootstrap/Tab';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface Props {
  authController: Function;
}

const Auth: React.FC<Props> = (props) => {
  const [LoginData, setLogin] = React.useState({
    login: '',
    password: '',
  });
  const [RegisterData, setRegister] = React.useState({
    login: '',
    password: '',
    confirmPassword: '',
    username: '',
    color: '',
  });
  const [isCorrect, corrected] = React.useState(true);

  const authSubmit = (form: string): void => {
    if(form === 'login') {
      props.authController('login', LoginData);
    }
    if(form === 'register') {
      if(RegisterData.password === RegisterData.confirmPassword) {
        delete RegisterData.confirmPassword;
        if (RegisterData.username === '') setRegister({ ...RegisterData, username: 'Anonymous' });
        props.authController('register', RegisterData);
      } else if(RegisterData.password !== '' && RegisterData.confirmPassword !== '') corrected(false);
    }
  };

  return(
    <div className={styles.Auth}>
      <Container>
        <Tabs defaultActiveKey="login" id="uncontrolled-tab-example">
          <Tab eventKey="login" title="Login">
            <Container>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Login: </Form.Label>
                  <Form.Control
                    required type="text" placeholder="Login"
                    onChange={(e: React.FormEvent<HTMLInputElement>): void => setLogin({ ...LoginData, login: e.currentTarget.value })}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password: </Form.Label>
                  <Form.Control
                    required type="password" placeholder="Password"
                    onChange={(e: React.FormEvent<HTMLInputElement>): void => setLogin({ ...LoginData, password: e.currentTarget.value })}
                  />
                </Form.Group>
                <Button
                  variant="dark"
style={{ width: '100%' }}
                  onClick={(): void => authSubmit('login')}
                >
                  Login
                </Button>
              </Form>
            </Container>
          </Tab>
          <Tab eventKey="register" title="Register">
            <Container>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Login: </Form.Label>
                  <Form.Control
                    required type="text" placeholder="Login"
                    onChange={(e: React.FormEvent<HTMLInputElement>): void => setRegister({ ...RegisterData, login: e.currentTarget.value })}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password: </Form.Label>
                  <Form.Control
                    required type="password" placeholder="Password"
                    onChange={(e: React.FormEvent<HTMLInputElement>): void => setRegister({ ...RegisterData, password: e.currentTarget.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Confirm Password: </Form.Label>
                  <Form.Control
                    type="password" placeholder="Password"
                    onChange={(e: React.FormEvent<HTMLInputElement>): void => setRegister({ ...RegisterData, confirmPassword: e.currentTarget.value })}
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Your name or nickname: </Form.Label>
                        <Form.Control
                            type="text" placeholder="Anonymous"
                            onChange={(e: React.FormEvent<HTMLInputElement>): void => setRegister({ ...RegisterData, username: e.currentTarget.value })}
                          />
                      </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Your favorite color: </Form.Label>
                        <Form.Control
                            type="color" defaultValue={`#${  Math.floor(Math.random()*16777215).toString(16)}`}
                            onChange={(e: React.FormEvent<HTMLInputElement>): void => setRegister({ ...RegisterData, color: e.currentTarget.value })}
                          />
                      </Form.Group>
                  </Col>
                </Row>

                <Button
                  variant="dark"
style={{ width: '100%' }}
                  onClick={(): void => isCorrect && authSubmit('register')}
                >
                  Register
                </Button>
              </Form>
            </Container>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default Auth;
