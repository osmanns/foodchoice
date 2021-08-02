import React from 'react'

import { makeStyles } from '@material-ui/core'
import { AppBar, Toolbar, Typography, Button, IconButton, Grid, InputBase } from '@material-ui/core'

import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#2979ff',
    },
    toolbar: {
      minHeight: 15,
      paddingTop: theme.spacing(0),
      paddingBottom: theme.spacing(0),
    },
  }));

export default function Header() {
    const classes = useStyles();

    return (
            <AppBar position="static" className={classes.root}>
                <Toolbar className={classes.toolbar}>
                    <Grid container>
                        <Grid item >
                            <InputBase />
                        </Grid>
                        <Grid item sm></Grid>
                        <Grid item >
                            <IconButton>
                                <PowerSettingsNewIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
    )
}
