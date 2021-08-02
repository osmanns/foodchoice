import React from 'react'

import { Paper, Card, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        background: '#fdfdff'
    },
    pageHeader: {
        paddingTop: theme.spacing(1),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        display: 'flex',
    },
    pageIcon: {
    },
    pageTitle: {
        '& .MuiTypography-subtitle2': {
            opacity: '0.6'
        }
    },
}))

export default function PageHeader(props) {

    const classes = useStyles();
    const { title, subtitle, icon } = props;

    return (
        <Paper elevation={0} square className={classes.root}>
            <div className={classes.pageHeader}>
                <Card>
                    {icon}
                </Card>
                <div className={classes.pageTitle}>
                    <Typography 
                        variant="h6"
                        component="div">
                        {title}
                    </Typography> 
                    <Typography 
                        variant="subtitle2"
                        component="div">
                        {subtitle}
                    </Typography> 
                </div>
            </div>
        </Paper>
    )
}
