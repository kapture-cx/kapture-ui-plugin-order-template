import React, { useCallback, useEffect, useMemo, useState } from "react"

import { store, KaptureAPI, sendNotification, GLOBAL_NOTI_TYPES } from "@kapture/redux-store"
import { FuseSuspense, ErrorBoundary, parseToInt, useTicketOrders } from "@kapture/utils"
import { useSelector } from "react-redux"
import { convertOrderDataToOrderDisplay } from "./order.functions"

const OrderList = React.lazy(() => import("@kapture/x").then(module => ({ default: module.OrderList })))

function DefaultTicketOrders() {
    const [viewingOrderId, setViewingOrderId] = useState(null)
    const [customOrderList, setCustomOrderList] = useState("")

    const ticketId = useSelector(({ ticketModule }) => ticketModule?.contacts?.selectedContactId ?? null)
    const ticketDetails = useSelector(({ ticketModule }) => ticketModule?.contacts?.entities?.[ticketId])
    const customerId = ticketDetails?.referenceId ?? null
    const taskId = ticketDetails?.id ?? null

    const { orders: defaultOrderList, isProductFetching } = useTicketOrders(ticketId, viewingOrderId)

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await KaptureAPI.getOrders(ticketId, { customer_id: customerId })
            setCustomOrderList(response)
        }
        fetchOrders()
    }, [ticketId, customerId])

    const { data: Orderlist, orderConfig } = useMemo(() => {
        const orderDetails = {
            ...(customOrderList || defaultOrderList),
        }

        return convertOrderDataToOrderDisplay("default", orderDetails) ?? {}
    }, [defaultOrderList, customOrderList])

    const handleOrderTag = useCallback(
        compiledOrderDetails => (selectedItems, evt) => {
            evt.stopPropagation()
            let orderDetails = {}
            if (ticketDetails) {
                orderDetails = (customOrderList || defaultOrderList)?.orders?.find(order => String(order.id) === compiledOrderDetails.uniqueId)
                const enquiryId = orderDetails?.enquiryId
                const orderId = parseToInt(compiledOrderDetails?.uniqueId)
                const selectedProducts = defaultOrderList?.genericItemDetails?.[orderId]
                const selectedProduct = selectedProducts?.response?.[enquiryId]?.filter(product => selectedItems.includes(product.id))

                // UNTAG if already tagged.
                if (String(ticketDetails?.orderId) === compiledOrderDetails?.uniqueId) {
                    KaptureAPI.detachOrderFromTicket({ taskId, ticketId, orderId: compiledOrderDetails.uniqueId }, () => {
                        KaptureAPI.updateTicketDetailAPIs(ticketId)
                        store.dispatch(sendNotification("Order UnTagged Successfully!", GLOBAL_NOTI_TYPES.success))
                    })
                }
                // TAG if not tagged.
                else {
                    const reqStruct = {
                        task_id: ticketDetails.id,
                        order_id: compiledOrderDetails.uniqueId,
                        "order-json": JSON.stringify({ selecteditems: [...(selectedProduct ?? [])] }),
                    }
                    KaptureAPI.orderTag(reqStruct, ticketId, () => {
                        KaptureAPI.updateTicketDetailAPIs(ticketId)
                        store.dispatch(sendNotification("Order Tagged Successfully!", GLOBAL_NOTI_TYPES.success))
                    })
                }
            }
        },
        [ticketDetails, defaultOrderList, ticketId, taskId, customOrderList]
    )

    const onOrderExpand = useCallback(
        orderId => {
            if (!orderId) return

            setViewingOrderId(orderId)

            const ordersList = customOrderList || defaultOrderList
            const selectedOrderDetails = ordersList?.orders?.find(order => String(order.id) === orderId)
            const enquiryId = selectedOrderDetails?.enquiryId

            KaptureAPI.getLeadProducts(ticketId, orderId, enquiryId).catch(console.error)
        },
        [customOrderList, defaultOrderList, ticketId]
    )

    return (
        <ErrorBoundary>
            <FuseSuspense loadingProps={{ message: "Loading Orders..." }}>
                <OrderList
                    orderList={Orderlist}
                    orderConfig={orderConfig}
                    onOrderExpand={onOrderExpand}
                    handleTagOrder={handleOrderTag}
                    isProductFetching={isProductFetching}
                    taggedOrderId={String(ticketDetails?.orderId)}
                    isOrderTagging={ticketDetails?.orderTaggingStatus}
                />
            </FuseSuspense>
        </ErrorBoundary>
    )
}

export default DefaultTicketOrders
