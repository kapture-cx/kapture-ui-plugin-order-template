import React, { lazy } from "react"

const DefaultTicketOrders = lazy(() => import("./TicketOrder/default.ticketOrders"))

export default function Container(props) {
    return (
        <>
            <DefaultTicketOrders {...props} />
        </>
    )
}
