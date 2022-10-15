import { render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import App from './App';
import { server } from './mocks/server';

describe('sensor chart', () => {

    beforeAll(() => {
        server.listen({
            onUnhandledRequest: "error"
        })
        server.printHandlers()
    })

    afterEach(() => {
        server.resetHandlers()
    })

    afterAll(() => {
        server.close()
    });

    test('renders chart', async () => {
        const { findByTestId } = render(<App />)

        setTimeout(async () => {
            await waitForElementToBeRemoved(findByTestId("no-data-msg"))
            await waitFor(findByTestId("sensor-chart"))

            expect(findBytestId("sensor-chart")).toBeInTheDocument();
        }, 100);
    });

    test('renders no data message', async () => {
        const { getByTestId } = render(<App />)

        await waitFor(() => { getByTestId("no-data-msg") });

        expect(getByTestId("no-data-msg")).toBeInTheDocument();
    });
})
