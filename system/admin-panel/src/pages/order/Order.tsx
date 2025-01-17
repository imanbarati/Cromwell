import { TOrder, TOrderInput, TStoreListItem } from '@cromwell/core';
import { getCStore, getGraphQLClient } from '@cromwell/core-frontend';
import {
    ArrowBack as ArrowBackIcon,
    DeleteForever as DeleteForeverIcon,
    WarningRounded as WarningRoundedIcon,
} from '@mui/icons-material';
import { Autocomplete, Button, Grid, IconButton, Skeleton, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { toast } from '../../components/toast/toast';
import { orderStatuses } from '../../constants/order';
import { orderListPageInfo, productPageInfo } from '../../constants/PageInfos';
import { NumberFormatCustom } from '../../helpers/NumberFormatCustom';
import commonStyles from '../../styles/common.module.scss';
import styles from './Order.module.scss';

const OrderPage = () => {
    const { id: orderId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [data, setData] = useState<TOrder | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [cart, setCart] = useState<TStoreListItem[]>([]);
    const [cartLoading, setCartLoading] = useState<boolean>(false);
    const [orderLoading, setOrderLoading] = useState<boolean>(false);
    const cstore = getCStore();

    const getOrderData = async () => {
        let orderData: TOrder;
        setOrderLoading(true);
        setCartLoading(true);
        try {
            orderData = await client.getOrderById(orderId);
            if (orderData) {
                setData(orderData);
                updateCart(orderData.cart);
            }
        } catch (e) {
            console.error(e)
        }
        setOrderLoading(false);
        setCartLoading(false);

        if (!orderData) {
            setNotFound(true);
        }
    }

    const updateCart = async (oldCart: TOrder['cart']) => {
        if (typeof oldCart === 'string') {
            try {
                oldCart = JSON.parse(oldCart);
            } catch (e) { console.error(e); }
        }
        if (!Array.isArray(oldCart) || oldCart.length === 0) {
            setCart([]);
            return;
        }
        oldCart.forEach(product => cstore.addToCart(product));
        setCartLoading(true);

        await cstore.updateCart();
        const cart = cstore.getCart();
        setCart(cart);
        setCartLoading(false);
    }

    const handleDeleteFromCart = (item: TStoreListItem) => {
        cstore.removeFromCart(item);
        setCart(cstore.getCart());
    }

    useEffect(() => {
        cstore.clearCart();

        getOrderData();

        return () => {
            cstore.clearCart();
        }
    }, []);

    const handleSave = async () => {
        if (data) {
            const inputData: TOrderInput = {
                status: data.status,
                cart: JSON.stringify(cart),
                orderTotalPrice: data.orderTotalPrice,
                cartTotalPrice: data.cartTotalPrice,
                cartOldTotalPrice: data.cartOldTotalPrice,
                shippingPrice: data.shippingPrice,
                totalQnt: data.totalQnt,
                userId: data.userId,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                customerEmail: data.customerEmail,
                customerAddress: data.customerAddress,
                customerComment: data.customerComment,
                shippingMethod: data.shippingMethod,
                paymentMethod: data.paymentMethod,
                currency: data.currency,
            }
            try {
                await client?.updateOrder(data.id, inputData);
                await getOrderData();
                toast.success('Saved!');
            } catch (e) {
                toast.error('Failed to save');
                console.error(e)
            }
        }
    }

    const handleInputChange = (prop: keyof TOrder, val: any) => {
        if (data) {
            setData((prevData) => {
                const newData = Object.assign({}, prevData);
                (newData[prop] as any) = val;
                return newData;
            });
        }
    }

    if (notFound) {
        return (
            <div className={styles.OrderPage}>
                <div className={styles.notFoundPage}>
                    <p className={styles.notFoundText}>Post not found</p>
                </div>
            </div>
        )
    }

    const cartInfo = cstore.getCartTotal();
    const cartNewTotal = cartInfo.total;
    const orderTotalPriceRecalc = (data?.cartTotalPrice ?? 0) + (data?.shippingPrice ?? 0);

    return (
        <div className={styles.OrderPage}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link to={orderListPageInfo.route}>
                        <IconButton
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Link>
                    <p className={commonStyles.pageTitle}>order</p>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="small"
                        onClick={handleSave}>Update</Button>
                </div>
            </div>
            <div className={styles.content}>

                <div className={styles.fields}>
                    {orderLoading && (
                        Array(8).fill(1).map((it, index) => (
                            <Skeleton style={{ marginBottom: '10px' }} key={index} height={"50px"} />
                        ))
                    )}
                    {!orderLoading && (
                        <>
                            <Autocomplete
                                value={data?.status ?? orderStatuses[0]}
                                onChange={(event: any, newValue: string | null) => {
                                    handleInputChange('status', newValue);
                                }}
                                classes={{ paper: styles.popper }}
                                options={orderStatuses}
                                getOptionLabel={(option) => option}
                                className={styles.textField}
                                fullWidth
                                style={{ width: 300 }}
                                renderInput={(params) => <TextField {...params}
                                    label="Status"
                                    variant="standard"
                                    fullWidth
                                />}
                            />
                            <TextField label="Name"
                                value={data?.customerName || ''}
                                fullWidth
                                variant="standard"
                                className={styles.textField}
                                onChange={(e) => { handleInputChange('customerName', e.target.value) }}
                            />
                            <TextField label="Phone"
                                value={data?.customerPhone || ''}
                                fullWidth
                                variant="standard"
                                className={styles.textField}
                                onChange={(e) => { handleInputChange('customerPhone', e.target.value) }}
                            />
                            <TextField label="Email"
                                value={data?.customerEmail || ''}
                                fullWidth
                                variant="standard"
                                className={styles.textField}
                                onChange={(e) => { handleInputChange('customerEmail', e.target.value) }}
                            />
                            <TextField label="Address"
                                value={data?.customerAddress || ''}
                                fullWidth
                                variant="standard"
                                className={styles.textField}
                                onChange={(e) => { handleInputChange('customerAddress', e.target.value) }}
                            />
                            <TextField label="Comment"
                                value={data?.customerComment || ''}
                                fullWidth
                                variant="standard"
                                className={styles.textField}
                                onChange={(e) => { handleInputChange('customerComment', e.target.value) }}
                            />
                            <TextField label="Payment method"
                                disabled
                                value={data?.paymentMethod}
                                fullWidth
                                variant="standard"
                                className={styles.textField}
                            />
                            <TextField label="Shipping method"
                                disabled
                                value={data?.shippingMethod}
                                fullWidth
                                variant="standard"
                                className={styles.textField}
                            />
                            <TextField label="Shipping price"
                                value={data?.shippingPrice ?? 0}
                                className={styles.textField}
                                variant="standard"
                                onChange={(e) => {
                                    let newPrice = parseInt(e.target.value);
                                    if (isNaN(newPrice)) newPrice = 0;
                                    handleInputChange('shippingPrice', newPrice);
                                }}
                                fullWidth
                                InputProps={{
                                    inputComponent: NumberFormatCustom as any,
                                }}
                            />
                            <TextField label="Created"
                                value={toLocaleDateString(data?.createDate)}
                                fullWidth
                                variant="standard"
                                className={styles.textField}
                            />
                            <TextField label="Last updated"
                                value={toLocaleDateString(data?.updateDate)}
                                fullWidth
                                variant="standard"
                                className={styles.textField}
                            />
                        </>
                    )}
                </div>
                <div className={styles.sums}>
                    {!cartLoading && data && (
                        <>
                            <p>Cart total: <b>{cstore.getPriceWithCurrency(data.cartTotalPrice)}</b></p>
                            <p>Shipping: <b>{cstore.getPriceWithCurrency(data.shippingPrice ?? 0)}</b></p>
                            <p>{data.orderTotalPrice != orderTotalPriceRecalc ? 'Initial ' : ''}Order total: <b>{cstore.getPriceWithCurrency(data.orderTotalPrice ?? 0)}</b></p>
                            {data.orderTotalPrice != orderTotalPriceRecalc && (
                                <p>Order total: <b>{cstore.getPriceWithCurrency(orderTotalPriceRecalc)}</b></p>
                            )}
                            {(cartNewTotal !== data.cartTotalPrice) && (
                                <div className={styles.totalChangedBlock}>
                                    <div className={styles.totalChangedWarning}>
                                        <WarningRoundedIcon />
                                        <p style={{ margin: '0 0 0 5px' }}>Price has changed for some products since this order was created!</p>
                                    </div>
                                    <p>Updated cart total: <b>{cstore.getPriceWithCurrency(cartNewTotal)}</b></p>
                                    <p>Updated order total: <b>{cstore.getPriceWithCurrency(cartNewTotal + (data.shippingPrice ?? 0))}</b></p>
                                </div>
                            )}
                        </>
                    )}
                    {cartLoading && (
                        Array(4).fill(1).map((it, index) => (
                            <Skeleton style={{ marginBottom: '3px' }} key={index} height={"20px"} />
                        ))
                    )}
                </div>
                <div className={styles.cart}>
                    {!cartLoading && cart.map((it, i) => {
                        const product = it.product;
                        const checkedAttrKeys = Object.keys(it.pickedAttributes || {});
                        if (product) {
                            const productLink = `${productPageInfo.baseRoute}/${product.id}`;
                            return (
                                <Grid key={i} className={styles.cartItem} container>
                                    <Grid item xs={3} className={styles.itemBlock}>
                                        <Link to={productLink}>
                                            <img src={product.mainImage} className={styles.mainImage} />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={3} className={styles.itemBlock}>
                                        <Link to={productLink} className={styles.productName}>{product.name}</Link>
                                        <div className={styles.priceBlock}>
                                            {(product?.oldPrice !== undefined && product?.oldPrice !== null) && (
                                                <p className={styles.oldPrice}>{cstore.getPriceWithCurrency(product.oldPrice)}</p>
                                            )}
                                            <p className={styles.price}>{cstore.getPriceWithCurrency(product?.price)}</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={3} className={styles.itemBlock}>
                                        {checkedAttrKeys.map(key => {
                                            const vals = it.pickedAttributes ? it.pickedAttributes[key] : [];
                                            const valsStr = vals.join(', ');
                                            return <p key={key}>{key}: {valsStr}</p>
                                        })}
                                    </Grid>
                                    <Grid item xs={2} className={styles.itemBlock}>
                                        <p>Qty: {it.amount}</p>
                                    </Grid>
                                    <Grid item xs={1} className={styles.itemBlock} style={{ marginLeft: 'auto', paddingRight: '0px' }}>
                                        <div>
                                            <IconButton
                                                aria-label="Delete"
                                                onClick={() => { handleDeleteFromCart(it); }}
                                            >
                                                <DeleteForeverIcon />
                                            </IconButton>
                                        </div>
                                    </Grid>
                                </Grid>
                            )
                        }
                    })}
                    {cartLoading && (
                        Array(2).fill(1).map((it, index) => (
                            <Skeleton style={{ margin: '0 20px 5px 20px' }} key={index} height={"60px"} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}


export default OrderPage;

const toLocaleDateString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
