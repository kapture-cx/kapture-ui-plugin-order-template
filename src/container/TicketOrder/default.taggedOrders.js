import { FuseLoading } from "@fuse"
import React, { memo } from "react"
import { useSelector } from "react-redux"
import { DefaultOrderInfo } from "@kapture/x"

function DefaultTaggedOrders() {
    const taggedOrderId = useSelector(({ ticketModule }) => ticketModule?.contacts?.entities?.[ticketModule?.contacts?.selectedContactId]?.orderId ?? null)
    const ticketDetails = useSelector(({ ticketModule }) => ticketModule?.contacts?.entities?.[ticketModule?.contacts?.selectedContactId] ?? null)
    const selectedTicketId = useSelector(({ ticketModule }) => ticketModule?.contacts?.selectedContactId ?? null)

    const orderDetail = useSelector(({ ticketModule }) =>
        ticketModule?.contacts?.entities?.[selectedTicketId]?.genericOrders?.orders?.find?.(order => order.id && taggedOrderId && String(order.id) === String(taggedOrderId))
    )

    if (ticketDetails?.genericOrdersFetching) return <FuseLoading message="Fetching orders..." />

    return <DefaultOrderInfo orderDetails={{ ...orderDetail, ...orderDetail.additional_info }} />
}

export default memo(DefaultTaggedOrders)
