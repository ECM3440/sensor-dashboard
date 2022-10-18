import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles } from "@mui/styles";


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
