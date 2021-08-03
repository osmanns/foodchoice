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
    const classes = useStyles()

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
    const [component, setComponent] = useState({ data: [], value: "", component_group: 0 })
    const { Option } = Select;
    const children = [];
    const [top, setTop] = useState(10);
    // const options = optionComponent.map(val => <Option key={val.id} value={val.name} name={val.name} component={val.component_group_id}>{val.name}</Option>);

    $( document ).ready(function() {
        $.ajax({
            url: "https://foodnew.kaseamsanth.xyz/api/criterion",
            type: "POST",
            dataType: "JSON",
            // data: {barcode: values.barcode_id},
            data: {
                GROUP_ID : values.GROUP_ID,
                CAL: values.CAL,
                SUGAR : values.SUGAR,
                SODIUM : values.SODIUM,
                SODIUM_PERSENTAGE : values.SODIUM_PERSENTAGE,
                FAT : values.FAT,
                FAT_PERSENTAGE : values.FAT_PERSENTAGE,
                SATURATED_FAT : values.SATURATED_FAT,
                SATURATED_FAT_PERSENTAGE: values.SATURATED_FAT_PERSENTAGE,
                PROTEIN : values.PROTEIN,
                COMPONENT : values.COMPONENT,
                ALLERGY_OF_LABEL : values.ALLERGY_OF_LABEL,
                COMPONENT_NAME : values.COMPONENT_NAME,
                VIT_B2 : values.VIT_B2,
                CALCIUM : values.CALCIUM,
                COLOR : values.COLOR,
                PRESERVATIVE : values.PRESERVATIVE,
            },
            success: function(data){
                console.log(data);

                const criterion = data.criterion;

                    // Show Criterion type
                    document.getElementById('criterion-type').innerHTML= data.criterion;

                    // Display Footer
                    document.getElementById('contrainer-footer').style.display = "block";

                    switch (criterion) {
                        case "นม": 
                            console.log(criterion);  
                            document.getElementById('milk-contrainer').style.display = "flex";

                            $(".form-margin").css({"margin-top": "-5px"});
                            $(".criterion-type").css({"color": "#b100e8"});

                                // Value
                                var calorie = data.result.CAL.volume
                                var sugar = data.result.SUGAR.volume
                                var fat = data.result.FAT.volume
                                var protein = data.result.PROTEIN.volume
                                var calcium = data.result.CALCIUM.volume
                                var vitaminB2 = data.result.VIT_B2.volume 

                                // Percentage
                                var calorie_Percentage = data.result.CAL.percent
                                var sugar_Percentage = data.result.SUGAR.percent
                                var fat_Percentage = data.result.FAT.percent
                                var protein_Percentage = data.result.PROTEIN.percent
                                var calcium_Percentage = data.result.CALCIUM.percent
                                var vitaminB2_Percentage = data.result.VIT_B2.percent

                                // Status
                                var calorie_Status = data.result.CAL.criterion
                                var sugar_Status = data.result.SUGAR.criterion
                                var fat_Status = data.result.FAT.criterion
                                var protein_Status = data.result.PROTEIN.criterion
                                var calcium_Status = data.result.CALCIUM.criterion

                                // Score 
                                var calorie_Score = data.result.CAL.score_with_weight
                                var sugar_Score = data.result.SUGAR.score_with_weight
                                var fat_Score = data.result.FAT.score_with_weight
                                var protein_Score = data.result.PROTEIN.score_with_weight
                                var calcium_Score = data.result.CALCIUM.score_with_weight

                                // Teaspoon
                                var teaspoon_Sugar = data.teaspoon_sugar

                                // Count per one Portion
                                var weight = data.weight;
                                if(weight == "-") {
                                    document.getElementById('product-per-one-portion').innerHTML = "(ไม่มีข้อมูล)"   
                                }else{
                                    var weight_value = parseInt(weight);
                                    // document.getElementById('product-per-one-portion').innerHTML = "ต่อ " + data.count_per_one_portion + " " + data.package_unit + " (" + weight_value + " " + data.unit + ")"
                                    document.getElementById('product-per-one-portion').innerHTML = "ต่อ " + values.COUNT_PER_ONE_PORTION + " " + data.package_unit + " (" + values.COUNT_PORTION + " " + data.unit + ")"
                                }
                                

                                // Check Nutrient Status
                                function checkMilkCriteriaStatus(){
                                    switch (calorie_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('milk-calorie-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('milk-calorie-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('milk-calorie-status').style.backgroundColor = "#F08080";
                                        break;
                                    }
                                    switch (sugar_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('milk-sugar-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('milk-sugar-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('milk-sugar-status').style.backgroundColor = "#F08080";
                                        break;
                                    }
                                    switch (fat_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('milk-fat-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('milk-fat-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('milk-fat-status').style.backgroundColor = "#F08080";
                                        break;
                                    }
                                    switch (protein_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('milk-protein-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('milk-protein-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('milk-protein-status').style.backgroundColor = "#F08080";
                                        break;
                                    }
                                    switch (calcium_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('milk-calcium-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('milk-calcium-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('milk-calcium-status').style.backgroundColor = "#F08080";
                                        break;
                                    }
                                }
                                // Show Nutrient
                                function showMilkCriteriaNutrient(){
                                    switch (calorie) {
                                        case "-":
                                            document.getElementById('info-milk-calorie').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-milk-calorie').innerHTML = ""
                                        break;
                                        case "0":
                                            document.getElementById('info-milk-calorie').innerHTML = "0 กิโลแคลอรี่"
                                            document.getElementById('percentage-milk-calorie').innerHTML = "0 %"
                                        break;
                                        default: 
                                            document.getElementById('info-milk-calorie').innerHTML = calorie + " กิโลแคลอรี่"
                                            if(calorie_Percentage == "-"){
                                                document.getElementById('percentage-milk-calorie').innerHTML = " %"
                                            }else{
                                                document.getElementById('percentage-milk-calorie').innerHTML = calorie_Percentage + ""
                                            }
                                        break;
                                    }
                                    switch (sugar) {
                                        case "-":
                                            document.getElementById('info-milk-sugar').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('teaspoon-sugar').innerHTML =  "ไม่มีข้อมูล"
                                        break;
                                        case "0":
                                            document.getElementById('info-milk-sugar').innerHTML = "0 กรัม"
                                            document.getElementById('teaspoon-sugar').innerHTML = teaspoon_Sugar + "ช้อนชา"
                                        break;
                                        default:
                                            document.getElementById('info-milk-sugar').innerHTML = sugar + " กรัม"
                                            document.getElementById('teaspoon-sugar').innerHTML = teaspoon_Sugar + " ช้อนชา"
                                        break;
                                    }
                                    switch (fat) {
                                        case "-":
                                            document.getElementById('info-milk-fat').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-milk-fat').innerHTML = ""
                                        break;
                                        case "0":
                                            document.getElementById('info-milk-fat').innerHTML = "0 กรัม"
                                            document.getElementById('percentage-milk-fat').innerHTML = "0 %"
                                        break;
                                        default: 
                                            document.getElementById('info-milk-fat').innerHTML = fat + " กรัม"
                                            if(fat_Percentage == "-"){
                                                document.getElementById('percentage-milk-fat').innerHTML = " %"
                                            }else{
                                                document.getElementById('percentage-milk-fat').innerHTML = fat_Percentage + ""
                                            }
                                        break;
                                    }
                                    switch (protein) {
                                        case "-":
                                            document.getElementById('info-milk-protein').innerHTML = "ไม่มีข้อมูล"
                                        break;
                                        case "0":
                                            document.getElementById('info-milk-protein').innerHTML = "0 กรัม"
                                        break;
                                        default:
                                            document.getElementById('info-milk-protein').innerHTML = protein + " กรัม"
                                        break;
                                    }
                                    switch (calcium) {
                                        case "-":
                                            document.getElementById('info-milk-calcium').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-milk-calcium').innerHTML = ""
                                        break;
                                        case "0":
                                            document.getElementById('info-milk-calcium').innerHTML = "0 %"
                                            document.getElementById('percentage-milk-calcium').innerHTML = "0 %"
                                        break;
                                        default: 
                                            document.getElementById('info-milk-calcium').innerHTML = calcium + " %"
                                            if(calcium_Percentage == "-"){
                                                document.getElementById('percentage-milk-calcium').innerHTML = " %"
                                            }else{
                                                document.getElementById('percentage-milk-calcium').innerHTML = calcium_Percentage + ""
                                            }
                                        break;
                                    }
                                    switch (vitaminB2) {
                                        case "-":
                                            document.getElementById('info-milk-vitB2').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-milk-vitB2').innerHTML = ""
                                        break;
                                        case "0":
                                            document.getElementById('info-milk-vitB2').innerHTML = "0 %"
                                            document.getElementById('percentage-milk-vitB2').innerHTML = "0 %"
                                        break;
                                        default: 
                                            document.getElementById('info-milk-vitB2').innerHTML = vitaminB2 + " %"
                                            if(vitaminB2_Percentage == "-"){
                                                document.getElementById('percentage-milk-vitB2').innerHTML = " %"
                                            }else{
                                                document.getElementById('percentage-milk-vitB2').innerHTML = vitaminB2_Percentage + ""
                                            }
                                        break;
                                    }
                                }
                                // Calculate Score
                                function showMilkCriteriaScore(){
                                    // switch (calorie_Score) {
                                    //     case "-": calorie_Score = 0
                                    //     break;
                                    // }
                                    // switch (sugar_Score) {
                                    //     case "-": sugar_Score = 0
                                    //     break;
                                    // }
                                    // switch (fat_Score) {
                                    //     case "-": fat_Score = 0
                                    //     break;
                                    // }
                                    // switch (protein_Score) {
                                    //     case "-": protein_Score = 0
                                    //     break;
                                    // }
                                    // switch (calcium_Score) {
                                    //     case "-": calcium_Score = 0
                                    //     break;
                                    // }
                                    if(calorie_Score == "-" || sugar_Score == "-" || fat_Score == "-" || protein_Score == "-" || calcium_Score == "-"){
                                        document.getElementById('product-score').innerHTML= "ข้อมูลคะแนนไม่ครบ"
                                    }else{
                                        const result_Score = calorie_Score + sugar_Score + fat_Score + protein_Score + calcium_Score
                                        document.getElementById('product-score').innerHTML= result_Score
                                    }
                                    
                                }
                                checkMilkCriteriaStatus()
                                showMilkCriteriaNutrient()
                                showMilkCriteriaScore()
                        break;

                        case "เครื่องดื่ม": 
                            console.log(data.criterion); 
                            document.getElementById("drink-contrainer").style.display = "flex";
                            document.getElementById("drink-contrainer-2").style.display = "flex";

                            $(".form-margin").css({"margin-top": "75px"});
                            $(".criterion-type").css({"color": "#07beb8"});

                                // Value
                                var calorie = data.result.CAL.volume
                                var sugar = data.result.SUGAR.volume
                                var sodium = data.result.SODIUM.volume
                                var fat = data.result.FAT.volume
                                var saturated_fat = data.result.SATURATED_FAT.volume
                                var protein = data.result.PROTEIN.volume
                                var component = data.result.COMPONENT.volume
                                var allergy = data.result.ALLERGY.volume

                                // Percentage
                                var calorie_Percentage = data.result.CAL.percent
                                var sugar_Percentage = data.result.SUGAR.percent
                                var sodium_Percentage = data.result.SODIUM.percent
                                var fat_Percentage = data.result.FAT.percent
                                var saturated_fat_Percentage = data.result.SATURATED_FAT.percent
                                var protein_Percentage = data.result.PROTEIN.percent    

                                // Status
                                var calorie_Status = data.result.CAL.criterion
                                var sugar_Status = data.result.SUGAR.criterion
                                var sodium_Status = data.result.SODIUM.criterion
                                var component_Status = data.result.COMPONENT.criterion  
                                var allergy_Status = data.result.ALLERGY.criterion

                                // Score
                                var calorie_Score = data.result.CAL.score_with_weight
                                var sugar_Score = data.result.SUGAR.score_with_weight
                                var sodium_Score = data.result.SODIUM.score_with_weight
                                var component_Score = data.result.COMPONENT.score_with_weight
                                var allergy_Score = data.result.ALLERGY.score_with_weight 

                                // Teaspoon
                                var teaspoon_Sugar = data.teaspoon_sugar
                                
                                // Count per one Portion
                                var weight = data.weight;
                                if(weight == "-") {
                                    document.getElementById('product-per-one-portion').innerHTML = "(ไม่มีข้อมูล)"   
                                }else{
                                    var weight_value = parseInt(weight);
                                    // document.getElementById('product-per-one-portion').innerHTML = "ต่อ " + data.count_per_one_portion + " " + data.package_unit + " (" + weight_value + " " + data.unit + ")"
                                    document.getElementById('product-per-one-portion').innerHTML = "ต่อ " + values.COUNT_PER_ONE_PORTION + " " + data.package_unit + " (" + values.COUNT_PORTION + " " + data.unit + ")"
                                }
                                // Check Nutrient Status
                                function checkDrinkCriteriaStatus(){
                                    switch (calorie_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('drink-calorie-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('drink-calorie-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('drink-calorie-status').style.backgroundColor = "#F08080";
                                        break;
                                    }
                                    switch (sugar_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('drink-sugar-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('drink-sugar-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('drink-sugar-status').style.backgroundColor = "#F08080";
                                        break;
                                    }
                                    switch (sodium_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('drink-sodium-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('drink-sodium-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('drink-sodium-status').style.backgroundColor = "#F08080";
                                        break;
                                    }
                                    switch (component_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('drink-component-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('drink-component-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('drink-component-status').style.backgroundColor = "#F08080";
                                        break;
                                    }
                                    switch (allergy_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('drink-allergy-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('drink-allergy-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('drink-allergy-status').style.backgroundColor = "#F08080";
                                        break;
                                        case "ไม่เเสดงค่าวัตถุเจือปน":
                                            document.getElementById('drink-allergy-status').style.backgroundColor = "#98FB98";
                                        break;
                                    }     
                                }
                                // Show Nutrient
                                function showDrinkCriteriaNutrient(){
                                    switch (calorie) {
                                        case "-":
                                            document.getElementById('info-drink-calorie').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-drink-calorie').innerHTML = ""
                                        break;
                                        case "0":
                                            document.getElementById('info-drink-calorie').innerHTML = "0 กิโลแคลอรี่"
                                            document.getElementById('percentage-drink-calorie').innerHTML = "0 %"
                                        break;
                                        default: 
                                            document.getElementById('info-drink-calorie').innerHTML = calorie + " กิโลแคลอรี่"
                                            if(calorie_Percentage == "-"){
                                                document.getElementById('percentage-drink-calorie').innerHTML = " %"
                                            }else{
                                                document.getElementById('percentage-drink-calorie').innerHTML = calorie_Percentage + " "
                                            }
                                        break;
                                    }
                                    switch (sugar) {
                                        case "-":
                                            document.getElementById('info-drink-sugar').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('teaspoon-sugar').innerHTML = "ไม่มีข้อมูล"
                                        break;
                                        case "0":
                                            document.getElementById('info-drink-sugar').innerHTML = "0 กรัม"
                                            document.getElementById('teaspoon-sugar').innerHTML = teaspoon_Sugar + "ช้อนชา"
                                        break;
                                        default:
                                            document.getElementById('info-drink-sugar').innerHTML = sugar + " กรัม"
                                            document.getElementById('teaspoon-sugar').innerHTML = teaspoon_Sugar + " ช้อนชา"
                                        break;
                                    }
                                    switch (sodium) {
                                        case "-":
                                            document.getElementById('info-drink-sodium').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-drink-sodium').innerHTML = ""
                                        break;
                                        case "0":
                                            document.getElementById('info-drink-sodium').innerHTML = "0 มิลลิกรัม"
                                            document.getElementById('percentage-drink-sodium').innerHTML = "0 %"
                                        break;
                                        default: 
                                            document.getElementById('info-drink-sodium').innerHTML = sodium + " มิลลิกรัม"
                                            if(sodium_Percentage == "-"){
                                                document.getElementById('percentage-drink-sodium').innerHTML = " %"
                                            }else{
                                                document.getElementById('percentage-drink-sodium').innerHTML = sodium_Percentage + " "
                                            }
                                        break;
                                    }
                                    switch (fat) {
                                        case "-":
                                            document.getElementById('info-drink-fat').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-drink-fat').innerHTML =  ""
                                        break;
                                        case "0":
                                            document.getElementById('info-drink-fat').innerHTML = "0 กรัม"
                                            document.getElementById('percentage-drink-fat').innerHTML =  "0 %"
                                        break;
                                        default:
                                            document.getElementById('info-drink-fat').innerHTML = fat + " กรัม"
                                            if(fat_Percentage == "-"){
                                                document.getElementById('percentage-drink-fat').innerHTML = " %"
                                            }else{
                                                document.getElementById('percentage-drink-fat').innerHTML = fat_Percentage + " "
                                            }
                                        break;
                                    }
                                    switch (saturated_fat) {
                                        case "-":
                                            document.getElementById('info-drink-saturated-fat').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-drink-saturated-fat').innerHTML = ""
                                        break;
                                        case "0":
                                            document.getElementById('info-drink-saturated-fat').innerHTML = "0 กรัม"
                                            document.getElementById('percentage-drink-saturated-fat').innerHTML =  "0 %"
                                        break;
                                        default: 
                                            document.getElementById('info-drink-saturated-fat').innerHTML = saturated_fat + " กรัม"
                                            if(saturated_fat_Percentage == "-"){
                                                document.getElementById('percentage-drink-saturated-fat').innerHTML = " %"
                                            }else{
                                                document.getElementById('percentage-drink-saturated-fat').innerHTML = saturated_fat_Percentage + " "
                                            }
                                        break;
                                    }
                                    switch (protein) {
                                        case "-":
                                            document.getElementById('info-drink-protein').innerHTML = "ไม่มีข้อมูล"
                                        break;
                                        case "0":
                                            document.getElementById('info-drink-protein').innerHTML = "0 กรัม"
                                        break;
                                        default: 
                                            document.getElementById('info-drink-protein').innerHTML = protein + " กรัม"
                                        break;
                                    }
                                    switch (component) {
                                        case "0":
                                            component = 3
                                            document.getElementById('info-drink-component').innerHTML = " " + component + " ไม่มีสมุนไพร / ผัก / ผลไม้"
                                        break;
                                        case "1":
                                            document.getElementById('info-drink-component').innerHTML = " " + component + " สมุนไพร / ผัก / ผลไม้ 100 %"
                                        break;
                                        case "2":
                                            document.getElementById('info-drink-component').innerHTML = " " + component + " สมุนไพร / ผัก / ผลไม้ ผสม"
                                        break;
                                    }
                                    switch (allergy) {
                                        case "-":
                                            allergy = 0
                                            document.getElementById('info-drink-allergy').innerHTML = " " + allergy + " จำนวน "
                                        break;
                                        default:
                                            document.getElementById('info-drink-allergy').innerHTML = " " + allergy + " จำนวน "
                                        break;
                                    }
                                }
                                // Calculate Score
                                function showDrinkCriteriaScore(){
                                    if(calorie_Score == "-" || sugar_Score == "-" || sodium_Score == "-" || component_Score == "-" || allergy_Score == "-"){
                                        document.getElementById('product-score').innerHTML= "ข้อมูลคะแนนไม่ครบ"
                                    }else{
                                        const result_Score = calorie_Score + sugar_Score + sodium_Score + component_Score + allergy_Score
                                        document.getElementById('product-score').innerHTML = result_Score
                                    }
                                }
                                checkDrinkCriteriaStatus()
                                showDrinkCriteriaNutrient()
                                showDrinkCriteriaScore()
                        break;

                        case "ขนม": 
                            console.log(data.criterion); 
                            document.getElementById("snack-contrainer").style.display = "flex";
                            document.getElementById("snack-contrainer-2").style.display = "flex";

                            $(".form-margin").css({"margin-top": "75px"});
                            $(".criterion-type").css({"color": "#ff6b6b"});

                                // Value
                                var calorie = data.result.CAL.volume
                                var sugar = data.result.SUGAR.volume
                                var sodium = data.result.SODIUM.volume
                                var fat = data.result.FAT.volume
                                var saturated_fat = data.result.SATURATED_FAT.volume
                                var protein = data.result.PROTEIN.volume
                                var component = data.result.COMPONENT_NAME.volume
                                var group_Component = data.group_component

                                // Percentage
                                var calorie_Percentage = data.result.CAL.percent
                                var sodium_Percentage = data.result.SODIUM.percent
                                var fat_Percentage = data.result.FAT.percent
                                var saturated_fat_Percentage = data.result.SATURATED_FAT.percent  

                                // Status
                                var calorie_Status = data.result.CAL.criterion
                                var sugar_Status = data.result.SUGAR.criterion
                                var sodium_Status = data.result.SODIUM.criterion
                                var fat_Status = data.result.FAT.criterion
                                var component_Status = data.result.COMPONENT_NAME.criterion  

                                // Score
                                var calorie_Score = data.result.CAL.score_with_weight
                                var sugar_Score = data.result.SUGAR.score_with_weight
                                var sodium_Score = data.result.SODIUM.score_with_weight
                                var fat_Score = data.result.FAT.score_with_weight
                                var component_Score = data.result.COMPONENT_NAME.score_with_weight


                                // Teaspoon
                                var teaspoon_Sugar = data.teaspoon_sugar
                                
                                // Count per one Portion
                                var weight = data.weight;
                                if(weight == "-") {
                                    document.getElementById('product-per-one-portion').innerHTML = "(ไม่มีข้อมูล)"   
                                }else{
                                    var weight_value = parseInt(weight);
                                    // document.getElementById('product-per-one-portion').innerHTML = "ต่อ " + data.count_per_one_portion + " " + data.package_unit + " (" + weight_value + " " + data.unit + ")"
                                    document.getElementById('product-per-one-portion').innerHTML = "ต่อ " + values.COUNT_PER_ONE_PORTION + " " + data.package_unit + " (" + values.COUNT_PORTION + " " + data.unit + ")"
                                }

                                // Check Nutrient Status
                                function checkSnackCriteriaStatus(){
                                    switch (calorie_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('snack-calorie-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('snack-calorie-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('snack-calorie-status').style.backgroundColor = "#F08080";
                                        break;
                                    }
                                    switch (sugar_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('snack-sugar-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('snack-sugar-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('snack-sugar-status').style.backgroundColor = "#F08080";
                                        break;
                                    }
                                    switch (sodium_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('snack-sodium-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('snack-sodium-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('snack-sodium-status').style.backgroundColor = "#F08080";
                                        break;
                                    }
                                    switch (fat_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('snack-fat-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('snack-fat-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('snack-fat-status').style.backgroundColor = "#F08080";
                                        break;
                                    }
                                    switch (component_Status) {
                                        case "ผ่านเกณฑ์":
                                            document.getElementById('snack-component-status').style.backgroundColor = "#98FB98"
                                        break;
                                        case "เกินเกณฑ์ปานกลาง":
                                            document.getElementById('snack-component-status').style.backgroundColor = "#F0E68C";
                                        break;
                                        case "สูงเกินเกณฑ์มาก":
                                            document.getElementById('snack-component-status').style.backgroundColor = "#F08080";
                                        break;
                                        case "ไม่เเสดงค่า":
                                            document.getElementById('snack-component-status').style.backgroundColor = "#DCDCDC";
                                        break;               
                                    }
                                    
                                }
                                // Show Nutrient
                                function showSnackCriteriaNutrient(){
                                    switch (calorie) {
                                        case "-":
                                            document.getElementById('info-snack-calorie').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-snack-calorie').innerHTML = ""
                                        break;
                                        case "0":
                                            document.getElementById('info-snack-calorie').innerHTML = "0 กิโลแคลอรี่"
                                            document.getElementById('percentage-snack-calorie').innerHTML = "0 %"
                                        break;
                                        default: 
                                            document.getElementById('info-snack-calorie').innerHTML = calorie + " กิโลแคลอรี่"
                                            if(calorie_Percentage == "-"){
                                                document.getElementById('percentage-snack-calorie').innerHTML = " %"
                                            }else{
                                                document.getElementById('percentage-snack-calorie').innerHTML = calorie_Percentage + " "
                                            }
                                        break;
                                    }
                                    switch (sugar) {
                                        case "-":
                                            document.getElementById('info-snack-sugar').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('teaspoon-sugar').innerHTML = "ไม่มีข้อมูล"
                                        break;
                                        case "0":
                                            document.getElementById('info-snack-sugar').innerHTML = "0 กรัม"
                                            document.getElementById('teaspoon-sugar').innerHTML = teaspoon_Sugar + " ช้อนชา"
                                        break;
                                        default:
                                            document.getElementById('info-snack-sugar').innerHTML = sugar + " กรัม"
                                            document.getElementById('teaspoon-sugar').innerHTML = teaspoon_Sugar + " ช้อนชา"
                                        break;
                                    }
                                    switch (sodium) {
                                        case "-":
                                            document.getElementById('info-snack-sodium').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-snack-sodium').innerHTML = ""
                                        break;
                                        case "0":
                                            document.getElementById('info-snack-sodium').innerHTML = "0 มิลลิกรัม"
                                            document.getElementById('percentage-snack-sodium').innerHTML = "0 %"
                                        break;
                                        default: 
                                            document.getElementById('info-snack-sodium').innerHTML = sodium + " มิลลิกรัม"
                                            if(sodium_Percentage == "-"){
                                                document.getElementById('percentage-snack-sodium').innerHTML = " %"
                                            }else{
                                                document.getElementById('percentage-snack-sodium').innerHTML = sodium_Percentage + " "
                                            }
                                        break;
                                    }
                                    switch (fat) {
                                        case "-":
                                            document.getElementById('info-snack-fat').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-snack-fat').innerHTML =  ""
                                        break;
                                        case "0":
                                            document.getElementById('info-snack-fat').innerHTML = "0 กรัม"
                                            document.getElementById('percentage-snack-fat').innerHTML =  "0 %"
                                        break;
                                        default:
                                            document.getElementById('info-snack-fat').innerHTML = fat + " กรัม"
                                            if(fat_Percentage == "-"){
                                                document.getElementById('percentage-snack-fat').innerHTML = " %"       
                                            }else{
                                                document.getElementById('percentage-snack-fat').innerHTML = fat_Percentage + " "       
                                            }
                                        break;
                                    }
                                    switch (saturated_fat) {
                                        case "-":
                                            document.getElementById('info-snack-saturated-fat').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-snack-saturated-fat').innerHTML = ""
                                        break;
                                        case "0":
                                            document.getElementById('info-snack-saturated-fat').innerHTML = "0 กรัม"
                                            document.getElementById('percentage-snack-saturated-fat').innerHTML =  "0 %"
                                        break;
                                        default: 
                                            document.getElementById('info-snack-saturated-fat').innerHTML = saturated_fat + " กรัม"
                                            if(saturated_fat_Percentage == "-"){
                                                document.getElementById('percentage-snack-saturated-fat').innerHTML = " %"
                                            }else{
                                                document.getElementById('percentage-snack-saturated-fat').innerHTML = saturated_fat_Percentage + " "
                                            }
                                        break;
                                    }
                                    switch (protein) {
                                        case "-":
                                            document.getElementById('info-snack-protein').innerHTML = "ไม่มีข้อมูล"
                                        break;
                                        case "0":
                                            document.getElementById('info-snack-protein').innerHTML = "0 กรัม"
                                        break;
                                        default: 
                                            document.getElementById('info-snack-protein').innerHTML = protein + " กรัม"
                                        break;
                                    }
                                    switch (group_Component) {
                                        case "":
                                            document.getElementById('info-snack-groupComponent').innerHTML = "ไม่มีข้อมูล"
                                        break;
                                        case "-":
                                            document.getElementById('info-snack-groupComponent').innerHTML = "ไม่มีข้อมูล"
                                        break;
                                        case "-(null) ":
                                            document.getElementById('info-snack-groupComponent').innerHTML = "ไม่มีข้อมูล"
                                        break;
                                        default:
                                            document.getElementById('info-snack-groupComponent').innerHTML = group_Component
                                        break;
                                    }
                                }
                                // Calculate Score
                                function showSnackCriteriaScore(){
                                    if(calorie_Score == "-" || sugar_Score == "-" || sodium_Score == "-" || fat_Score == "-" || component_Score == "-"){
                                        document.getElementById('product-score').innerHTML= "ข้อมูลคะแนนไม่ครบ"
                                    }else{
                                        const result_Score = calorie_Score + sugar_Score + sodium_Score + fat_Score + component_Score
                                        document.getElementById('product-score').innerHTML= result_Score
                                    }         
                                }
                                checkSnackCriteriaStatus()
                                showSnackCriteriaNutrient()
                                showSnackCriteriaScore()
                        break;

                        case "ไม่มีเกณฑ์":
                            console.log(data.criterion); 
                            document.getElementById("non-criterion-contrainer").style.display = "flex";

                            $(".form-margin").css({"margin-top": "-5px"});
                            $(".criterion-type").css({"color": "#7d8597"});

                                // Value
                                var calorie = data.result.CAL.volume
                                var sugar = data.result.SUGAR.volume
                                var sodium = data.result.SODIUM.volume
                                var fat = data.result.FAT.volume
                                var saturated_fat = data.result.SATURATED_FAT.volume
                                var protein = data.result.PROTEIN.volume

                                // Percentage
                                var calorie_Percentage = data.result.CAL.percent
                                var sugar_Percentage = data.result.SUGAR.percent
                                var sodium_Percentage = data.result.SODIUM.percent
                                var fat_Percentage = data.result.FAT.percent
                                var saturated_fat_Percentage = data.result.SATURATED_FAT.percent
                                var protein_Percentage = data.result.PROTEIN.percent    

                                // Status
                                var calorie_Status = data.result.CAL.criterion
                                var sugar_Status = data.result.SUGAR.criterion
                                var sodium_Status = data.result.SODIUM.criterion
                                var fat_Status = data.result.FAT.criterion
                                var saturated_fat_Status = data.result.SATURATED_FAT.criterion
                                var protein_Status = data.result.PROTEIN.criterion

                                // Score
                                var calorie_Score = data.result.CAL.score_with_weight
                                var sugar_Score = data.result.SUGAR.score_with_weight
                                var sodium_Score = data.result.SODIUM.score_with_weight

                                // Teaspoon
                                var teaspoon_Sugar = data.teaspoon_sugar
                                
                                // Count per one Portion
                                var weight = data.weight;
                                if(weight == "-") {
                                    document.getElementById('product-per-one-portion').innerHTML = "(ไม่มีข้อมูล)"   
                                }else{
                                    var weight_value = parseInt(weight);
                                    // document.getElementById('product-per-one-portion').innerHTML = "ต่อ " + data.count_per_one_portion + " " + data.package_unit + " (" + weight_value + " " + data.unit + ")"
                                    document.getElementById('product-per-one-portion').innerHTML = "ต่อ " + values.COUNT_PER_ONE_PORTION + " " + data.package_unit + " (" + values.COUNT_PORTION + " " + data.unit + ")"
                                }
                                // Check Nutrient Status
                                function checkNonCriteriaStatus(){
                                    switch (calorie_Status) {
                                        default:
                                            document.getElementById('non-criterion-calorie-status').style.backgroundColor = "#DCDCDC";
                                        break;
                                    }
                                    switch (sugar_Status) {
                                        default:
                                            document.getElementById('non-criterion-sugar-status').style.backgroundColor = "#DCDCDC";
                                        break;
                                    }
                                    switch (sodium_Status) {
                                        default:
                                            document.getElementById('non-criterion-sodium-status').style.backgroundColor = "#DCDCDC";
                                        break;
                                    }
                                    switch (fat_Status) {
                                        default:
                                            document.getElementById('non-criterion-fat-status').style.backgroundColor = "#DCDCDC";
                                        break;
                                    }
                                    switch (saturated_fat_Status) {
                                        default:
                                            document.getElementById('non-criterion-saturated-fat-status').style.backgroundColor = "#DCDCDC";
                                        break;
                                    }
                                    switch (protein_Status) {
                                        default:
                                            document.getElementById('non-criterion-protein-status').style.backgroundColor = "#DCDCDC";
                                        break;
                                    }
                                }
                                // Show Nutrient
                                function showNonCriteriaNutrient(){
                                    switch (calorie) {
                                        case "-":
                                            document.getElementById('info-non-criterion-calorie').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-non-criterion-calorie').innerHTML = ""
                                        break;
                                        case "0":
                                            document.getElementById('info-non-criterion-calorie').innerHTML = "0 กิโลแคลอรี่"
                                            document.getElementById('percentage-non-criterion-calorie').innerHTML = "0 %"
                                        break;
                                        default: 
                                            document.getElementById('info-non-criterion-calorie').innerHTML = calorie + " กิโลแคลอรี่"
                                            document.getElementById('percentage-non-criterion-calorie').innerHTML = calorie_Percentage + " "
                                        break;
                                    }
                                    switch (sugar) {
                                        case "-":
                                            document.getElementById('info-non-criterion-sugar').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('teaspoon-sugar').innerHTML = "ไม่มีข้อมูล"
                                        break;
                                        case "0":
                                            document.getElementById('info-non-criterion-sugar').innerHTML = "0 กรัม"
                                            document.getElementById('teaspoon-sugar').innerHTML = teaspoon_Sugar + "ช้อนชา"
                                        break;
                                        default:
                                            document.getElementById('info-non-criterion-sugar').innerHTML = sugar + " กรัม"
                                            document.getElementById('teaspoon-sugar').innerHTML = teaspoon_Sugar + " ช้อนชา"
                                        break;
                                    }
                                    switch (sodium) {
                                        case "-":
                                            document.getElementById('info-non-criterion-sodium').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-non-criterion-sodium').innerHTML = ""
                                        break;
                                        case "0":
                                            document.getElementById('info-non-criterion-sodium').innerHTML = "0 มิลลิกรัม"
                                            document.getElementById('percentage-non-criterion-sodium').innerHTML = "0 %"
                                        break;
                                        default: 
                                            document.getElementById('info-non-criterion-sodium').innerHTML = sodium + " มิลลิกรัม"
                                            document.getElementById('percentage-non-criterion-sodium').innerHTML = sodium_Percentage + " "
                                        break;
                                    }
                                    switch (fat) {
                                        case "-":
                                            document.getElementById('info-non-criterion-fat').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-non-criterion-fat').innerHTML =  ""
                                        break;
                                        case "0":
                                            document.getElementById('info-non-criterion-fat').innerHTML = "0 กรัม"
                                            document.getElementById('percentage-non-criterion-fat').innerHTML =  "0 %"
                                        break;
                                        default:
                                            document.getElementById('info-non-criterion-fat').innerHTML = fat + " กรัม"
                                            document.getElementById('percentage-non-criterion-fat').innerHTML = fat_Percentage + " "

                                        break;
                                    }
                                    switch (saturated_fat) {
                                        case "-":
                                            document.getElementById('info-non-criterion-saturated-fat').innerHTML = "ไม่มีข้อมูล"
                                            document.getElementById('percentage-non-criterion-saturated-fat').innerHTML = ""
                                        break;
                                        case "0":
                                            document.getElementById('info-non-criterion-saturated-fat').innerHTML = "0 กรัม"
                                            document.getElementById('percentage-non-criterion-saturated-fat').innerHTML =  "0 %"
                                        break;
                                        default: 
                                            document.getElementById('info-non-criterion-saturated-fat').innerHTML = saturated_fat + " กรัม"
                                            document.getElementById('percentage-non-criterion-saturated-fat').innerHTML = saturated_fat_Percentage + " "
                                        break;
                                    }
                                    switch (protein) {
                                        case "-":
                                            document.getElementById('info-non-criterion-protein').innerHTML = "ไม่มีข้อมูล"
                                        break;
                                        case "0":
                                            document.getElementById('info-non-criterion-protein').innerHTML = "0 กรัม"
                                        break;
                                        default: 
                                            document.getElementById('info-non-criterion-protein').innerHTML = protein + " กรัม"
                                        break;
                                    }
                                }
                                // Calculate Score
                                function showNonCriteriaScore(){
                                    document.getElementById('product-score').innerHTML= "ข้อมูลคะแนนไม่ได้ประเมินเกณฑ์"
                                }
                                checkNonCriteriaStatus()
                                showNonCriteriaNutrient()
                                showNonCriteriaScore()
                        break;
                    }
            }
        });
    });

    const [images, setImages] = useState([])
    useEffect(async () => {
        const response = await Axios.get(`http://localhost:3001/api/foodchoicedb/${products_per_serving_id}`, {
            headers: {'Content-Type': 'application/json'}
        }).then((response) => {
            Axios.get('http://localhost:3001/api/image/'+response.data[0].barcode_id, {
            }).then((response) => {
                console.log(response.data)
                setImages(response.data)
            }).catch((error) => {
                console.log("error", error)
            })
        }).catch((error) => {
            console.log("error", error)
        })
    }, [])


    const handleComponentGroup = (value) => {  
        setComponent({ value }); 
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

        // Axios.post(`http://159.65.133.73/api/products/${products_per_serving_id}`, body, {
        //     headers: {'Content-Type': 'application/json'}
        // }).then((response) => {
        //     console.log(response.data)
        // })
        // history.push("/Foodchoice")
    };

    // Get data
    const [ form ] = Form.useForm();
    useEffect(async () => {
        var myHeaders= new Headers()
        myHeaders.append("Content-Type", "application/json")
        // const response = await Axios.get(`https://foodnew.kaseamsanth.tk/api/products/${products_per_serving_id}`, {
        const response = await Axios.get(`https://foodnew.kaseamsanth.xyz/api/products/${products_per_serving_id}`, {
          headers: {'Content-Type': 'application/json'}
        }).then((response) => {
                // if(response.data.OTHER_NUTRIENT_NAME != "" || null){
                //     var json_OTHER_NUTRIENT_NAME = response.data.OTHER_NUTRIENT_NAME;
                //     var array_OTHER_NUTRIENT_NAME = JSON.parse(json_OTHER_NUTRIENT_NAME);
                //     var res_OTHER_NUTRIENT_NAME = [];
                //     if(response.data.OTHER_NUTRIENT_NAME != null){
                //         for(var i in array_OTHER_NUTRIENT_NAME){
                //             res_OTHER_NUTRIENT_NAME.push(array_OTHER_NUTRIENT_NAME[i]);
                //         }
                //     }
                //     console.log(res_OTHER_NUTRIENT_NAME)
                // }
                // if(response.data.COMPONENT_NAME != "" || null){
                //     var json_COMPONENT_NAME = response.data.COMPONENT_NAME;
                //     // var array_COMPONENT_NAME = JSON.parse(json_COMPONENT_NAME);
                //     var res_COMPONENT_NAME = [];
                //     if(response.data.COMPONENT_NAME != null){
                //         for(var i in json_COMPONENT_NAME){
                //             res_COMPONENT_NAME.push(json_COMPONENT_NAME[i]);
                //         }
                //     }
                //     console.log(res_COMPONENT_NAME)
                // }
                if(response.data.COLOR != "" || null){
                    var json_COLOR = response.data.COLOR
                    // var array_COLOR = JSON.parse(json_COLOR);
                    var res_COLOR = [];
                    for(var i in json_COLOR){
                        res_COLOR.push(json_COLOR[i].name);
                    }
                }
                if(response.data.PRESERVATIVE != "" || null){
                    var json_PRESERVATIVE = response.data.PRESERVATIVE
                    // var array_PRESERVATIVE = JSON.parse(json_PRESERVATIVE);
                    var res_PRESERVATIVE = [];
                    for(var i in json_PRESERVATIVE){
                        res_PRESERVATIVE.push(json_PRESERVATIVE[i].name);
                    }
                }
                if(response.data.SWEETENER != "" || null){
                    var json_SWEETENER = response.data.SWEETENER
                    // var array_SWEETENER = JSON.parse(json_SWEETENER);
                    var res_SWEETENER = [];
                    for(var i in json_SWEETENER){
                        res_SWEETENER.push(json_SWEETENER[i].name);
                    }
                }
                if(response.data.ACIDITY_REGULATOR != "" || null){
                    var json_ACIDITY_REGULATOR = response.data.ACIDITY_REGULATOR
                    // var array_ACIDITY_REGULATOR = JSON.parse(json_ACIDITY_REGULATOR);
                    var res_ACIDITY_REGULATOR = [];
                    for(var i in json_ACIDITY_REGULATOR){
                        res_ACIDITY_REGULATOR.push(json_ACIDITY_REGULATOR[i].name);
                    }
                }
                if(response.data.ANTICAKING_AGENT != "" || null){
                    var json_ANTICAKING_AGENT = response.data.ANTICAKING_AGENT
                    // var array_ANTICAKING_AGENT = JSON.parse(json_ANTICAKING_AGENT);
                    var res_ANTICAKING_AGENT = [];
                    for(var i in json_ANTICAKING_AGENT){
                        res_ANTICAKING_AGENT.push(json_ANTICAKING_AGENT[i].name);
                    }
                }
                if(response.data.ANTIFOAMING_AGENT != "" || null){
                    var json_ANTIFOAMING_AGENT = response.data.ANTIFOAMING_AGENT
                    // var array_ANTIFOAMING_AGENT = JSON.parse(json_ANTIFOAMING_AGENT);
                    var res_ANTIFOAMING_AGENT = [];
                    for(var i in json_ANTIFOAMING_AGENT){
                        res_ANTIFOAMING_AGENT.push(json_ANTIFOAMING_AGENT[i].name);
                    }
                }
                if(response.data.ANTIOXIDANT != "" || null){
                    var json_ANTIOXIDANT = response.data.ANTIOXIDANT
                    // var array_ANTIOXIDANT = JSON.parse(json_ANTIOXIDANT);
                    var res_ANTIOXIDANT = [];
                    for(var i in json_ANTIOXIDANT){
                        res_ANTIOXIDANT.push(json_ANTIOXIDANT[i].name);
                    }
                }
                if(response.data.BLEACHING_AGENT != "" || null){
                    var json_BLEACHING_AGENT = response.data.BLEACHING_AGENT
                    // var array_BLEACHING_AGENT = JSON.parse(json_BLEACHING_AGENT);
                    var res_BLEACHING_AGENT = [];
                    for(var i in json_BLEACHING_AGENT){
                        res_BLEACHING_AGENT.push(json_BLEACHING_AGENT[i].name);
                    }
                }
                if(response.data.BULKING_AGENT != "" || null){
                    var json_BULKING_AGENT = response.data.BULKING_AGENT
                    // var array_BULKING_AGENT = JSON.parse(json_BULKING_AGENT);
                    var res_BULKING_AGENT = [];
                    for(var i in json_BULKING_AGENT){
                        res_BULKING_AGENT.push(json_BULKING_AGENT[i].name);
                    }
                }
                if(response.data.CARBONATING_AGENT != "" || null){
                    var json_CARBONATING_AGENT = response.data.CARBONATING_AGENT
                    // var array_CARBONATING_AGENT = JSON.parse(json_CARBONATING_AGENT);
                    var res_CARBONATING_AGENT = [];
                    for(var i in json_CARBONATING_AGENT){
                        res_CARBONATING_AGENT.push(json_CARBONATING_AGENT[i].name);
                    }
                }
                if(response.data.CARRIER != "" || null){
                    var json_CARRIER = response.data.CARRIER
                    // var array_CARRIER = JSON.parse(json_CARRIER);
                    var res_CARRIER = [];
                    for(var i in json_CARRIER){
                        res_CARRIER.push(json_CARRIER[i].name);
                    }
                }
                if(response.data.COLOUR_RETENTION_AGENT != "" || null){
                    var json_COLOUR_RETENTION_AGENT = response.data.COLOUR_RETENTION_AGENT
                    // var array_COLOUR_RETENTION_AGENT = JSON.parse(json_COLOUR_RETENTION_AGENT);
                    var res_COLOUR_RETENTION_AGENT = [];
                    for(var i in json_COLOUR_RETENTION_AGENT){
                        res_COLOUR_RETENTION_AGENT.push(json_COLOUR_RETENTION_AGENT[i].name);
                    }
                }
                if(response.data.EMULSIFIER != "" || null){
                    var json_EMULSIFIER = response.data.EMULSIFIER
                    // var array_EMULSIFIER = JSON.parse(json_EMULSIFIER);
                    var res_EMULSIFIER = [];
                    for(var i in json_EMULSIFIER){
                        res_EMULSIFIER.push(json_EMULSIFIER[i].name);
                    }
                }
                if(response.data.EMULSIFYING_SALT != "" || null){
                    var json_EMULSIFYING_SALT = response.data.EMULSIFYING_SALT
                    // var array_EMULSIFYING_SALT = JSON.parse(json_EMULSIFYING_SALT);
                    var res_EMULSIFYING_SALT = [];
                    for(var i in json_EMULSIFYING_SALT){
                        res_EMULSIFYING_SALT.push(json_EMULSIFYING_SALT[i].name);
                    }
                }
                if(response.data.FIRMING_AGENT != "" || null){
                    var json_FIRMING_AGENT = response.data.FIRMING_AGENT
                    // var array_FIRMING_AGENT = JSON.parse(json_FIRMING_AGENT);
                    var res_FIRMING_AGENT = [];
                    for(var i in json_FIRMING_AGENT){
                        res_FIRMING_AGENT.push(json_FIRMING_AGENT[i].name);
                    }
                }
                if(response.data.FLAVOUR_ENHANCER != "" || null){
                    var json_FLAVOUR_ENHANCER = response.data.FLAVOUR_ENHANCER
                    // var array_FLAVOUR_ENHANCER = JSON.parse(json_FLAVOUR_ENHANCER);
                    var res_FLAVOUR_ENHANCER = [];
                    for(var i in json_FLAVOUR_ENHANCER){
                        res_FLAVOUR_ENHANCER.push(json_FLAVOUR_ENHANCER[i].name);
                    }
                }
                if(response.data.FLOUR_TREATMENT_AGENT != "" || null){
                    var json_FLOUR_TREATMENT_AGENT = response.data.FLOUR_TREATMENT_AGENT
                    // var array_FLOUR_TREATMENT_AGENT = JSON.parse(json_FLOUR_TREATMENT_AGENT);
                    var res_FLOUR_TREATMENT_AGENT = [];
                    for(var i in json_FLOUR_TREATMENT_AGENT){
                        res_FLOUR_TREATMENT_AGENT.push(json_FLOUR_TREATMENT_AGENT[i].name);
                    }
                }
                if(response.data.FOAMING_AGENT != "" || null){
                    var json_FOAMING_AGENT = response.data.FOAMING_AGENT
                    // var array_FOAMING_AGENT = JSON.parse(json_FOAMING_AGENT);
                    var res_FOAMING_AGENT = [];
                    for(var i in json_FOAMING_AGENT){
                        res_FOAMING_AGENT.push(json_FOAMING_AGENT[i].name);
                    }
                }
                if(response.data.GELLING_AGENT != "" || null){
                    var json_GELLING_AGENT = response.data.GELLING_AGENT
                    // var array_GELLING_AGENT = JSON.parse(json_GELLING_AGENT);
                    var res_GELLING_AGENT = [];
                    for(var i in json_GELLING_AGENT){
                        res_GELLING_AGENT.push(json_GELLING_AGENT[i].name);
                    }
                }
                if(response.data.GLAZING_AGENT != "" || null){
                    var json_GLAZING_AGENT = response.data.GLAZING_AGENT
                    // var array_GLAZING_AGENT = JSON.parse(json_GLAZING_AGENT);
                    var res_GLAZING_AGENT = [];
                    for(var i in json_GLAZING_AGENT){
                        res_GLAZING_AGENT.push(json_GLAZING_AGENT[i].name);
                    }
                }
                if(response.data.HUMECTANT != "" || null){
                    var json_HUMECTANT = response.data.HUMECTANT
                    // var array_HUMECTANT = JSON.parse(json_HUMECTANT);
                    var res_HUMECTANT = [];
                    for(var i in json_HUMECTANT){
                        res_HUMECTANT.push(json_HUMECTANT[i].name);
                    }
                }
                if(response.data.PACKAGING_GAS != "" || null){
                    var json_PACKAGING_GAS = response.data.PACKAGING_GAS
                    // var array_PACKAGING_GAS = JSON.parse(json_PACKAGING_GAS);
                    var res_PACKAGING_GAS = [];
                    for(var i in json_PACKAGING_GAS){
                        res_PACKAGING_GAS.push(json_PACKAGING_GAS[i].name);
                    }
                }
                if(response.data.PROPELLANT != "" || null){
                    var json_PROPELLANT = response.data.PROPELLANT
                    // var array_PROPELLANT = JSON.parse(json_PROPELLANT);
                    var res_PROPELLANT = [];
                    for(var i in json_PROPELLANT){
                        res_PROPELLANT.push(json_PROPELLANT[i].name);
                    }
                }
                if(response.data.RAISING_AGENT != "" || null){
                    var json_RAISING_AGENT = response.data.RAISING_AGENT
                    // var array_RAISING_AGENT = JSON.parse(json_RAISING_AGENT);
                    var res_RAISING_AGENT = [];
                    for(var i in json_RAISING_AGENT){
                        res_RAISING_AGENT.push(json_RAISING_AGENT[i].name);
                    }
                }
                if(response.data.SEQUESTRANT != "" || null){
                    var json_SEQUESTRANT = response.data.SEQUESTRANT
                    // var array_SEQUESTRANT = JSON.parse(json_SEQUESTRANT);
                    var res_SEQUESTRANT = [];
                    for(var i in json_SEQUESTRANT){
                        res_SEQUESTRANT.push(json_SEQUESTRANT[i].name);
                    }
                }
                if(response.data.STABILIZER != "" || null){
                    var json_STABILIZER = response.data.STABILIZER
                    // var array_STABILIZER = JSON.parse(json_STABILIZER);
                    var res_STABILIZER = [];
                    for(var i in json_STABILIZER){
                        res_STABILIZER.push(json_STABILIZER[i].name);
                    }
                }
                if(response.data.THICKNER != "" || null){
                    var json_THICKNER = response.data.THICKNER
                    // var array_THICKNER = JSON.parse(json_THICKNER);
                    var res_THICKNER = [];
                    for(var i in json_THICKNER){
                        res_THICKNER.push(json_THICKNER[i].name);
                    }
                }
                if(response.data.ADDITIVES_OTHER != "" || null){
                    var json_ADDITIVES_OTHER = response.data.ADDITIVES_OTHER
                    // var array_ADDITIVES_OTHER = JSON.parse(json_ADDITIVES_OTHER);
                    var res_ADDITIVES_OTHER = [];
                    for(var i in json_ADDITIVES_OTHER){
                        res_ADDITIVES_OTHER.push(json_ADDITIVES_OTHER[i].name);
                    }
                }
                if(response.data.ALLERGY_GLUTEN != "" || null){
                    var json_ALLERGY_GLUTEN = response.data.ALLERGY_GLUTEN
                    // var array_ALLERGY_GLUTEN = JSON.parse(json_ALLERGY_GLUTEN);
                    var res_ALLERGY_GLUTEN = [];
                    for(var i in json_ALLERGY_GLUTEN){
                        res_ALLERGY_GLUTEN.push(json_ALLERGY_GLUTEN[i].name);
                    }
                }
                if(response.data.ALLERGY_CRUSTACEAN != "" || null){
                    var json_ALLERGY_CRUSTACEAN = response.data.ALLERGY_CRUSTACEAN
                    // var array_ALLERGY_CRUSTACEAN = JSON.parse(json_ALLERGY_CRUSTACEAN);
                    var res_ALLERGY_CRUSTACEAN = [];
                    for(var i in json_ALLERGY_CRUSTACEAN){
                        res_ALLERGY_CRUSTACEAN.push(json_ALLERGY_CRUSTACEAN[i].name);
                    }
                }
                if(response.data.ALLERGY_EGG != "" || null){
                    var json_ALLERGY_EGG = response.data.ALLERGY_EGG
                    // var array_ALLERGY_EGG = JSON.parse(json_ALLERGY_EGG);
                    var res_ALLERGY_EGG = [];
                    for(var i in json_ALLERGY_EGG){
                        res_ALLERGY_EGG.push(json_ALLERGY_EGG[i].name);
                    }
                }
                if(response.data.ALLERGY_FISH != "" || null){
                    var json_ALLERGY_FISH = response.data.ALLERGY_FISH
                    // var array_ALLERGY_FISH = JSON.parse(json_ALLERGY_FISH);
                    var res_ALLERGY_FISH = [];
                    for(var i in json_ALLERGY_FISH){
                        res_ALLERGY_FISH.push(json_ALLERGY_FISH[i].name);
                    }
                }
                if(response.data.ALLERGY_PEANUT != "" || null){
                    var json_ALLERGY_PEANUT = response.data.ALLERGY_PEANUT
                    // var array_ALLERGY_PEANUT = JSON.parse(json_ALLERGY_PEANUT);
                    var res_ALLERGY_PEANUT = [];
                    for(var i in json_ALLERGY_PEANUT){
                        res_ALLERGY_PEANUT.push(json_ALLERGY_PEANUT[i].name);
                    }
                }
                if(response.data.ALLERGY_MILK != "" || null){
                    var json_ALLERGY_MILK = response.data.ALLERGY_MILK
                    // var array_ALLERGY_MILK = JSON.parse(json_ALLERGY_MILK);
                    var res_ALLERGY_MILK = [];
                    for(var i in json_ALLERGY_MILK){
                        res_ALLERGY_MILK.push(json_ALLERGY_MILK[i].name);
                    }
                }
                if(response.data.ALLERGY_NUTS != "" || null){
                    var json_ALLERGY_NUTS = response.data.ALLERGY_NUTS
                    // var array_ALLERGY_NUTS = JSON.parse(json_ALLERGY_NUTS);
                    var res_ALLERGY_NUTS = [];
                    for(var i in json_ALLERGY_NUTS){
                        res_ALLERGY_NUTS.push(json_ALLERGY_NUTS[i].name);
                    }
                }
                if(response.data.ALLERGY_SULFITE != "" || null){
                    var json_ALLERGY_SULFITE = response.data.ALLERGY_SULFITE
                    // var array_ALLERGY_SULFITE = JSON.parse(json_ALLERGY_SULFITE);
                    var res_ALLERGY_SULFITE = [];
                    for(var i in json_ALLERGY_SULFITE){
                        res_ALLERGY_SULFITE.push(json_ALLERGY_SULFITE[i].name);
                    }
                }
                if(response.data.ALLERGY_OTHER != "" || null){
                    var json_ALLERGY_OTHER = response.data.ALLERGY_OTHER
                    // var array_ALLERGY_OTHER = JSON.parse(json_ALLERGY_OTHER);
                    var res_ALLERGY_OTHER = [];
                    for(var i in json_ALLERGY_OTHER){
                        res_ALLERGY_OTHER.push(json_ALLERGY_OTHER[i].name);
                    }
                }

                if(response.data.PRESENT_BOX1 === 1){
                    var prebox1 = true
                }
                else if(response.data.PRESENT_BOX1 === 0){
                    values.PRESENT_BOX1 = 0
                    var prebox1 = false
                }
                if(response.data.PRESENT_BOX2 === 1){
                    var prebox2 = true
                }
                else if(response.data.PRESENT_BOX2 === 0){
                    var prebox2 = false
                }

            form.setFieldsValue({
                FDA_NO: response.data.FDA_NO,
                BRAND: response.data.BRAND,
                NAME: response.data.NAME,
                GROUP_ID: response.data.GROUP_ID,
                PACKAGE_UNIT_ID: response.data.PACKAGE_UNIT_ID,
                TOTAL_WEIGHT: response.data.TOTAL_WEIGHT,
                TYPE_OF_LABEL: response.data.TYPE_OF_LABEL,
                COUNT_PER_ONE_PORTION: response.data.COUNT_PER_ONE_PORTION,
                COUNT_OF_PORTION: response.data.COUNT_OF_PORTION,
                WEIGHT_PER_PORTION: response.data.WEIGHT_PER_PORTION,
                COUNT_PORTION_LABEL: response.data.COUNT_PORTION_LABEL,
                COUNT_PORTION: response.data.COUNT_PORTION,
                CAL: response.data.CAL,
                CALFAT: response.data.CALFAT,
                FAT: response.data.FAT,
                FAT_PERSENTAGE: response.data.FAT_PERSENTAGE,
                SATURATED_FAT: response.data.SATURATED_FAT,
                SATURATED_FAT_PERSENTAGE: response.data.SATURATED_FAT_PERSENTAGE,
                PRE_CHOLESTEROL: response.data.PRE_CHOLESTEROL,
                CHOLESTEROL: response.data.CHOLESTEROL,
                CHOLESTEROL_PERSENTAGE: response.data.CHOLESTEROL_PERSENTAGE,
                PRE_PROTEIN: response.data.PRE_PROTEIN,
                PROTEIN: response.data.PROTEIN,
                PRE_CARBOHYDRATE: response.data.PRE_CARBOHYDRATE,
                CARBOHYDRATE: response.data.CARBOHYDRATE,
                CARBOHYDRATE_PERSENTAGE: response.data.CARBOHYDRATE_PERSENTAGE,
                PRE_FIBER: response.data.PRE_FIBER,
                FIBER: response.data.FIBER,
                FIBER_PERSENTAGE: response.data.FIBER_PERSENTAGE,
                PRE_SUGAR: response.data.PRE_SUGAR,
                SUGAR: response.data.SUGAR,
                SODIUM: response.data.SODIUM,
                SODIUM_PERSENTAGE: response.data.SODIUM_PERSENTAGE,
                PRE_VIT_A: response.data.PRE_VIT_A,
                VIT_A: response.data.VIT_A,
                PRE_VIT_B1: response.data.PRE_VIT_B1,
                VIT_B1: response.data.VIT_B1,
                PRE_VIT_B2: response.data.PRE_VIT_B2,
                VIT_B2: response.data.VIT_B2,
                PRE_CALCIUM: response.data.PRE_CALCIUM,
                CALCIUM: response.data.CALCIUM,
                PRE_IRON: response.data.PRE_IRON,
                IRON: response.data.IRON,
                PRE_VIT_C: response.data.PRE_VIT_C,
                VIT_C: response.data.VIT_C,
                OTHER_NUTRIENT_NAME: response.data.OTHER_NUTRIENT_NAME,
                MONOUNSATURATED_FAT: response.data.MONOUNSATURATED_FAT,
                MONOUNSATURATED_FAT_PERSENTAGE: response.data.MONOUNSATURATED_FAT_PERSENTAGE,
                POLYUNSATURATED_FAT: response.data.POLYUNSATURATED_FAT,
                POLYUNSATURATED_FAT_PERSENTAGE: response.data.POLYUNSATURATED_FAT_PERSENTAGE,
                TRANS_FAT: response.data.TRANS_FAT,
                TRANS_FAT_PERSENTAGE: response.data.TRANS_FAT_PERSENTAGE,
                COMPONENT: response.data.COMPONENT,
                SUGAR_ADD: response.data.SUGAR_ADD,
                COMPONENT_NAME: response.data.COMPONENT_NAME,
                ALLERGY_OF_LABEL: response.data.ALLERGY_OF_LABEL,
                COLOR: res_COLOR,
                PRESERVATIVE: res_PRESERVATIVE,
                SWEETENER: res_SWEETENER,
                ACIDITY_REGULATOR: res_ACIDITY_REGULATOR,
                ANTICAKING_AGENT: res_ANTICAKING_AGENT,
                ANTIFOAMING_AGENT: res_ANTIFOAMING_AGENT,
                ANTIOXIDANT: res_ANTIOXIDANT,
                BLEACHING_AGENT: res_BLEACHING_AGENT,
                BULKING_AGENT: res_BULKING_AGENT,
                CARBONATING_AGENT: res_CARBONATING_AGENT,
                CARRIER: res_CARRIER,
                COLOUR_RETENTION_AGENT: res_COLOUR_RETENTION_AGENT,
                EMULSIFIER: res_EMULSIFIER,
                EMULSIFYING_SALT: res_EMULSIFYING_SALT,
                FIRMING_AGENT: res_FIRMING_AGENT,
                FLAVOUR_ENHANCER: res_FLAVOUR_ENHANCER,
                FLOUR_TREATMENT_AGENT: res_FLOUR_TREATMENT_AGENT,
                FOAMING_AGENT: res_FOAMING_AGENT,
                GELLING_AGENT: res_GELLING_AGENT,
                GLAZING_AGENT: res_GLAZING_AGENT,
                HUMECTANT: res_HUMECTANT,
                PACKAGING_GAS: res_PACKAGING_GAS,
                PROPELLANT: res_PROPELLANT,
                RAISING_AGENT: res_RAISING_AGENT,
                SEQUESTRANT: res_SEQUESTRANT,
                STABILIZER: res_STABILIZER,
                THICKNER: res_THICKNER,
                ADDITIVES_OTHER: res_ADDITIVES_OTHER,
                ALLERGY_NAME_LABEL: response.data.ALLERGY_NAME_LABEL,
                ALLERGY_GLUTEN: res_ALLERGY_GLUTEN,
                ALLERGY_CRUSTACEAN: res_ALLERGY_CRUSTACEAN,
                ALLERGY_EGG: res_ALLERGY_EGG,
                ALLERGY_FISH: res_ALLERGY_FISH,
                ALLERGY_PEANUT: res_ALLERGY_PEANUT,
                ALLERGY_MILK: res_ALLERGY_MILK,
                ALLERGY_NUTS: res_ALLERGY_NUTS,
                ALLERGY_SULFITE: res_ALLERGY_SULFITE,
                ALLERGY_OTHER: res_ALLERGY_OTHER,
                GDA: response.data.GDA,
                PRESENT_LABEL: response.data.PRESENT_LABEL,
                PRESENT_BOX1: prebox1,
                PRESENT_BOX2: prebox2,
                PRESENT_NAME: response.data.PRESENT_NAME,
                QUOTE_LABEL: response.data.QUOTE_LABEL,
                QUOTE_NAME: response.data.QUOTE_NAME,
                FOREIGN_COUNTRY: response.data.FOREIGN_COUNTRY,
                MADE_FROM: response.data.MADE_FROM,
                IMPORTER: response.data.IMPORTER,
                DISTRIBUTE: response.data.DISTRIBUTE,
            });
            setValues(response.data)
            console.log(response.data)
        }).catch((error) => {
            console.log("error", error)
        })
    }, [])

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
                    <Row>
                        <Col span={24}>
                            <div className="contrainer-criteria">
                                <div className="product-info">
                                    <h4 className="product-name">{values.NAME}</h4>
                                    <span id="product-per-one-portion"></span>
                                </div>
                                {/* <!-- Milk Contrainer --> */}
                                <div className="contrainer-card" id="milk-contrainer">
                                    <div className="card">
                                        <span id="milk-calorie-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">พลังงาน</span>
                                            <span className="card-info"><span id="info-milk-calorie"></span></span>
                                            <span className="card-percentage"><span id="percentage-milk-calorie"></span></span>
                                        </span>  
                                    </div>
                                    <div className="card">
                                        <span id="milk-sugar-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">น้ำตาล</span>
                                            <span className="card-info"><span id="info-milk-sugar"></span></span>
                                            <span className="card-percentage"></span>
                                        </span>         
                                    </div>
                                    <div className="card">
                                        <span id="milk-fat-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">ไขมัน</span>
                                            <span className="card-info"><span id="info-milk-fat"></span></span>
                                            <span className="card-percentage"><span id="percentage-milk-fat"></span></span>
                                        </span>   
                                    </div>
                                    <div className="card">
                                        <span id="milk-protein-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">โปรตีน</span>
                                            <span className="card-info"><span id="info-milk-protein"></span></span>
                                            <span className="card-percentage"><span id="percentage-milk-protein"></span></span>
                                        </span>           
                                    </div>
                                    <div className="card">
                                        <span id="milk-calcium-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">แคลเซียม</span>
                                            <span className="card-info"><span id="info-milk-calcium"></span></span>
                                            <span className="card-percentage"><span id="percentage-milk-calcium"></span></span>
                                        </span>  
                                    </div>
                                    <div className="card">
                                        <span id="milk-vitB2-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">วิตามิน B2</span>
                                            <span className="card-info"><span id="info-milk-vitB2"></span></span>
                                            <span className="card-percentage"><span id="percentage-milk-vitB2"></span></span>
                                        </span>  
                                    </div>
                                </div>
                                {/* <!-- End Milk Contrainer --> */}

                                {/* <!-- Drink Contrainer --> */}
                                <div className="contrainer-card" id="drink-contrainer">
                                    <div className="card">
                                        <span id="drink-calorie-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">พลังงาน</span>
                                            <span className="card-info"><span id="info-drink-calorie"></span></span>
                                            <span className="card-percentage"><span id="percentage-drink-calorie"></span></span>
                                        </span>  
                                    </div>
                                    <div className="card">
                                        <span id="drink-sugar-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">น้ำตาล</span>
                                            <span className="card-info"><span id="info-drink-sugar"></span></span>
                                            <span className="card-percentage"></span>
                                        </span>         
                                    </div>
                                    <div className="card">
                                        <span id="drink-sodium-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">โซเดียม</span>
                                            <span className="card-info"><span id="info-drink-sodium"></span></span>
                                            <span className="card-percentage"><span id="percentage-drink-sodium"></span></span>
                                        </span>           
                                    </div>
                                    <div className="card">
                                        <span id="drink-fat-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">ไขมัน</span>
                                            <span className="card-info"><span id="info-drink-fat"></span></span>
                                            <span className="card-percentage"><span id="percentage-drink-fat"></span></span>
                                        </span>   
                                    </div>
                                    <div className="card">
                                        <span id="drink-saturatedfat-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">ไขมันอิ่มตัว</span>
                                            <span className="card-info"><span id="info-drink-saturated-fat"></span></span>
                                            <span className="card-percentage"><span id="percentage-drink-saturated-fat"></span></span>
                                        </span>   
                                    </div>
                                    <div className="card">
                                        <span id="drink-protein-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">โปรตีน</span>
                                            <span className="card-info"><span id="info-drink-protein"></span></span>
                                            <span className="card-percentage"></span>
                                        </span>           
                                    </div>
                                </div>
                                <div className="contrainer-card" id="drink-contrainer-2">
                                        <div className="card">
                                            <span id="drink-component-status" className="card-status"></span>
                                            <span className="card-body">
                                                <span className="card-header">กลุ่มส่วนประกอบ</span>
                                                <span className="card-info">กลุ่ม<span id="info-drink-component"></span></span>
                                            </span>           
                                        </div>
                                        <div className="card">
                                            <span id="drink-allergy-status" className="card-status"></span>
                                            <span className="card-body">
                                                <span className="card-header">สารสังเคราะห์เจือปน</span>
                                                <span className="card-info">จำนวนสาร<span id="info-drink-allergy"></span></span>
                                            </span>  
                                        </div>
                                </div>
                                {/* <!-- End Drink Contrainer --> */}

                                {/* <!-- Snack Contrainer --> */}
                                <div className="contrainer-card" id="snack-contrainer">
                                    <div className="card">
                                        <span id="snack-calorie-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">พลังงาน</span>
                                            <span className="card-info"><span id="info-snack-calorie"></span></span>
                                            <span className="card-percentage"><span id="percentage-snack-calorie"></span></span>
                                        </span>  
                                    </div>
                                    <div className="card">
                                        <span id="snack-sugar-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">น้ำตาล</span>
                                            <span className="card-info"><span id="info-snack-sugar"></span></span>
                                            <span className="card-percentage"></span>
                                        </span>         
                                    </div>
                                    <div className="card">
                                        <span id="snack-sodium-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">โซเดียม</span>
                                            <span className="card-info"><span id="info-snack-sodium"></span></span>
                                            <span className="card-percentage"><span id="percentage-snack-sodium"></span></span>
                                        </span>           
                                    </div>
                                    <div className="card">
                                        <span id="snack-fat-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">ไขมัน</span>
                                            <span className="card-info"><span id="info-snack-fat"></span></span>
                                            <span className="card-percentage"><span id="percentage-snack-fat"></span></span>
                                        </span>   
                                    </div>
                                    <div className="card">
                                        <span id="snack-saturatedfat-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">ไขมันอิ่มตัว</span>
                                            <span className="card-info"><span id="info-snack-saturated-fat"></span></span>
                                            <span className="card-percentage"><span id="percentage-snack-saturated-fat"></span></span>
                                        </span>   
                                    </div>
                                    <div className="card">
                                        <span id="snack-protein-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">โปรตีน</span>
                                            <span className="card-info"><span id="info-snack-protein"></span></span>
                                            <span className="card-percentage"></span>
                                        </span>           
                                    </div>
                                </div>
                                <div className="contrainer-card" id="snack-contrainer-2">
                                    <div className="card snack-card">
                                        <span id="snack-component-status" className="card-status"></span>
                                        <span className="card-body-component">
                                            <span className="card-header">กลุ่มอาหาร</span>
                                            <span className="card-info-component"><span id="info-snack-groupComponent"></span></span>
                                        </span>  
                                    </div>
                                </div>
                                {/* <!-- End Snack Contrainer --> */}

                                {/* <!-- Non-Criterion Contrainer --> */}
                                <div className="contrainer-card" id="non-criterion-contrainer">
                                    <div className="card">
                                        <span id="non-criterion-calorie-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span class="card-header">พลังงาน</span>
                                            <span className="card-info"><span id="info-non-criterion-calorie"></span></span>
                                            <span className="card-percentage"><span id="percentage-non-criterion-calorie"></span></span>
                                        </span>  
                                    </div>
                                    <div className="card">
                                        <span id="non-criterion-sugar-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">น้ำตาล</span>
                                            <span className="card-info"><span id="info-non-criterion-sugar"></span></span>
                                            <span className="card-percentage"></span>
                                        </span>         
                                    </div>
                                    <div className="card">
                                        <span id="non-criterion-sodium-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">โซเดียม</span>
                                            <span className="card-info"><span id="info-non-criterion-sodium"></span></span>
                                            <span className="card-percentage"><span id="percentage-non-criterion-sodium"></span></span>
                                        </span>           
                                    </div>
                                    <div className="card">
                                        <span id="non-criterion-fat-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">ไขมัน</span>
                                            <span className="card-info"><span id="info-non-criterion-fat"></span></span>
                                            <span className="card-percentage"><span id="percentage-non-criterion-fat"></span></span>
                                        </span>   
                                    </div>
                                    <div className="card">
                                        <span id="non-criterion-saturated-fat-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">ไขมันอิ่มตัว</span>
                                            <span className="card-info"><span id="info-non-criterion-saturated-fat"></span></span>
                                            <span className="card-percentage"><span id="percentage-non-criterion-saturated-fat"></span></span>
                                        </span>   
                                    </div>
                                    <div className="card">
                                        <span id="non-criterion-protein-status" className="card-status"></span>
                                        <span className="card-body">
                                            <span className="card-header">โปรตีน</span>
                                            <span className="card-info"><span id="info-non-criterion-protein"></span></span>
                                            <span className="card-percentage"></span>
                                        </span>           
                                    </div>
                                </div>
                                {/* <!-- End Non-Criterion Contrainer --> */}

                                {/* <!-- Contrainer-Footer --> */}
                                <div id="contrainer-footer" className="contrainer-footer" >
                                    <span className="sugar-text">น้ำตาล : <span id="teaspoon-sugar" className="teaspoon-sugar"></span></span>
                                    <span className="footer-text">
                                        <span className="criteria-text">เกณฑ์ที่ใช้ : <span id="criterion-type" className="criterion-type"></span></span>
                                        <span className="score-text">คะแนนรวม : <span id="product-score" className="product-score"></span></span>
                                    </span>
                                </div>  

                                {/* <div id="contrainer-error" className="contrainer-error" >
                                    <div className="error-content">
                                        <div>
                                            <h1>ข้อมูลไม่ถูกต้อง</h1>
                                        </div>
                                    </div>  
                                </div> */}
                                {/* <!-- End Contrainer-Footer --> */}

                            </div>

                        </Col>  
                    </Row>
                    <Form 
                        {...layout} 
                        form={form} 
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

