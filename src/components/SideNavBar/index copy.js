import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { withStyles } from '@mui/styles';
import About from '../../icons/About';
import Swap from '../../icons/Swap';
import Tutorial from '../../icons/Tutorial';
import Bridge from '../../icons/Bridge';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const componentStyle = theme => {
    return ({
        indicator: {
            display: 'none'
        },
        tabBtn: {
            display: 'flex',
            justifyContent: 'space-evenly',
            padding: '10px 25px',
            minHeight: '50px',
            maxHeight: '50px',
            width: '180px',
            borderRadius: '0 10px 10px 0',
            marginBottom: '45px',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'capitalize',
            '&.Mui-selected': {
                background: '#1b5e2040',
                borderLeft: 'solid 8px #25e729'
            }
        }
    })
};

const VerticalTabs = (props) => {
    const [value, setValue] = React.useState(0);
    const { classes } = props;
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const tabList = [
        { id: 1, label: 'Swap' },
        { id: 2, label: 'Tutorial' },
        { id: 3, label: 'Bridge' },
        { id: 4, label: 'About' },
    ];

    const renderIcon = (id, index) => {
        switch (id) {
            case 1:
                return <Swap key={id} selected={value === index} />
            case 2:
                return <Tutorial key={id} selected={value === index} />
            case 3:
                return <Bridge key={id} selected={value === index} />
            case 4:
                return <About key={id} selected={value === index} />
            default:

        }
    }
    return (
        <Box
            sx={{ bgcolor: 'background.paper', display: 'flex', width: 220 }}
        >
            <Tabs
                orientation="vertical"
                variant="standard"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ width: 220, pr: '20px', pt: '40px' }}
                textColor="primary"
                classes={{ indicator: classes.indicator }}
            >
                {/* <Swap key={list.id} selected={value === index} /> */}
                {tabList.map((list, index) =>
                    <Tab
                        label={value === index ? list.label : ''}
                        iconPosition="start"
                        key={index}
                        classes={{ root: classes.tabBtn }}
                        icon={renderIcon(list.id, index)}
                    />
                )}
            </Tabs>
            {/* <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel> */}
        </Box>
    );
}

export default withStyles(componentStyle, { withTheme: true })(
    VerticalTabs
);