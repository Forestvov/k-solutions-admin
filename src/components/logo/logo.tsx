import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';
import {useTheme} from "@mui/material/styles";

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();

    const PRIMARY_LIGHT = theme.palette.primary.light;

    const PRIMARY_MAIN = theme.palette.primary.main;

    const PRIMARY_DARK = theme.palette.primary.dark;

    // OR using local (public folder)
    // -------------------------------------------------------
    // const logo = (
    //   <Box
    //     component="img"
    //     src="/logo/logo_single.svg" => your path
    //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    //   />
    // );

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 40,
          height: 40,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <svg width="100%" height="100%" viewBox="0 0 31 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24.0957 19.6089C22.3546 19.6089 20.8584 19.2026 19.607 18.3901C18.3738 17.5595 17.5123 16.422 17.0226 14.9775L18.6549 14.0295C18.9995 15.2032 19.6342 16.124 20.5591 16.7921C21.4841 17.4421 22.672 17.7671 24.1229 17.7671C25.5375 17.7671 26.6347 17.4602 27.4145 16.8463C28.2125 16.2143 28.6115 15.3837 28.6115 14.3546C28.6115 13.3615 28.2488 12.6121 27.5233 12.1066C26.7979 11.601 25.6009 11.0774 23.9324 10.5357C21.9556 9.88568 20.6498 9.36206 20.0151 8.96483C18.5642 8.09814 17.8388 6.84324 17.8388 5.20014C17.8388 3.59315 18.401 2.32923 19.5254 1.40837C20.6498 0.469457 22.0372 0 23.6876 0C25.1747 0 26.4624 0.388205 27.5506 1.16461C28.6387 1.92297 29.4458 2.89799 29.9717 4.08969L28.3667 4.98347C27.4961 2.88897 25.9365 1.84172 23.6876 1.84172C22.5088 1.84172 21.5566 2.13061 20.8312 2.70841C20.1058 3.2862 19.743 4.08969 19.743 5.11889C19.743 6.0578 20.0695 6.76199 20.7224 7.23144C21.3753 7.7009 22.4544 8.17939 23.9596 8.6669C24.6488 8.90163 25.1385 9.07316 25.4286 9.1815C25.737 9.27178 26.1722 9.43428 26.7344 9.66901C27.3148 9.88568 27.741 10.0843 28.013 10.2649C28.2851 10.4274 28.6115 10.6621 28.9924 10.969C29.3913 11.2579 29.6725 11.5559 29.8357 11.8628C30.017 12.1517 30.1712 12.5128 30.2981 12.9462C30.4432 13.3615 30.5158 13.8129 30.5158 14.3004C30.5158 15.9074 29.9264 17.1984 28.7475 18.1734C27.5687 19.1304 26.0181 19.6089 24.0957 19.6089Z" fill="#373737"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M10.1743 19.5847H16.2135L10.2831 9.8344L15.9415 0.625815H9.90222L5.44078 8.20935V0.625815H0V19.5847H5.44078V11.4594L10.1743 19.5847ZM4.5 1.80444L1.04302 1.79465V18.5341H4.5V1.80444ZM10.3259 1.66884L5.94524 9.49152H9.38722L14.0808 1.66884H10.3259ZM14.3937 18.5658L9.38722 10.3259H5.84094L10.8475 18.5658H14.3937Z" fill={PRIMARY_LIGHT}/>
        </svg>

      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
