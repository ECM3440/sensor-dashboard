import { rest } from "msw"

export const handlers = [
    rest.get(`${process.env.REACT_APP_EVENTPROCESSOR_URL}`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                [
                    {
                        "2020-03-20T14:28:23.382748": [
                            {
                                "name": "Soil Moisture",
                                "value": 2
                            },
                            {
                                "name": "Humidity",
                                "value": 4
                            },
                            {
                                "name": "Temperature",
                                "value": 8
                            },
                        ]
                    }
                ]
            )
        )
    })
]