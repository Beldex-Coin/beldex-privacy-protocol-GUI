import React from 'react';
import PropTypes from 'prop-types';
import { Box, Drawer } from '@mui/material';
import { SideNavBar } from '../../components';

const drawerWidth = 220;

const SidePanel = (props) => {
  const { window, handleDrawerToggle, mobileOpen } = props;
  const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 }, mt: '124px' }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', background: '#13131a', width: drawerWidth },
        }}
      >
        <SideNavBar sxObj={false} />
      </Drawer>
      <SideNavBar sxObj={true} />
    </Box>
  )
}

SidePanel.propTypes = {
  window: PropTypes.func,
};
export default SidePanel;