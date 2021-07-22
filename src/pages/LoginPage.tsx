import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { Card } from '../components/auth/Card';
import { FormButton } from '../components/auth/FormButton';
import { Form } from '../components/auth/Form';
import { CardImage } from '../components/auth/CardImage';
import { CardTitle } from '../components/auth/CardTitle';
import { FormContainer } from '../components/auth/FormContainer';
import { AuthLayout } from '../layouts/AuthLayout';
import { FormInput } from '../components/auth/FormInput';
import { FormInputIcon } from '../components/auth/FormInputIcon';
import { CardLink } from '../components/auth/CardLink';
import { CardFooter } from '../components/auth/CardFooter';
import { Checkbox, InputCheckbox } from '../components/auth/Checkbox';
import { AuthContext } from '../auth/AuthContext';

const initialState: FormLogin = {
  email: '',
  password: '',
  remember: false,
};

const LoginPage = () => {
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    const email = localStorage.getItem('email');
    email && setForm((form) => ({ ...form, email, remember: true }));
  }, []);

  const toggleCheck = (): void => {
    setForm({ ...form, remember: !form.remember });
  };

  const onChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = target;
    setForm({ ...form, [name]: value });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const { email, password, remember } = form;

    remember
      ? localStorage.setItem('email', form.email)
      : localStorage.removeItem('email');

    const ok = await login(email, password);

    !ok &&
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Verifique usuario y/o contraseña',
      });
  };

  const formIsValid = (): boolean => {
    return form.email.length > 0 && form.password.length > 3;
  };

  return (
    <AuthLayout>
      <Card className="animate__animated animate__flipInY">
        <div>
          <CardImage
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <CardTitle>Ingresar</CardTitle>
        </div>
        <Form onSubmit={onSubmit}>
          <FormContainer>
            <FormInputIcon className="fas fa-envelope" />
            <FormInput
              required
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="off"
              value={form.email}
              onChange={onChange}
            />
          </FormContainer>
          <FormContainer>
            <FormInputIcon className="fas fa-key" />
            <FormInput
              required
              type="password"
              placeholder="Password"
              name="password"
              autoComplete="off"
              value={form.password}
              onChange={onChange}
            />
          </FormContainer>
          <Checkbox>
            <InputCheckbox className="checkbox bounce" onClick={toggleCheck}>
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                readOnly
              />
              <svg viewBox="0 0 21 21">
                <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
              </svg>
              <label>Recuérdame</label>
            </InputCheckbox>
          </Checkbox>
          <FormButton type="submit" disabled={!formIsValid()}>
            Iniciar sesión
          </FormButton>
        </Form>
        <CardFooter>
          <hr />
          No tienes cuenta?
          <CardLink to="/auth/register">Regístrate</CardLink>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
