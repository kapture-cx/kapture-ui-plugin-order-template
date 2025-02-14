import React from "react"
import { OrderConfig, OrderDataType, OrderListItemType, OrderListCard, OtherOrderCard, OrderProductListType } from "@kapture/redux-store"
import { DetailsView } from "@kapture/x"
import { Icon } from "@material-ui/core"
import moment from "moment"

export function convertOrderDataToOrderDisplay(partnerKey: string, rawOrderData: any, variant: "orders" | "tagged" = "orders"): OrderDataType | null {
    try {
        if (!rawOrderData) {
            return null
        }

        const DateFormat = "dddd, MMMM D, YYYY h:mm A"
        const { orders: orderList, selecteditems } = rawOrderData ?? {}

        if (orderList && Array.isArray(orderList)) {
            const orderListDetailConfig: OrderConfig["orderListView"]["orderDetail"] = {
                // TODO: Add the details config for the order list view
                detailsConfig: [
                    {
                        icon: <Icon fontSize="small">person</Icon>,
                        key: "Name",
                    },
                    {
                        icon: <Icon fontSize="small">pageview</Icon>,
                        key: "enquiryId",
                    },
                    {
                        icon: <Icon fontSize="small">person</Icon>,
                        key: "erpOrderId",
                    },
                    {
                        icon: <Icon fontSize="small">date_range</Icon>,
                        key: "orderDate",
                    },
                    {
                        icon: <Icon fontSize="small">person</Icon>,
                        key: "orderStatus",
                    },
                    {
                        icon: <Icon fontSize="small">call</Icon>,
                        key: "phone",
                    },
                    {
                        icon: <Icon fontSize="small">email</Icon>,
                        key: "email",
                    },
                ],
            }

            const ProductListConfig: OrderConfig["orderDetailView"]["productListConfig"] = {
                primaryKey: "id",
                showAllColumns: true,
                columns: [
                    // TODO: Add the product list config for inside the order detail view
                    {
                        title: "Name",
                        columnKey: "name",
                    },
                    {
                        title: "Quantity",
                        columnKey: "quantity",
                    },
                    {
                        title: "Rate",
                        columnKey: "rate",
                    },
                    {
                        title: "Total",
                        columnKey: "productAmt",
                    },
                ],

                getOrderProductDetail: row => {
                    const { name, leadProductParentName, quantity, rate, productAmt } = row
                    // TODO: OnClick of Product, open the product detail view
                    const productData = {
                        name,
                        leadProductParentName,
                        quantity,
                        rate,
                        productAmount: productAmt,
                    }

                    return (
                        <div className="bg-grey-100">
                            <DetailsView details={productData} columnsCount="3" labelPlacement="top" />
                        </div>
                    )
                },
            }

            const orderConfig: OrderConfig = {
                orderListView: {
                    orderDetail: orderListDetailConfig,
                },
                orderDetailView: {
                    productListConfig: ProductListConfig,
                },
            }

            const data: OrderDataType["data"] = orderList.map((orderData): OrderListItemType => {
                const { id, enquiryId, createDate, erpOrderId, deliveryStatus } = orderData ?? {}

                let productList: OrderListItemType["productList"] = null
                const productDetails = variant === "tagged" ? selecteditems : rawOrderData?.genericItemDetails?.[orderData.id]?.response?.[enquiryId]

                const totalPrice = {
                    total: 0,
                }

                if (productDetails && Array.isArray(productDetails)) {
                    // TODO: Define/Add the product list config for inside the order detail view
                    productList = productDetails.map((_product: any): OrderProductListType => {
                        totalPrice.total += _product.rate
                        return {
                            id: _product?.id,
                            name: _product?.name,
                            quantity: _product?.quantity,
                            rate: _product?.rate,
                            productAmt: _product?.productAmt,
                        }
                    })
                }

                // TODO: Define/Add the order list cards config for inside the order list view
                const orderListCards: OrderListCard = {
                    enquiryId,
                    orderId: String(id),
                    price: totalPrice.total,
                    orderDate: moment(createDate).format(DateFormat),
                    orderStatus: deliveryStatus,
                    erpOrderId,
                }

                const OrderDetails = orderData

                // TODO: Define/Add the order details config for inside the order detail view
                const otherOrderCard: OtherOrderCard = {
                    title: "Order Details",
                    data: OrderDetails,
                    config: {
                        columnsCount: 3,
                        labelPlacement: "top",
                    },
                }

                const isOrderDetails = OrderDetails && Object.keys(OrderDetails).length > 0
                const otherCards: { [key: string]: OtherOrderCard } = { otherOrderCard }
                let filteredOtherCards: OtherOrderCard[] = []
                Object.keys(otherCards).forEach((otherCardKey: string) => {
                    if (isOrderDetails && otherCards[otherCardKey] === otherOrderCard) {
                        filteredOtherCards = [...filteredOtherCards, otherCards[otherCardKey]]
                    }
                })

                return {
                    uniqueId: String(id),
                    orderListCards,
                    productList,
                    totalAmount: totalPrice.total,
                    otherOrderCards: filteredOtherCards,
                }
            })

            return { data, orderConfig }
        }
        return null
    } catch (error) {
        console.error("Error in convertOrderDataToOrderDisplay", error)
        return null
    }
}
