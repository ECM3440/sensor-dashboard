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
            await waitForElementToBeRemoved(await findByTestId("no-data-msg"))
            await waitFor(await findByTestId("sensor-chart"))

            expect(await findBytestId("sensor-chart")).toBeInTheDocument();
        }, 100);
    });

    test('renders no data message', async () => {
        const { getByTestId } = render(<App />)

        await waitFor(() => { getByTestId("no-data-msg") });

        expect(getByTestId("no-data-msg")).toBeInTheDocument();
    });
})
