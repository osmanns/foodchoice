import React, { useState, useEffect, Component  } from 'react';
import { Link, useHistory, useParams } from "react-router-dom"
import Axios from "axios"
import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import Barcode from "react-hooks-barcode"
import $ from 'jquery';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { Form, Input, Button, Radio, Select, Checkbox, Cascader, DatePicker, InputNumber, TreeSelect, Switch, Space, AutoComplete, Tooltip } from 'antd';
import { Row, Col, Upload, Modal, Image, Carousel, Affix, Tabs } from 'antd';
import 'antd/dist/antd.css';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { makeStyles } from '@material-ui/core';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';

import "../components/styles/foodchoiceStyle.css"

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
};

const tailLayout = {
    wrapperCol: { offset: 5, span: 19 },
};

const useStyles = makeStyles(theme => ({
    containerImage: {
        // padding: theme.spacing(2),
        backgroundColor: '#e8eaf6',
    },
}))

const config = {
    width: 2,
    height: 70,
    format: "CODE128",
    displayValue: true,
    fontOptions: "",
    font: "monospace",
    textAlign: "center",
    textPosition: "bottom",
    textMargin: 2,
    fontSize: 15,
    background: "#ffffff",
    lineColor: "#000000",
    margin: 5,
    marginTop: undefined,
    marginBottom: undefined,
    marginLeft: undefined,
    marginRight: undefined
};

const initialValues = {
    FDA_NO: '',
    BRAND: '',
    NAME: '',
    GROUP_ID: '',
    PACKAGE_UNIT_ID: '',
    TOTAL_WEIGHT: '',
    TYPE_OF_LABEL: 0,
    COUNT_PER_ONE_PORTION: '',
    COUNT_OF_PORTION: '',
    WEIGHT_PER_PORTION: '',
    COUNT_PORTION_LABEL: 0,
    COUNT_PORTION: '',
    CAL: '',
    CALFAT: '',
    FAT: '',
    FAT_PERSENTAGE: '',
    SATURATED_FAT: '',
    SATURATED_FAT_PERSENTAGE: '',
    PRE_CHOLESTEROL: "=",
    CHOLESTEROL: '',
    CHOLESTEROL_PERSENTAGE: '',
    PRE_PROTEIN: "=",
    PROTEIN: '',
    PRE_CARBOHYDRATE: "=",
    CARBOHYDRATE: '',
    CARBOHYDRATE_PERSENTAGE: '',
    PRE_FIBER: "=",
    FIBER: '',
    FIBER_PERSENTAGE: '',
    PRE_SUGAR: "=",
    SUGAR: '',
    SODIUM: '',
    SODIUM_PERSENTAGE: '',
    PRE_VIT_A: "=",
    VIT_A: '',
    PRE_VIT_B1: "=",
    VIT_B1: '',
    PRE_VIT_B2: "=",
    VIT_B2: '',
    PRE_CALCIUM: "=",
    CALCIUM: '',
    PRE_IRON: "=",
    IRON: '',
    PRE_VIT_C: "=",
    VIT_C: '',
    OTHER_NUTRIENT_NAME: [],
    MONOUNSATURATED_FAT: '',
    MONOUNSATURATED_FAT_PERSENTAGE: '',
    POLYUNSATURATED_FAT: '',
    POLYUNSATURATED_FAT_PERSENTAGE: '',
    TRANS_FAT: '',
    TRANS_FAT_PERSENTAGE: '',
    COMPONENT: 0,
    SUGAR_ADD: '',
    COMPONENT_NAME: [],
    ALLERGY_OF_LABEL: 0,
    COLOR: [],
    PRESERVATIVE: [],
    SWEETENER: [],
    ACIDITY_REGULATOR: [],
    ANTICAKING_AGENT: [],
    ANTIFOAMING_AGENT: [],
    ANTIOXIDANT: [],
    BLEACHING_AGENT: [],
    BULKING_AGENT: [],
    CARBONATING_AGENT: [],
    CARRIER: [],
    COLOUR_RETENTION_AGENT: [],
    EMULSIFIER: [],
    EMULSIFYING_SALT: [],
    FIRMING_AGENT: [],
    FLAVOUR_ENHANCER: [],
    FLOUR_TREATMENT_AGENT: [],
    FOAMING_AGENT: [],
    GELLING_AGENT: [],
    GLAZING_AGENT: [],
    HUMECTANT: [],
    PACKAGING_GAS: [],
    PROPELLANT: [],
    RAISING_AGENT: [],
    SEQUESTRANT: [],
    STABILIZER: [],
    THICKNER: [],
    ADDITIVES_OTHER: [],
    ALLERGY_NAME_LABEL: 0,
    ALLERGY_GLUTEN: [],
    ALLERGY_CRUSTACEAN: [],
    ALLERGY_EGG: [],
    ALLERGY_FISH: [],
    ALLERGY_PEANUT: [],
    ALLERGY_MILK: [],
    ALLERGY_NUTS: [],
    ALLERGY_SULFITE: [],
    ALLERGY_OTHER: [],
    GDA: 0,
    PRESENT_LABEL: 0,
    PRESENT_BOX1: 0,
    PRESENT_BOX2: 0,
    PRESENT_NAME: [],
    QUOTE_LABEL: 0,
    QUOTE_NAME: [],
    FOREIGN_COUNTRY: 0,
    MADE_FROM: '',
    IMPORTER: '',
    DISTRIBUTE: '',
}
const { Option } = Select;

export default function FoodchoiceAddForm() {

    const [optionFoodGroup, setOptionFoodGroup] = useState([]) // ประเภทอาหาร (FoodGroup)
    const [optionPackageUnit, setOptionPackageUnit] = useState([]) // หน่วยบรรจุภัณฑ์ (PackageUnit)
    const [optionComponent, setOptionComponent] = useState([]) // หน่วยบรรจุภัณฑ์ (PackageUnit)

    useEffect(async () => {
        const getFoodgroup = await Axios.get('https://foodnew.kaseamsanth.xyz/api/group');
        setOptionFoodGroup(getFoodgroup.data)

        const getFoodgroupSub = await Axios.get('https://foodnew.kaseamsanth.xyz/api/package');
        setOptionPackageUnit(getFoodgroupSub.data)
    }, [])

    useEffect(async () => {
        getComponentName()
    }, [])
    const getComponentName = async () => {
        const response = await Axios.get('https://foodnew.kaseamsanth.xyz/api/ingredients?search_data=', { 
            data: { COMPONENT_NAME: values.COMPONENT_NAME }
        }).then((response) => {
            setOptionComponent(response.data)
        }).catch((error) => {
            console.log("error", error)
        });
    } 

    const { products_per_serving_id } = useParams()
    const [values, setValues] = useState(initialValues)
    const [barcode, setBarcode] = useState()
    const [component, setComponent] = useState({ data: [], value: "", component_group: 0 })
    const children = [];
    const [top, setTop] = useState(10);
    // const options = optionComponent.map(val => <Option key={val.id} value={val.name} name={val.name} component={val.component_group_id}>{val.name}</Option>);

    useEffect(() => {
        getItems()
    }, [])
    const getItems = async () => {
        const response = await Axios.get(`https://foodnew.kaseamsanth.xyz/api/products/${products_per_serving_id}`, {
            headers: {'Content-Type': 'application/json'}
        }).then((response) => {
            var barcodeID = response.data[0].barcode_id
            setBarcode(barcodeID)
            console.log(response.data)
        }).catch((error) => {
            console.log("error", error)
        })
    } 

    const [images, setImages] = useState([])
    useEffect(async () => {
        // const response = await Axios.get(`http://localhost:3001/api/foodchoicedb/${products_per_serving_id}`, {
        //     headers: {'Content-Type': 'application/json'}
        // }).then((response) => {
        //     console.log(response.data)
        //     const barcode_ID = Axios.get('http://localhost:3001/api/image/'+response.data[0].barcode_id, {
        //     }).then((response) => {
        //         console.log(response.data)
        //         setImages(response.data)
        //     }).catch((error) => {
        //         console.log("error", error)
        //     })
        // }).catch((error) => {
        //     console.log("error", error)
        // })
    }, [])

    const handleComponentGroup = (value) => {  
        setComponent({ value });
        console.log(value)
        console.log(component)
        // console.log(component.component_name)  
    }  
    
    const handleInputChange = (e) => {
        const { name, value } = e.target
        // setValues({...values, [name]: value})
        setValues({...values,[e.target.name] : e.target.value}) 
        console.log(values)
    }

    // Submit
    const history = useHistory()
    const onFinish = (values) => {
        console.log('Success:', values);

        if(values.PRESENT_BOX1 === true){
            values.PRESENT_BOX1 = 1
            var prebox1 = values.PRESENT_BOX1
        }
        else if(values.PRESENT_BOX1 === false){
            values.PRESENT_BOX1 = 0
            var prebox1 = values.PRESENT_BOX1
        }
        if(values.PRESENT_BOX2 === true){
            values.PRESENT_BOX2 = 1
            var prebox2 = values.PRESENT_BOX2
        }
        else if(values.PRESENT_BOX2 === false){
            values.PRESENT_BOX2 = 0
            var prebox2 = values.PRESENT_BOX2
        }
        
        var body = { 
            FDA_NO: values.FDA_NO,
            BRAND: values.BRAND,
            NAME: values.NAME,
            GROUP_ID: values.GROUP_ID,
            PACKAGE_UNIT_ID: values.PACKAGE_UNIT_ID,
            TOTAL_WEIGHT: values.TOTAL_WEIGHT,
            TYPE_OF_LABEL: values.TYPE_OF_LABEL,
            COUNT_PER_ONE_PORTION: values.COUNT_PER_ONE_PORTION,
            COUNT_OF_PORTION: values.COUNT_OF_PORTION,
            WEIGHT_PER_PORTION: values.WEIGHT_PER_PORTION,
            COUNT_PORTION_LABEL: values.COUNT_PORTION_LABEL,
            COUNT_PORTION: values.COUNT_PORTION,
            CAL: values.CAL,
            CALFAT: values.CALFAT,
            FAT: values.FAT,
            FAT_PERSENTAGE: values.FAT_PERSENTAGE,
            SATURATED_FAT: values.SATURATED_FAT,
            SATURATED_FAT_PERSENTAGE: values.SATURATED_FAT_PERSENTAGE,
            PRE_CHOLESTEROL: values.PRE_CHOLESTEROL,
            CHOLESTEROL: values.CHOLESTEROL,
            CHOLESTEROL_PERSENTAGE: values.CHOLESTEROL_PERSENTAGE,
            PRE_PROTEIN: values.PRE_PROTEIN,
            PROTEIN: values.PROTEIN,
            PRE_CARBOHYDRATE: values.PRE_CARBOHYDRATE,
            CARBOHYDRATE: values.CARBOHYDRATE,
            CARBOHYDRATE_PERSENTAGE: values.CARBOHYDRATE_PERSENTAGE,
            PRE_FIBER: values.PRE_FIBER,
            FIBER: values.FIBER,
            FIBER_PERSENTAGE: values.FIBER_PERSENTAGE,
            PRE_SUGAR: values.PRE_SUGAR,
            SUGAR: values.SUGAR,
            SODIUM: values.SODIUM,
            SODIUM_PERSENTAGE: values.SODIUM_PERSENTAGE,
            PRE_VIT_A: values.PRE_VIT_A,
            VIT_A: values.VIT_A,
            PRE_VIT_B1: values.PRE_VIT_B1,
            VIT_B1: values.VIT_B1,
            PRE_VIT_B2: values.PRE_VIT_B2,
            VIT_B2: values.VIT_B2,
            PRE_CALCIUM: values.PRE_CALCIUM,
            CALCIUM: values.CALCIUM,
            PRE_IRON: values.PRE_IRON,
            IRON: values.IRON,
            PRE_VIT_C: values.PRE_VIT_C,
            VIT_C: values.VIT_C,
            OTHER_NUTRIENT_NAME: values.OTHER_NUTRIENT_NAME,
            MONOUNSATURATED_FAT: values.MONOUNSATURATED_FAT,
            MONOUNSATURATED_FAT_PERSENTAGE: values.MONOUNSATURATED_FAT_PERSENTAGE,
            POLYUNSATURATED_FAT: values.POLYUNSATURATED_FAT,
            POLYUNSATURATED_FAT_PERSENTAGE: values.POLYUNSATURATED_FAT_PERSENTAGE,
            TRANS_FAT: values.TRANS_FAT,
            TRANS_FAT_PERSENTAGE: values.TRANS_FAT_PERSENTAGE,
            COMPONENT: values.COMPONENT,
            SUGAR_ADD: values.SUGAR_ADD,
            COMPONENT_NAME: values.COMPONENT_NAME,
            ALLERGY_OF_LABEL: values.ALLERGY_OF_LABEL,
            COLOR: values.COLOR,
            PRESERVATIVE: values.PRESERVATIVE,
            SWEETENER: values.SWEETENER,
            ACIDITY_REGULATOR: values.ACIDITY_REGULATOR,
            ANTICAKING_AGENT: values.ANTICAKING_AGENT,
            ANTIFOAMING_AGENT: values.ANTIFOAMING_AGENT,
            ANTIOXIDANT: values.ANTIOXIDANT,
            BLEACHING_AGENT: values.BLEACHING_AGENT,
            BULKING_AGENT: values.BULKING_AGENT,
            CARBONATING_AGENT: values.CARBONATING_AGENT,
            CARRIER: values.CARRIER,
            COLOUR_RETENTION_AGENT: values.COLOUR_RETENTION_AGENT,
            EMULSIFIER: values.EMULSIFIER,
            EMULSIFYING_SALT: values.EMULSIFYING_SALT,
            FIRMING_AGENT: values.FIRMING_AGENT,
            FLAVOUR_ENHANCER: values.FLAVOUR_ENHANCER,
            FLOUR_TREATMENT_AGENT: values.FLOUR_TREATMENT_AGENT,
            FOAMING_AGENT: values.FOAMING_AGENT,
            GELLING_AGENT: values.GELLING_AGENT,
            GLAZING_AGENT: values.GLAZING_AGENT,
            HUMECTANT: values.HUMECTANT,
            PACKAGING_GAS: values.PACKAGING_GAS,
            PROPELLANT: values.PROPELLANT,
            RAISING_AGENT: values.RAISING_AGENT,
            SEQUESTRANT: values.SEQUESTRANT,
            STABILIZER: values.STABILIZER,
            THICKNER: values.THICKNER,
            ADDITIVES_OTHER: values.ADDITIVES_OTHER,
            ALLERGY_NAME_LABEL: values.ALLERGY_NAME_LABEL,
            ALLERGY_GLUTEN: values.ALLERGY_GLUTEN,
            ALLERGY_CRUSTACEAN: values.ALLERGY_CRUSTACEAN,
            ALLERGY_EGG:values.ALLERGY_EGG,
            ALLERGY_FISH: values.ALLERGY_FISH,
            ALLERGY_PEANUT: values.ALLERGY_PEANUT,
            ALLERGY_MILK: values.ALLERGY_MILK,
            ALLERGY_NUTS: values.ALLERGY_NUTS,
            ALLERGY_SULFITE: values.ALLERGY_SULFITE,
            ALLERGY_OTHER: values.ALLERGY_OTHER,
            GDA: values.GDA,
            PRESENT_LABEL: values.PRESENT_LABEL,
            PRESENT_BOX1: prebox1,
            PRESENT_BOX2: prebox2,
            PRESENT_NAME: values.PRESENT_NAME,
            QUOTE_LABEL: values.QUOTE_LABEL,
            QUOTE_NAME: values.QUOTE_NAME,
            FOREIGN_COUNTRY: values.FOREIGN_COUNTRY,
            MADE_FROM: values.MADE_FROM,
            IMPORTER: values.IMPORTER,
            DISTRIBUTE: values.DISTRIBUTE,
        }
        console.log(body)

        // Axios.post('http://localhost:3001/api/addfoodchoice', body, {
        // Axios.post('https://foodnew.kaseamsanth.tk/api/products', body, {
        Axios.post(`https://foodnew.kaseamsanth.xyz/api/products/${products_per_serving_id}`, body, {
            headers: {'Content-Type': 'application/json'}
        }).then((response) => {
            console.log(response.data)
        })
        history.push("/Foodchoice")
    };

    // Handel Image 
    const [tag, setTag] = useState(0)
    const [filterImages, setFilterImages] = useState([])
    const [selectedImg, setSelectedImg] = useState([filterImages[0]])
    useEffect( () => {
        tag == 0 ? setFilterImages(images) : setFilterImages(images.filter(image => image.group == tag))
    }, [tag])
    const TagButton = ({ group, name, handlesettag }) => {
        return <Button onClick={ () => handlesettag(group)}>{ name.toUpperCase() }</Button>
    }
    $( document ).ready(function() {
        let buttonLeft = document.getElementById('slideLeft')
        let buttonRight = document.getElementById('slideRight')

        buttonLeft.addEventListener('click', function(){
            document.getElementById('slider').scrollLeft -= 20
        })
        buttonRight.addEventListener('click', function(){
            document.getElementById('slider').scrollLeft += 20
        })
    });

    return (
            <Row className="container">
                <Col className="container-info" span={8}>
                <Affix offsetTop={top}>
                    <div className="barcode-box">
                        <Barcode value={values.barcode_id} {...config} />
                    </div>
                    
                    <div handlesettag={setTag}>
                        <Row>
                            <TagButton group={1} name="ด้านหน้าผลิตภัณฑ์" handlesettag={setTag} />
                            <TagButton group={2} name="ข้อมูลโภชนาการ" handlesettag={setTag}/>
                            <TagButton group={3} name="ส่วนประกอบโดยประมาณ" handlesettag={setTag}/>
                            <TagButton group={4} name="เลขที่ อย. 13 หลัก" handlesettag={setTag}/>
                        </Row>

                        <div className="containerImage">
                            <div className="imageSelect">
                                {/* <img src={selectedImg} alt="" className="selected"/> */}
                                <TransformWrapper>
                                    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                    <React.Fragment>
                                        <TransformComponent>
                                            <img src="https://picsum.photos/200" alt="" className="selected"/>
                                        </TransformComponent>
                                        <div className="tools-image">
                                            <ZoomInIcon className="tools-image-zoom" onClick={() => zoomIn()}>+</ZoomInIcon>
                                            <ZoomOutIcon className="tools-image-zoom" onClick={() => zoomOut()}>-</ZoomOutIcon>
                                            <ZoomOutMapIcon className="tools-image-zoom" onClick={() => resetTransform()}>x</ZoomOutMapIcon>
                                        </div>
                                    </React.Fragment>
                                    )}
                                </TransformWrapper>
                            </div>
                            <div className="imageBox" >
                            <ArrowBackIosIcon id="slideLeft" className="arrow"/>
                                <div id="slider" className="imageBoxSlider" >
                                    <img src="https://picsum.photos/200" alt=""/>
                                    <img src="https://picsum.photos/200" alt=""/>
                                    <img src="https://picsum.photos/200" alt=""/>
                                    <img src="https://picsum.photos/200" alt=""/>
                                    <img src="https://picsum.photos/200" alt=""/>
                                    <img src="https://picsum.photos/200" alt=""/>

                                {filterImages.map((img, index) => (
                                    <img 
                                        style={{ border: selectedImg === img.img_name ? "2px solid black" : ""}} 
                                        key={index} 
                                        src={img.img_name} 
                                        alt="" 
                                        onClick={() => setSelectedImg(img.img_name)}
                                    />
                                ))}
                                </div>
                            <ArrowForwardIosIcon id="slideRight" className="arrow"/>
                            </div>
                        </div>
                    </div>        
                    </Affix>
                </Col>
                <Col className="container-form" span={16}>
                <Form 
                        {...layout} 
                        onFinish={onFinish}
                        initialValues={initialValues}
                    >
                        <div className="container-form-infomation">
                            <div className="container-form-subtitile">
                                <label htmlFor="">ข้อมูลผลิตภัณฑ์</label>
                                <hr className="line" />
                            </div>

                            <Form.Item className="form-input" name="FDA_NO" label="รหัส อย." required rules={[{ required: true, message: 'กรุณาใส่รหัส อย.' }]}>
                                <Input 
                                    autoComplete="off"
                                />
                            </Form.Item>
                            <Form.Item className="form-input" name="BRAND" label="ตราสินค้า" required rules={[{ required: true, message: 'กรุณาใส่ตราสินค้า' }]}>
                                <Input 
                                    autoComplete="off"
                                />
                            </Form.Item>
                            <Form.Item className="form-input" name="NAME" label="ชื่อสินค้า" required rules={[{ required: true, message: 'กรุณาใส่ชื่อสินค้า' }]}>
                                <Input 
                                    autoComplete="off"
                                />
                            </Form.Item>
                            <Form.Item className="form-select" name="GROUP_ID" label="กลุ่มอาหาร" required>
                                <Select allowClear>
                                    {optionFoodGroup.map((val) => (
                                        <Option key={val.GROUP_ID} value={val.Group_ID}>
                                            {val.sub_name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item className="form-select" name="PACKAGE_UNIT_ID" label="หน่วยบรรจุภัณฑ์" required>
                                <Select allowClear>
                                    {optionPackageUnit.map((val) => (
                                        <option key={val.PACKAGE_UNIT_ID} value={val.PACKAGE_UNIT_ID}>
                                            {val.UNIT_DESC}
                                        </option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item className="form-input" name="TOTAL_WEIGHT" label="น้ำหนักสุทธิ" required rules={[{ required: true, message: 'กรุณาใส่น้ำหนักสุทธิ' }]}>
                                <Input 
                                    autoComplete="off"
                                    onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}
                                />
                            </Form.Item>
                        </div>

                        <div className="container-form-nutrition">
                            <div className="container-form-subtitile">
                                <label htmlFor="">ข้อมูลโภชนาการ</label>
                                <hr className="line"/>
                            </div>
                            
                            <Form.Item className="form-input" name="TYPE_OF_LABEL" label="ฉลากโภชนาการ" >
                                <Radio.Group>
                                    <Radio value={0}>ไม่แสดง</Radio>
                                    <Radio value={1}>แบบอื่น ๆ</Radio>
                                    <Radio value={2}>แบบเต็ม</Radio>
                                    <Radio value={3}>แบบย่อ</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item className="form-input" label="หนึ่งหน่วยบริโภค" style={{ marginBottom: 0 }} >
                                <Form.Item name="COUNT_PER_ONE_PORTION" style={{ display: 'inline-block', width: 'calc(30%)', margin: '0 5px 0 0' }} >
                                    <Input
                                        autoComplete="off"
                                        onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}
                                    />
                                </Form.Item>
                                <Form.Item name="COUNT_OF_PORTION"  style={{ display: 'inline-block', width: 'calc(30%)', margin: '0 5px 0 0' }}>
                                    <Select allowClear>
                                        {optionPackageUnit.map((val) => (
                                            <option key={val.PACKAGE_UNIT_ID} value={val.PACKAGE_UNIT_ID}>
                                                {val.UNIT_DESC}
                                            </option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="WEIGHT_PER_PORTION"  style={{ display: 'inline-block', width: 'calc(37%)', margin: '0' }} >
                                        <Input 
                                            addonAfter="กรัม" 
                                            autoComplete="off"
                                            onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}
                                        />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item className="form-input" label="จำนวนหน่วยบริโภคต่อ" style={{ marginBottom: 0 }} >
                                <Form.Item name="COUNT_PORTION_LABEL"  style={{ display: 'inline-block', width: 'calc(50%)', margin: '0', textAlign: 'center' }}>
                                    <Radio.Group>
                                        <Radio value={0}>-</Radio>
                                        <Radio value={1}>ประมาณ</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item name="COUNT_PORTION"  style={{ display: 'inline-block', width: 'calc(50%)', margin: '0' }} >
                                    <Input onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                </Form.Item>
                            </Form.Item>

                            {/* พลังงาน */}
                            <Form.Item className="form-input" name="CAL" label="พลังงานทั้งหมด" >
                                <Input addonAfter="กิโลกรัม" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                            </Form.Item>

                            {/* พลังงานจากไขมัน */}
                            <Form.Item className="form-input" name="CALFAT" label="พลังงานจากไขมัน" >
                                <Input addonAfter="กิโลกรัม" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                            </Form.Item>

                            {/* ไขมันทั้งหมด */}
                            <Form.Item className="form-input" label="ไขมันทั้งหมด" >
                                <Input.Group compact>
                                    <Form.Item name="FAT" style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 5px 0 0' }} >
                                        <Input addonAfter="กรัม" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                    <Form.Item name="FAT_PERSENTAGE" style={{ display: 'inline-block', width: 'calc(50%)', margin: '0' }} >
                                        <Input addonAfter="%" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            {/* ไขมันอิ่มตัว */}
                            <Form.Item className="form-input" label="ไขมันอิ่มตัว" >
                                <Input.Group compact>
                                    <Form.Item name="SATURATED_FAT" style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 5px 0 0' }} >
                                        <Input addonAfter="กรัม" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                    <Form.Item name="SATURATED_FAT_PERSENTAGE" style={{ display: 'inline-block', width: 'calc(50%)', margin: '0' }} >
                                        <Input addonAfter="%" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            {/* โคเลสเตอรอล */}
                            <Form.Item className="form-input" label="โคเลสเตอรอล" >
                                <Input.Group compact >
                                    <Form.Item name="PRE_CHOLESTEROL" style={{ display: 'inline-block', width: 'calc(15%)', margin: '0'}} >
                                        <Select style={{ width: 'calc(100% - 2px)' }}>
                                            <Option value="=">=</Option>
                                            <Option value="<">น้อยกว่า</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="CHOLESTEROL" style={{ display: 'inline-block', width: 'calc(33.5%)', margin: '0'}} >
                                        <Input addonAfter="มก." autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                    <Form.Item name="CHOLESTEROL_PERSENTAGE" style={{ display: 'inline-block', width: 'calc(51% - 5px)', margin: '0 0 0 5px'}} >
                                        <Input addonAfter="%" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            {/* โปรตีน */}
                            <Form.Item className="form-input" label="โปรตีน" >
                                <Input.Group compact>
                                    <Form.Item name="PRE_PROTEIN" style={{ display: 'inline-block', width: 'calc(15%)', margin: '0'}}>
                                        <Select style={{ width: 'calc(100% - 2px)' }}>
                                            <Option value="=">=</Option>
                                            <Option value="<">น้อยกว่า</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="PROTEIN" style={{ display: 'inline-block', width: 'calc(33.5%)', margin: '0'}} >
                                        <Input addonAfter="กรัม" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            {/* คาร์โบไฮเดรต */}
                            <Form.Item className="form-input" label="คาร์โบไฮเดรต" >
                                <Input.Group compact>
                                    <Form.Item name="PRE_CARBOHYDRATE" style={{ display: 'inline-block', width: 'calc(15%)', margin: '0'}} >
                                        <Select style={{ width: 'calc(100% - 2px)' }}>
                                            <Option value="=">=</Option>
                                            <Option value="<">น้อยกว่า</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="CARBOHYDRATE" style={{ display: 'inline-block', width: 'calc(33.5%)', margin: '0'}} >
                                        <Input addonAfter="กรัม" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                    <Form.Item name="CARBOHYDRATE_PERSENTAGE" style={{ display: 'inline-block', width: 'calc(51% - 5px)', margin: '0 0 0 5px'}} >
                                        <Input addonAfter="%" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            {/* ใยอาหาร */}
                            <Form.Item className="form-input" label="ใยอาหาร" >
                                <Input.Group compact>
                                    <Form.Item name="PRE_FIBER" style={{ display: 'inline-block', width: 'calc(15%)', margin: '0'}} >
                                        <Select style={{ width: 'calc(100% - 2px)' }}>
                                            <Option value="=">=</Option>
                                            <Option value="<">น้อยกว่า</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="FIBER" style={{ display: 'inline-block', width: 'calc(33.5%)', margin: '0'}} >
                                        <Input addonAfter="กรัม" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}} />
                                    </Form.Item>
                                    <Form.Item name="FIBER_PERSENTAGE" style={{ display: 'inline-block', width: 'calc(51% - 5px)', margin: '0 0 0 5px'}} >
                                        <Input addonAfter="%" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}} />
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            {/* น้ำตาล */}
                            <Form.Item className="form-input" label="น้ำตาล" >
                                <Input.Group compact>
                                    <Form.Item name="PRE_SUGAR" style={{ display: 'inline-block', width: 'calc(15%)', margin: '0'}}>
                                        <Select style={{ width: 'calc(100% - 2px)' }}>
                                            <Option value="=">=</Option>
                                            <Option value="<">น้อยกว่า</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="SUGAR" style={{ display: 'inline-block', width: 'calc(33.5%)', margin: '0'}} >
                                        <Input addonAfter="มก." autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            {/* โซเดียม */}
                            <Form.Item className="form-input" label="โซเดียม" >
                                <Input.Group compact>
                                    <Form.Item name="SODIUM" style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 5px 0 0' }} >
                                        <Input addonAfter="กรัม" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                    <Form.Item name="SODIUM_PERSENTAGE" style={{ display: 'inline-block', width: 'calc(50%)', margin: '0' }} >
                                        <Input addonAfter="%" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            {/* วิตามินเอ */}
                            <Form.Item className="form-input" label="วิตามินเอ" >
                                <Input.Group compact>
                                    <Form.Item name="PRE_VIT_A" style={{ display: 'inline-block', width: 'calc(15%)', margin: '0'}}>
                                        <Select style={{ width: 'calc(100% - 2px)' }}>
                                            <Option value="=">=</Option>
                                            <Option value="<">น้อยกว่า</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="VIT_A" style={{ display: 'inline-block', width: 'calc(33.5%)', margin: '0'}} >
                                        <Input addonAfter="%" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            {/* วิตามินบี 1 */}
                            <Form.Item className="form-input" label="วิตามินบี 1" >
                                <Input.Group compact>
                                    <Form.Item name="PRE_VIT_B1" style={{ display: 'inline-block', width: 'calc(15%)', margin: '0'}} >
                                        <Select style={{ width: 'calc(100% - 2px)' }}>
                                            <Option value="=">=</Option>
                                            <Option value="<">น้อยกว่า</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="VIT_B1"style={{ display: 'inline-block', width: 'calc(33.5%)', margin: '0'}} >
                                        <Input addonAfter="%" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            {/* วิตามินบี 2 */}
                            <Form.Item className="form-input" label="วิตามินบี 2" >
                                <Input.Group compact>
                                    <Form.Item name="PRE_VIT_B2" style={{ display: 'inline-block', width: 'calc(15%)', margin: '0'}}>
                                        <Select style={{ width: 'calc(100% - 2px)' }}>
                                            <Option value="=">=</Option>
                                            <Option value="<">น้อยกว่า</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="VIT_B2" style={{ display: 'inline-block', width: 'calc(33.5%)', margin: '0'}} >
                                        <Input addonAfter="%" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            {/* แคลเซียม */}
                            <Form.Item className="form-input" label="แคลเซียม" >
                                <Input.Group compact>
                                    <Form.Item name="PRE_CALCIUM" style={{ display: 'inline-block', width: 'calc(15%)', margin: '0'}} >
                                        <Select style={{ width: 'calc(100% - 2px)' }}>
                                            <Option value="=">=</Option>
                                            <Option value="<">น้อยกว่า</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="CALCIUM" style={{ display: 'inline-block', width: 'calc(33.5%)', margin: '0'}} >
                                        <Input addonAfter="%" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            {/* เหล็ก */}
                            <Form.Item className="form-input" label="เหล็ก" >
                                <Input.Group compact>
                                    <Form.Item name="PRE_IRON" style={{ display: 'inline-block', width: 'calc(15%)', margin: '0'}}>
                                        <Select style={{ width: 'calc(100% - 2px)' }}>
                                            <Option value="=">=</Option>
                                            <Option value="<">น้อยกว่า</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="IRON" style={{ display: 'inline-block', width: 'calc(33.5%)', margin: '0'}} >
                                        <Input addonAfter="%" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            {/* วิตามินซี */}
                            <Form.Item className="form-input" label="วิตามินซี" >
                                <Input.Group compact>
                                    <Form.Item name="PRE_VIT_C" style={{ display: 'inline-block', width: '15%', margin: '0'}}>
                                        <Select style={{ width: 'calc(100% - 2px)' }}>
                                            <Option value="=">=</Option>
                                            <Option value="<">น้อยกว่า</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="VIT_C" style={{ display: 'inline-block', width: 'calc(33.5%)', margin: '0'}} >
                                        <Input addonAfter="%" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            <Form.List name="OTHER_NUTRIENT_NAME">
                                {(fields, { add, remove }) => (
                                <>
                                    <Form.Item className="form-input" label="สารอาหารอื่น ๆ" >
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            เพิ่มรายการ
                                        </Button>
                                    </Form.Item>
                                    {/* {...formItemLayout} */}
                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', justifyContent:"flex-end", margin: '0 0 5px 0' }} >
                                        <Form.Item {...tailLayout} style={{ margin: '0' }}>
                                            <Input.Group compact>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'name']}
                                                    fieldKey={[fieldKey, 'name']}
                                                    style={{ width: 'calc(50%)', margin: '0 5px 0 0' }}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'prefix']}
                                                    fieldKey={[fieldKey, 'prefix']}
                                                    style={{ width: 'calc(15%)', margin: '0 5px 0 0' }}
                                                >
                                                    <Select style={{ width: 'calc(100%)' }}>
                                                        <Option value="=">=</Option>
                                                        <Option value="<">น้อยกว่า</Option>
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'value']}
                                                    fieldKey={[fieldKey, 'value']}
                                                    style={{ width: 'calc(32%)', margin: '0' }}
                                                >
                                                    <Input addonAfter="%" />
                                                </Form.Item>
                                            </Input.Group>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                    ))}
                                </>
                                )}
                            </Form.List>

                            

                            {/* ไขมันไม่อิ่มตัวเชิงเดี่ยว */}
                            <Form.Item className="form-input" label="ไขมันไม่อิ่มตัวเชิงเดี่ยว" >
                                <Input.Group compact>
                                    <Form.Item name="MONOUNSATURATED_FAT" style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 5px 0 0' }} >
                                        <Input addonAfter="กรัม" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                    <Form.Item name="MONOUNSATURATED_FAT_PERSENTAGE" style={{ display: 'inline-block', width: 'calc(50%)', margin: '0' }} >
                                        <Input addonAfter="%" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                            {/* ไขมันไม่อิ่มตัวเชิงซ้อน */}
                            <Form.Item className="form-input" label="ไขมันไม่อิ่มตัวเชิงซ้อน" >
                                <Input.Group compact>
                                    <Form.Item name="POLYUNSATURATED_FAT" style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 5px 0 0' }} >
                                        <Input addonAfter="กรัม" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                    <Form.Item name="POLYUNSATURATED_FAT_PERSENTAGE" style={{ display: 'inline-block', width: 'calc(50%)', margin: '0' }} >
                                        <Input addonAfter="%" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                             {/* ไขมันทรานส์ */}
                             <Form.Item className="form-input" label="ไขมันทรานส์" >
                                <Input.Group compact>
                                    <Form.Item name="TRANS_FAT" style={{ display: 'inline-block', width: 'calc(50% - 5px)', margin: '0 5px 0 0' }} >
                                        <Input addonAfter="กรัม" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                    <Form.Item name="TRANS_FAT_PERSENTAGE" style={{ display: 'inline-block', width: 'calc(50%)', margin: '0' }} >
                                        <Input addonAfter="%" autoComplete="off" onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>

                        </div>

                        <div className="container-form-infomation-other">
                            <div className="container-form-subtitile">
                                <label htmlFor="">ข้อมูลเพิ่มเติม</label>
                                <hr className="line" />
                            </div>

                            <Form.Item className="form-input" name="COMPONENT" label="ส่วนประกอบ" >
                                <Radio.Group >
                                    <Space direction="vertical" style={{ marginTop: 5 }}>
                                        <Radio value={0}>ไม่มี สมุนไพร / ผัก / ผลไม้</Radio>
                                        <Radio value={1}>มี สมุนไพร / ผัก / ผลไม้ 100 %</Radio>
                                        <Radio value={2}>มี สมุนไพร / ผัก / ผลไม้ ผสม</Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>

                            {/* น้ำตาลที่เติมเข้าไปในอาหาร */}
                            <Form.Item className="form-input" name="SUGAR_ADD" label="น้ำตาลที่เติมเข้าไปในอาหาร" >
                                <Input 
                                    addonAfter="%" 
                                    autoComplete="off"
                                    onKeyPress={(event) => {if (!/[0-9,.,-]/.test(event.key)) { event.preventDefault() }}}
                                />
                            </Form.Item>

                            <Form.List name="COMPONENT_NAME">
                                {(fields, { add, remove }) => (
                                <>
                                    <Form.Item className="form-input" label="ส่วนประกอบโดยประมาณ" >
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            เพิ่มรายการ
                                        </Button>
                                    </Form.Item>

                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', justifyContent:"flex-end", margin: '0 0 5px 0' }} >
                                        <Form.Item {...tailLayout} style={{ margin: '0' }}>
                                            <Input.Group compact>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'name']}
                                                    fieldKey={[fieldKey, 'name']}
                                                    style={{ width: 'calc(65% - 5px)', margin: '0 5px 0 0' }}
                                                >
                                                    {/* <Input /> */}
                                                    {/* <Select
                                                        showSearch
                                                        listItemHeight={10}
                                                        listHeight={250}
                                                        style={{ width: 250 }}
                                                        allowClear
                                                        optionFilterProp="children"
                                                        filterOption={(input, option) =>
                                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        filterSort={(optionA, optionB) =>
                                                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                                        }
                                                    >
                                                        {optionComponent.map((val) => (
                                                            <Option key={val.id} value={val.name} name={val.name}>
                                                                {val.name}
                                                            </Option>
                                                        ))}
                                                    </Select> */}
                                                    <AutoComplete
                                                        showSearch
                                                        allowClear
                                                        style={{ width: 250 }}
                                                        listItemHeight={10}
                                                        listHeight={250}
                                                        filterOption={(input, option) =>
                                                            option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                                                            option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        // options={options}
                                                        // onChange={handleComponentGroup}
                                                        // value={component.component_name}
                                                    >
                                                        {optionComponent.map((val) => (
                                                            <Option key={val.ingredient_id} value={val.ingredients_name}>
                                                                {val.ingredients_name}
                                                            </Option>
                                                        ))}
                                                    </AutoComplete>
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'value']}
                                                    fieldKey={[fieldKey, 'value']}
                                                    style={{ width: 'calc(35%)', margin: '0' }}
                                                >
                                                    <Input addonAfter="%" />
                                                </Form.Item>
                                            </Input.Group>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                    ))}
                                </>
                                )}
                            </Form.List>

                            <hr className="line" />

                            <Form.Item className="form-input text-align-left" name="ALLERGY_OF_LABEL" label="ข้อมูลวัตถุเจือปน" >
                                <Radio.Group>
                                    <Radio value={0}>ไม่แสดง</Radio>
                                    <Radio value={1}>แสดง</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <div className="container-form-boxgray">

                            <Form.Item
                                name="COLOR"
                                label="สี"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                               
                                                    
                                <Select mode="tags" style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="PRESERVATIVE"
                                label="สารกันเสีย หรือวัตถุกันเสีย"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="SWEETENER"
                                label="วัตถุที่ให้ความหวานแทนน้ำตาล"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="ACIDITY_REGULATOR"
                                label="สารควบคุมความเป็นกรด"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="ANTICAKING_AGENT"
                                label="สารป้องกันการจับเป็นก้อน"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="ANTIFOAMING_AGENT"
                                label="สารป้องกันการเกิดฟอง"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="ANTIOXIDANT"
                                label="สารป้องกันการเกิดออกซิเดชั่น"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="BLEACHING_AGENT"
                                label="สารฟอกสี"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="BULKING_AGENT"
                                label="สารเพิ่มปริมาณ"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="CARBONATING_AGENT"
                                label="สารให้ก๊าซคาร์บอนไดออกไซด์"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="CARRIER"
                                label="สารช่วยทำละลาย หรือช่วยพา"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="COLOUR_RETENTION_AGENT"
                                label="สารคงสภาพของสี"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="EMULSIFIER"
                                label="อิมัลซิไฟเออร์"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="EMULSIFYING_SALT"
                                label="เกลืออิมัลซิไฟอิ้งค์"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="FIRMING_AGENT"
                                label="สารทำให้แน่น"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="FLAVOUR_ENHANCER"
                                label="วัตถุปรุงแต่งรสอาหาร"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="FLOUR_TREATMENT_AGENT"
                                label="สารปรับปรุงคุณภาพแป้ง"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="FOAMING_AGENT"
                                label="สารทำให้เกิดฟอง"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="GELLING_AGENT"
                                label="สารทำให้เกิดเจล"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="GLAZING_AGENT"
                                label="สารเคลือบผิว"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="HUMECTANT"
                                label="สารทำให้เกิดความชุ่มชื้น"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="PACKAGING_GAS"
                                label="ก๊าซที่ช่วยในการเก็บรักษาอาหาร"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="PROPELLANT"
                                label="ก๊าซที่ใช้ขับดัน"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="RAISING_AGENT"
                                label="สารช่วยให้ฟู"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="SEQUESTRANT"
                                label="สารช่วยจับอนุมูลโลหะ"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="STABILIZER"
                                label="สารทำให้คงตัว"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="THICKNER"
                                label="สารให้ความข้นเหนียว"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="ADDITIVES_OTHER"
                                label="อื่นๆ"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>

                            </div>

                            <hr className="line" />

                            <Form.Item className="form-input text-align-left" name="ALLERGY_NAME_LABEL" label="ข้อมูลสำหรับผู้แพ้อาหาร" >
                                <Radio.Group>
                                    <Space>
                                        <Radio value={0}>ไม่แสดง</Radio>
                                        <Radio value={1}>แสดง</Radio>
                                        <Radio value={2}>ชื่ออาหารบ่งบอกสารก่อภูมิแพ้</Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>

                            <div className="container-form-boxgray">

                            <Form.Item
                                name="ALLERGY_GLUTEN"
                                label="กลูเตน"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="ALLERGY_CRUSTACEAN"
                                label="สัตว์น้ำที่มีเปลือกแข็ง"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="ALLERGY_EGG"
                                label="ไข่ และผลิตภัณฑ์จากไข่"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="ALLERGY_FISH"
                                label="ปลา และผลิตภัณฑ์จากปลา"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="ALLERGY_PEANUT"
                                label="ถั่วลิสง ถั่วเหลือง"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="ALLERGY_MILK"
                                label="นม แลคโตส"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="ALLERGY_NUTS"
                                label="ถั่วที่มีเปลือกแข็ง"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="ALLERGY_SULFITE"
                                label="ซัลไฟต์"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="ALLERGY_OTHER"
                                label="อื่น ๆ"
                                style={{ marginBottom: '.25rem' }}
                                rules={[{ type: 'array' }]}
                            >
                                <Select mode="tags" allowClear style={{ width: '100%' }}>
                                    {children}
                                </Select>
                            </Form.Item>

                            </div>

                            <hr className="line" />
                            
                            <Form.Item className="form-input" name="GDA" label="GDA" >
                                <Radio.Group>
                                    <Radio value={0}>ไม่แสดง</Radio>
                                    <Radio value={1}>แสดงแบบ อย.</Radio>
                                    <Radio value={2}>แสดงแบบอื่น ๆ</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item className="form-input" name="PRESENT_LABEL" label="ข้อความแนะนำ" >
                                <Radio.Group>
                                    <Radio value={0}>ไม่แสดง</Radio>
                                    <Radio value={1}>แสดง</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item className="form-input" name="PRESENT_BOX1" valuePropName="checked" label=" " >
                                <Checkbox>บริโภคแต่น้อยและออกกำลังกายเพื่อสุขภาพ</Checkbox>
                            </Form.Item>
                            <Form.Item className="form-input" name="PRESENT_BOX2" valuePropName="checked" label=" " >
                                <Checkbox>ควรกินอาหารหลากหลาย ครบ 5 หมู่ ในสัดส่วนที่เหมาะสมเป็นประจำ</Checkbox>
                            </Form.Item>
                            <Form.List name="PRESENT_NAME">
                                {(fields, { add, remove }) => (
                                <>
                                    <Form.Item className="form-input" label="อื่นๆ" >
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            เพิ่มรายการ
                                        </Button>
                                    </Form.Item>

                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                        <Form.Item key={key} {...tailLayout} style={{ display: 'flex', justifyContent:"flex-end", margin: '0 0 5px 0' }} >
                                            <Input.Group compact>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'name']}
                                                    fieldKey={[fieldKey, 'name']}
                                                    style={{ display: 'inline-block', width: 'calc(100% - 20px)', margin: '0 5px 0 0', paddingLeft: '100px' }}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} style={{ marginTop: '8px' }} />
                                            </Input.Group>
                                        </Form.Item>
                                    ))}
                                </>
                                )}
                            </Form.List>
                            <Form.Item className="form-input" name="QUOTE_LABEL" label="ข้อความกล่าวอ้าง" >
                                <Radio.Group>
                                    <Radio value={0}>ไม่แสดง</Radio>
                                    <Radio value={1}>แสดง</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.List name="QUOTE_NAME">
                                {(fields, { add, remove }) => (
                                <>
                                    <Form.Item className="form-input" label="อื่นๆ" >
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            เพิ่มรายการ
                                        </Button>
                                    </Form.Item>

                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Form.Item key={key} {...tailLayout} style={{ display: 'flex', justifyContent:"flex-end", margin: '0 0 5px 0' }} >
                                        <Input.Group compact>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'name']}
                                                fieldKey={[fieldKey, 'name']}
                                                style={{ display: 'inline-block', width: 'calc(100% - 20px)', margin: '0 5px 0 0', paddingLeft: '100px' }}
                                            >
                                                <Input />
                                            </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} style={{ marginTop: '8px' }} />
                                        </Input.Group>
                                    </Form.Item>
                                    ))}
                                </>
                                )}
                            </Form.List>
                        </div>

                        <div className="container-form-production">
                            <div className="container-form-subtitile">
                                <label htmlFor="">แหล่งผลิต</label>
                                <hr className="line" />
                            </div>

                            <Form.Item className="form-input" name="FOREIGN_COUNTRY" label="ผลิตจาก" >
                                <Radio.Group>
                                    <Radio value={0}>ในประเทศ</Radio>
                                    <Radio value={1}>ต่างประเทศ</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item className="form-input" name="MADE_FROM" label="ผู้ผลิต" >
                                <Input 
                                    autoComplete="off"
                                />
                            </Form.Item>
                            <Form.Item className="form-input" name="IMPORTER" label="ผู้นำเข้า" >
                                <Input 
                                    autoComplete="off"
                                />
                            </Form.Item>
                            <Form.Item className="form-input" name="DISTRIBUTE" label="ผู้จัดจำหน่าย" >
                                <Input 
                                    autoComplete="off"
                                />
                            </Form.Item>
                        </div>

                        <div className="button-box" >
                            <Link to="/foodchoice" className="button-cancel">ยกเลิก</Link>
                            <Button type="primary" htmlType="submit">บันทึก</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
    )
}

