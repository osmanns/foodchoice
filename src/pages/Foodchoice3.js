import React, { useState, useEffect } from 'react';
import { Link, useHistory, useParams } from "react-router-dom"
import Axios from "axios"

import { InputAdornment, Paper, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

// LAYOUT
import Header from '../components/layout/Header'
import PageHeader from "../components/layout/PageHeader"
import useTable from "../components/useTable"
import { TableBody, TableRow, TableCell, AppBar, Tabs, Tab, Typography, Box  } from '@material-ui/core'
import Controls from "../components/controls/Controls"
import PropTypes from 'prop-types';

// ICONS
import VisibilityIcon from '@material-ui/icons/Visibility'
import EditIcon from '@material-ui/icons/Edit'
import SearchIcon from '@material-ui/icons/Search';

import "../components/styles/buttonStyle.css"

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    pageContent: {
        margin: theme.spacing(3),
        padding: theme.spacing(2)
    },
    searchInput: { 
        width: '50%'
    },
}))

const headCells = [
    { id: 'products_per_serving_id', numeric: false, label: '#' },
    { id: 'barcode_id', numeric: false, label: 'บาร์โค้ด' },
    { id: 'BRAND', numeric: false, label: 'ตราสินค้า' },
    { id: 'NAME', numeric: false, label: 'ชื่อสินค้า' },
    // { id: 'updated_at', numeric: false, label: 'วันที่' },
    { id: 'ACTION', numeric: true, label: 'ดำเนินการ' },
]

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};
function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

function Foodchoice3() {
    const classes = useStyles()

    const [records, setRecords] = useState([])
    const [dataCount, setDataCount] = useState()
    const [filterFn, setFilterFn] = useState({fn: items => { return items;}})
    const { TbContainer, TbHead, TablePaginations, recordsAfterPagingAndSorting } = useTable(records, headCells, filterFn);

    useEffect(() => {
        getItems()
    }, [])
  
    const getItems = async () => {
        // const response = await Axios.get('http://localhost:3001/api/foodchoicedb', {
        // const response = await Axios.get('http://159.65.133.73/api/products', {
        const response = await Axios.get('http://159.65.133.73/api/stage', {
            headers: {'Content-Type': 'application/json'}
        }).then((response) => {
            console.log(response.data.stage_3)
            var datacount = response.data.stage_3.length
            setDataCount(datacount)
            setRecords(response.data.stage_3.reverse())
        }).catch((error) => {
            console.log("error", error)
        })

    } 

    const handleSearch = e => {
        let target = e.target
        setFilterFn({
            fn: items => {
                if(target.value == "")
                    return items;
                else
                    return items.filter(x => x.barcode_id.includes(target.value) || x.NAME.includes(target.value) || x.BRAND.includes(target.value)) 
                    
            }
        })
    }

    const [tableSelected, setTableSelected] = useState(0)
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
        setTableSelected(newValue)
    };

    return (
        <>
            <TabPanel value={value} index={0}>
                <Toolbar>
                    <Controls.Input
                        label="ค้นหา"
                        className={classes.searchInput}
                        InputProps={{
                                startAdornment: (<InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                    <span className="box-data-count">ข้อมูลดำเนินการเสร็จสิ้น จำนวนทั้งหมดในระบบ : {dataCount} รายการ</span>
                </Toolbar>
                <TbContainer>
                    <TbHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map((items, index) => (
                                <TableRow key={items.products_per_serving_id}>
                                    <TableCell style={{ width: 5 }} component="th" scope="row">
                                        {/* {index+1} */}
                                        {items.products_per_serving_id}
                                    </TableCell>
                                    <TableCell style={{ width: 5 }}>
                                        {items.barcode_id}
                                    </TableCell>
                                    <TableCell style={{ width: 120 }}>
                                        {items.BRAND}
                                    </TableCell>
                                    <TableCell style={{ width: 250 }}>
                                        {items.NAME}
                                    </TableCell>
                                    {/* <TableCell style={{ width: 40 }}>
                                        {items.updated_at}
                                    </TableCell> */}
                                    <TableCell style={{ width: 10 }} align="right">
                                        <Link to={`/foodchoiceEdit/${items.products_per_serving_id}`} className="link-edit" ><EditIcon /></Link>
                                        {/* <Link to={`/foodchoice/foodchoiceForm/${items.id}`} className="link-edit" ><EditIcon /></Link> */}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </TbContainer>
                <TablePaginations/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                ข้อมูลอยู่ระหว่างดำเนินการ
            </TabPanel>
            <TabPanel value={value} index={2}>
            <Toolbar>
                    <Controls.Input
                        label="ค้นหา"
                        className={classes.searchInput}
                        InputProps={{
                                startAdornment: (<InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                </Toolbar>
                <TbContainer>
                    <TbHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map((items, index) => (
                                <TableRow key={items.products_per_serving_id}>
                                    <TableCell style={{ width: 5 }} component="th" scope="row">
                                        {/* {index+1} */}
                                        {items.products_per_serving_id}
                                    </TableCell>
                                    <TableCell style={{ width: 5 }}>
                                        {items.barcode_id}
                                    </TableCell>
                                    <TableCell style={{ width: 120 }}>
                                        {items.BRAND}
                                    </TableCell>
                                    <TableCell style={{ width: 250 }}>
                                        {items.NAME}
                                    </TableCell>
                                    {/* <TableCell style={{ width: 40 }}>
                                        {items.updated_at}
                                    </TableCell> */}
                                    <TableCell style={{ width: 10 }} align="right">
                                        <Link to={`/foodchoiceEdit/${items.products_per_serving_id}`} className="link-edit" ><EditIcon /></Link>
                                        {/* <Link to={`/foodchoice/foodchoiceForm/${items.id}`} className="link-edit" ><EditIcon /></Link> */}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </TbContainer>
                <TablePaginations/>
            </TabPanel>
            <TabPanel value={value} index={3}>
            <Toolbar>
                    <Controls.Input
                        label="ค้นหา"
                        className={classes.searchInput}
                        InputProps={{
                                startAdornment: (<InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                </Toolbar>
                <TbContainer>
                    <TbHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map((items, index) => (
                                <TableRow key={items.products_per_serving_id}>
                                    <TableCell style={{ width: 5 }} component="th" scope="row">
                                        {/* {index+1} */}
                                        {items.products_per_serving_id}
                                    </TableCell>
                                    <TableCell style={{ width: 5 }}>
                                        {items.barcode_id}
                                    </TableCell>
                                    <TableCell style={{ width: 120 }}>
                                        {items.BRAND}
                                    </TableCell>
                                    <TableCell style={{ width: 250 }}>
                                        {items.NAME}
                                    </TableCell>
                                    {/* <TableCell style={{ width: 40 }}>
                                        {items.updated_at}
                                    </TableCell> */}
                                    <TableCell style={{ width: 10 }} align="right">
                                        <Link to={`/foodchoiceEdit/${items.products_per_serving_id}`} className="link-edit" ><VisibilityIcon /></Link>
                                        {/* <Link to={`/foodchoice/foodchoiceForm/${items.id}`} className="link-edit" ><EditIcon /></Link> */}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </TbContainer>
                <TablePaginations/>
            </TabPanel>  
        </>
    )
}

export default Foodchoice3
