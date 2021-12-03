import React, { useState, useEffect } from "react";
import axios from "axios";
import { Col, Row, FloatingLabel, Form, Button } from "react-bootstrap";
import Select from 'react-select';

const AddProduct = () => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0)
    const [amount, setAmount] = useState(0)
    const [category, setCategory] = useState('')
    const [producer, setProducer] = useState('')

    const [optionsCategory, setOptionsCategory] = useState([])
    const [optionsProducer, setOptionsProducer] = useState([])



    const fetchDate = async () => {
        await axios.get("http://localhost:8888/api/categories").then((response) => {
            const optionsC = response.data.map((c) => {
                const opt = { value: c.categoryId, label: c.name}
                return opt
            })
            setOptionsCategory(optionsC)
        })
        await axios.get("http://localhost:8888/api/producers").then((response) => {
            const optionsP = response.data.map((p) => {
                const opt = { value: p.nip, label: p.nameOfCompany}
                return opt
            })
            setOptionsProducer(optionsP)

        })

    }



    useEffect(() => {
        fetchDate()
    }, [])

    const addProductHandler = async (e) => {
        e.preventDefault();

        const newProduct =
        {
            name: name,
            description: description,
            price: price,
            amount: amount,
            category: {
                 name: category,
                discounts: []
            },
            producer: {
                nameOfCompany: producer.label,
                nip: producer.value
            }
        }

        await axios.post(`http://localhost:8888/api/products/save`, newProduct).then((response) => {
            console.log(response.data)
        })
    }

    return (
        <div className="m-3">
            <Form onSubmit={(e) => addProductHandler(e)}>
                <Row className="mb-3">
                    <Form.Group as={Col} xs={12} md={6} controlId="formGridName">
                        <FloatingLabel controlId="floatingPassword" label="Nazwa produktu">
                            <Form.Control onChange={(e) => setName(e.target.value)} type="text" placeholder="Nazwa produktu" />
                        </FloatingLabel>
                    </Form.Group>
                </Row>
                <FloatingLabel className="mb-3" controlId="floatingTextareaDescription" label="Opis produktu">
                    <Form.Control
                        onChange={(e) => setDescription(e.target.value)}
                        as="textarea"
                        placeholder="Opis produktu"
                        style={{ height: '100px' }}
                    />
                </FloatingLabel>
                <Row className="mb-3">
                    <Form.Group as={Col} xs={12} md={6} controlId="formGridPrice">
                        <FloatingLabel controlId="floatingPassword" label="Cena">
                            <Form.Control onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Cena" />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col} xs={12} md={6} controlId="formGridAmount">
                        <FloatingLabel controlId="floatingAmount" label="Ilość">
                            <Form.Control onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Ilość" />
                        </FloatingLabel>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Col xs={6} md={6}>
                        <Select onChange={(e) => setCategory(e.label)} options={optionsCategory} placeholder="Kategoria" />
                    </Col>
                    <Col xs={6} md={6}>
                        <Select onChange={(e) => setProducer(e)} options={optionsProducer} placeholder="Producent" />
                    </Col>
                </Row>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default AddProduct