import { useMediaQuery, Box, Drawer} from '@mui/material';
import SidebarItems from './SidebarItems';
import { Sidebar } from 'react-mui-sidebar';
import logo from '../../../assets/images/logos/logo-bkk.png';

const MSidebar = (props) => {

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const sidebarWidth = '270px';

  // Custom CSS for short scrollbar
  const scrollbarStyles = {
    '&::-webkit-scrollbar': {
      width: '7px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#eff2f7',
      borderRadius: '15px',
    },
  };

  // Define a style object for the logo and text
  const logoStyle = {
    width: '50px', // Adjust the width of the logo
    height: 'auto', // Maintain the aspect ratio
    marginRight: '10px', // Add space between the logo and text
  };


  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
        }}
      >
        <Drawer
          anchor="left"
          open={props.isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              boxSizing: 'border-box',
              ...scrollbarStyles,
            },
          }}
        >
          <Box sx={{ height: '100%' }}>
            <Sidebar
              width={'270px'}
              collapsewidth="80px"
              open={props.isSidebarOpen}
              themeColor="#5d87ff"
              themeSecondaryColor="#49beff"
              showProfile={false}
            >
              {/* Logo and Text Wrapper */}
              <Box className="d-flex justify-content-center align-items-center" sx={{ padding: '10px' }}>
                <img src={logo} alt="Logo" style={logoStyle} />
                <div className="fs-6 fw-bold">
                  Bursa Kerja Khusus <br /> SMK ISLAM MALAHAYATI
                </div>
              </Box>
              <Box>
                <SidebarItems />
      
              </Box>
            </Sidebar>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          boxShadow: (theme) => theme.shadows[8],
          ...scrollbarStyles,
        },
      }}
    >
      <Sidebar
        width={'270px'}
        collapsewidth="80px"
        isCollapse={false}
        mode="light"
        direction="ltr"
        themeColor="#5d87ff"
        themeSecondaryColor="#49beff"
        showProfile={false}
      >
        {/* Logo and Text Wrapper */}
        <Box className="d-flex justify-content-center align-items-center" sx={{ padding: '10px' }}>
          <img src={logo} alt="Logo" style={logoStyle} />
          <div className="fs-6 fw-bold">
            Bursa Kerja Khusus <br /> SMK ISLAM MALAHAYATI
          </div>
        </Box>
        <SidebarItems />
      </Sidebar>
    </Drawer>
  );
};

export default MSidebar;
