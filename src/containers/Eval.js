import React from 'react';
import PropTypes from 'prop-types'

import { makeStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import RegularEval from './RegularEval';

function TabPanel(props) {
    const { children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            className={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
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
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 400,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function Upload() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    return (
        <div className = "eval-container">
            <div className = {classes.root}>
                <Tabs 
                    orientation="vertical"
                    variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                    aria-label="upload tabs"
                    className={classes.tabs}
                >
                    <Tab label="정기 음평회" {...a11yProps(0)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <RegularEval />
                </TabPanel>
            </div>
        </div>
    );
}