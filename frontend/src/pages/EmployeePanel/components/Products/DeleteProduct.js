import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Stack, Form, FloatingLabel, Button, Alert, CloseButton } from 'react-bootstrap';
import axios from 'axios';
import Product from '../../../Home/components/Product/Product';
import Carousels from '../../../../components/UI/Carousel/Carousel';
import LoadingIcon from '../../../../components/LoadingIcon/LoadingIcon';
import AuthContext from '../../../../store/auth-context';

const DeleteProduct = (props) => {
    const authCtx = useContext(AuthContext)
    const authJWT = {
        headers: {
            'Authorization': `Bearer ${authCtx.token}`
        }
    }
    const [products, setProducts] = useState(null)
    const [loading, setLoading] = useState(false)
    const [editProductId, setEditProductId] = useState(null)
    const [editProduct, setEditProduct] = useState(null)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0)

    const [feedback, setFeedback] = useState(null)

    const fetchProducts = async () => {
        await axios.get("http://localhost:8888/api/products", authJWT).then((response) => {
            setProducts(response.data)
        })
        setLoading(true)
    }

    const fetchProduct = async () => {
        await axios.get(`http://localhost:8888/api/products/${editProductId}`, authJWT).then((response) => {
            setEditProduct(response.data)
            setName(response.data.name)
            setDescription(response.data.description)
            setPrice(response.data.price)
        })
    }

    useEffect(() => {
        fetchProducts()
    }, [props.change])

    useEffect(() => {
        fetchProduct()
        setFeedback(null)
    }, [editProductId])

    const deleteProductHandler = async (e) => {
        e.preventDefault();

        await axios.delete(`http://localhost:8888/api/products/${editProductId}`, authJWT).then((response) => {
            props.onChange((prevState) => !prevState)
            if (response.status === 200)
                setFeedback(
                    <Alert variant="success">
                        Przedmiot został usunięty!
                    </Alert>
                )
            else
                setFeedback(
                    <Alert variant="danger">
                        Nie udało się usunąć produktu!
                    </Alert>
                )
        }).catch((e) => {
            console.log(e)
            setFeedback(
                <Alert variant="danger">
                    Nie udało się usunąć produktu!
                </Alert>
            )
        })
    }

    const contextProduct = !loading ? <LoadingIcon /> : products.map((product) =>
        <Col md="auto">
            <Product
                key={product.productId}
                id={product.productId}
                name={product.name}
                price={product.price}
                description={product.description.substr(0, 90)}
                gallery={product.gallery.photos}
                panel={true}
                action="Usuń"
                onId={setEditProductId}
            />
        </Col>
    )

    const contextEditProduct = !editProduct ? <LoadingIcon /> : (
        <Row>
            {feedback}
            <Col xs={12} md={5}>
                <Carousels photos={editProduct.gallery.photos} />
            </Col>
            <Col xs={12} md={7}>
                <Form onSubmit={(e) => deleteProductHandler(e)}>
                    <FloatingLabel className="mb-3" controlId="floatingPassword" label="Nazwa produktu">
                        <Form.Control onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Nazwa produktu" disabled />
                    </FloatingLabel>
                    <p>Producent: {editProduct.producer.nameOfCompany}</p>
                    <hr />
                    <Row>
                        <Col xs={12} md={8}>
                            <FloatingLabel className="mb-3" controlId="floatingTextareaDescription" label="Opis produktu">
                                <Form.Control
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                    disabled
                                    as="textarea"
                                    placeholder="Opis produktu"
                                    style={{ height: '160px' }}
                                />
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} md={4}>
                            <Stack gap={3}>
                                <FloatingLabel controlId="floatingPassword" label="Cena">
                                    <Form.Control onChange={(e) => setPrice(e.target.value)} value={price} type="number" placeholder="Cena" disabled />
                                </FloatingLabel>
                            </Stack>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end">
                        <Button className="ps-4 pe-4" variant="outline-danger" type="submit" disabled={feedback == null ? false : true}>
                            Usuń produkt
                        </Button>
                    </div>
                </Form>
            </Col>
        </Row>
    )

    return (
        <>
            <div className="m-4">
                <Row>
                    <Col xs={10}>
                        <h1>{editProduct ? "Produkt" : "Produkty"}</h1>
                    </Col>
                    <Col xs={1} className="d-flex justify-content-md-end" >
                        {editProduct && <CloseButton onClick={() => { setEditProduct(null); setEditProductId(null); }} />}
                    </Col>
                </Row>

                <hr />
                <Row className="justify-content-md-center">
                    {editProduct ? contextEditProduct : contextProduct}
                </Row>
            </div>

        </>);
}

export default DeleteProduct