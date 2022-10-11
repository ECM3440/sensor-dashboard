import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    appBar: {
        top: "auto",
        bottom: 0
    },
    typo: {
        flexGrow: 1,
        textAlign: "center"
    }
}));


export default function Navbar() {
    const classes = useStyles();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.typo} component="div" sx={{ flexGrow: 1 }}>
                        IoT Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
