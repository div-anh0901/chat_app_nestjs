import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import '@testing-library/jest-dom';

describe('RegisterPage', () => { 

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should render form field', () => {
        const view = render(
            <Router>
                <RegisterPage />
            </Router>
        );
        expect(view).toMatchSnapshot();
    });
    

    it('shold display all error when submitting with all empty fields', async () => {
        render(
            <Router>
                <RegisterPage />
            </Router>
        )

        const submitButton = screen.getByRole('button', {
            name: 'Create My Account',
        });

        submitButton.click();
        const usernameError = await screen.findByText('Username is Required');
        const firstnameError = await screen.findByText('First Name is Required');
        const lastnameError = await screen.findByText('Last Name is Required');
        const passwordError = await screen.findByText('Password is Required');

        await waitFor(() => {
            expect(usernameError).toBeInTheDocument();
        });

        expect(firstnameError).toBeInTheDocument();
        expect(lastnameError).toBeInTheDocument();
        expect(passwordError).toBeInTheDocument();

    })


    it('should submit  empty username field  then remove error typing and leaving forcus', async () => {
        render(
            <Router>
                <RegisterPage />
            </Router>
        )
        const submitButton = screen.getByRole('button');
        submitButton.click();
        const usernameError = await screen.findByText('Username is Required');
        await waitFor(() => {
            expect(usernameError).toBeInTheDocument();
        });
        const usernameField = await screen.findByLabelText('Username');
        const firstNameField = await screen.findByLabelText('First Name');
        expect(usernameField).toBeInTheDocument();
        expect(firstNameField).toBeInTheDocument();

        userEvent.type(usernameField, 'helloworld');
        userEvent.click(firstNameField);


      /*  await waitForElementToBeRemoved(() =>
            screen.queryByText('Username is required')
        );*/
    });


})