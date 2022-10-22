import { render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import App from './App';
import { server } from './mocks/server';

describe("sensor chart", () => {

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

        await waitForElementToBeRemoved(await findByTestId("no-data-msg"))

        expect(await findByTestId("humidCard")).toBeInTheDocument();
    });

    test('renders no data message', async () => {
        const { getByTestId } = render(<App />)

        await waitFor(() => { getByTestId("no-data-msg") });

        expect(getByTestId("no-data-msg")).toBeInTheDocument();
    });
})

describe("actuator readings", () => {
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

    test("renders soil moisture actuator card", async () => {
        const { getByTestId } = render(<App />)

        await waitFor(() => { getByTestId("soilCard") })
        await waitFor(() => { getByTestId("soilCardValue") })

        const soilCard = getByTestId("soilCard");
        const soilCardValue = getByTestId("soilCardValue");
        expect(soilCard).toBeInTheDocument();
        expect(soilCardValue).toHaveTextContent(0);
    })

    test("renders temperature actuator card", async () => {
        const { getByTestId } = render(<App />)

        await waitFor(() => { getByTestId("tempCard") })
        await waitFor(() => { getByTestId("tempCardValue") })

        const tempCard = getByTestId("tempCard");
        const tempCardValue = getByTestId("tempCardValue");
        expect(tempCard).toBeInTheDocument();
        expect(tempCardValue).toHaveTextContent(0);
    })

    test("renders humidity actuator card", async () => {
        const { getByTestId } = render(<App />)

        await waitFor(() => { getByTestId("humidCard") })
        await waitFor(() => { getByTestId("humidCardValue") })

        const humidCard = getByTestId("humidCard");
        const humidCardValue = getByTestId("humidCardValue");
        expect(humidCard).toBeInTheDocument();
        expect(humidCardValue).toHaveTextContent(0);
    })
})