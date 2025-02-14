import React, { memo, useMemo } from "react"
import { useSelector } from "react-redux"
import { OrderDetailedView, NoOrder } from "@kapture/x"
import { ErrorBoundary, FuseSuspense } from "@kapture/utils"
import { convertOrderDataToOrderDisplay } from "./order.functions"

function DefaultTaggedOrders() {
    const ticketId = useSelector(({ ticketModule }) => ticketModule?.contacts?.selectedContactId)
    const ticketDetails = useSelector(({ ticketModule }) => ticketModule?.contacts?.entities?.[ticketId])
    const taggedOrderDetails = ticketDetails?.orderJson

    // Pass the same orders Structure to the convertOrderDataToOrderDisplay function to get the same UI components
    const { orderConfig, data: orderList } = useMemo(() => {
        const format = {
            selecteditems: taggedOrderDetails?.selecteditems,
            orderDetails: taggedOrderDetails,
        }
        return convertOrderDataToOrderDisplay("default", format, "tagged") ?? {}
    }, [taggedOrderDetails])

    if (Array.isArray(orderList) && orderList.length === 0) {
        return (
            <div className="h-full">
                <NoOrder />
            </div>
        )
    }
    return (
        <ErrorBoundary>
            <FuseSuspense loadingProps={{ message: "Loading tagged order detail..." }}>
                <OrderDetailedView
                    data={orderList?.[0]}
                    disableProductListCheckbox
                    orderDetailConfig={orderConfig?.orderDetailView}
                    isProductFetching={false}
                    renderSource="tagged"
                />
            </FuseSuspense>
        </ErrorBoundary>
    )
}

export default memo(DefaultTaggedOrders)
