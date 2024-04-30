import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import { SettingTabType } from 'src/types/settings';

const ButtonStyled = styled('button')<{ active: boolean }>`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    left: 0;
    bottom: -17px;
    height: 2px;
    background: #212b36;
    opacity: 0;
    transition: opacity 400ms ease;
  }

  svg path {
    transition: color 400ms ease;
  }

  span {
    color: #637381;
    margin-left: 8px;
  }

  ${({ active }) =>
    active &&
    `
    color: #006838;
      &::before {
        opacity: 1;
      }
  `}
`;

interface Prop {
  tab: SettingTabType;
  setTab: (tab: SettingTabType) => void;
}

const Tabs = ({ tab, setTab }: Prop) => (
  <Stack
    direction="row"
    spacing="40px"
    sx={{
      borderBottom: '2px solid #F6F7F8',
      marginBottom: '58px',
      paddingBottom: '15px',
    }}
  >
    <ButtonStyled active={tab === 'api'} onClick={() => setTab('api')}>
      <svg
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_559_11891)">
          <path
            d="M14.5212 10.1465H13.4884C13.4895 10.5314 13.4925 11.8234 13.4945 12.1922C13.8646 12.1904 14.2843 12.1886 14.5213 12.1886C15.1143 12.1886 15.6153 11.721 15.6153 11.1676C15.6153 10.6141 15.1143 10.1465 14.5212 10.1465ZM7.02734 13.3519H8.7352L7.88521 11.1801L7.02734 13.3519Z"
            fill="currentColor"
          />
          <path
            d="M24.6336 14.5725L22.9997 13.6628C23.0515 13.2547 23.0769 12.8714 23.0769 12.5016C23.0769 12.1317 23.0515 11.7484 22.9997 11.3403L24.6336 10.4307C24.9839 10.2356 25.104 9.80368 24.9017 9.46589L21.4271 3.66266C21.2249 3.32488 20.7769 3.2091 20.4266 3.40417L18.7994 4.31003C18.1574 3.85213 17.4566 3.46449 16.7068 3.15236V1.33322C16.7068 0.943171 16.3789 0.626953 15.9744 0.626953H9.02549C8.621 0.626953 8.29307 0.943171 8.29307 1.33322V3.15232C7.54331 3.46439 6.84253 3.85213 6.20049 4.30998L4.57334 3.40412C4.22305 3.2091 3.7751 3.32483 3.57286 3.66262L0.0982459 9.46589C-0.104 9.80368 0.0160193 10.2356 0.366312 10.4307L2.0002 11.3403C1.94834 11.7484 1.92295 12.1317 1.92295 12.5016C1.92295 12.8714 1.94834 13.2547 2.0002 13.6628L0.366312 14.5725C0.0160193 14.7675 -0.104 15.1994 0.0982459 15.5372L3.57286 21.3405C3.7751 21.6782 4.22305 21.794 4.57334 21.5989L6.20049 20.6931C6.84253 21.151 7.54331 21.5387 8.29307 21.8507V23.6699C8.29307 24.0599 8.621 24.3761 9.02549 24.3761H15.9745C16.379 24.3761 16.7069 24.0599 16.7069 23.6699V21.8507C17.4567 21.5386 18.1575 21.1509 18.7995 20.6931L20.4267 21.599C20.777 21.794 21.2249 21.6783 21.4272 21.3405L24.9018 15.5373C25.104 15.1994 24.984 14.7675 24.6336 14.5725ZM10.6413 16.2228C10.5562 16.2538 10.4688 16.2685 10.3828 16.2685C10.0868 16.2685 9.80811 16.0942 9.69747 15.8114L9.28804 14.7653H6.46949L6.05552 15.8134C5.91153 16.1779 5.48843 16.3609 5.1104 16.2221C4.73238 16.0833 4.54268 15.6752 4.68663 15.3107C4.68663 15.3107 7.07442 9.26532 7.07666 9.26004C7.14212 9.10466 7.2542 8.97167 7.39854 8.8781C7.54288 8.78453 7.7129 8.73466 7.88682 8.73486H7.8878C8.06157 8.73448 8.2315 8.7841 8.37586 8.87737C8.52022 8.97064 8.63243 9.10332 8.69815 9.25844C8.70088 9.26484 11.0679 15.3127 11.0679 15.3127C11.2108 15.6776 11.0198 16.0851 10.6413 16.2228ZM14.5213 13.602C14.2835 13.602 13.8582 13.6038 13.4862 13.6057V15.562C13.4862 15.9521 13.1583 16.2683 12.7538 16.2683C12.3493 16.2683 12.0214 15.9521 12.0214 15.562V9.44334C12.0211 9.3504 12.0398 9.25832 12.0765 9.17238C12.1132 9.08643 12.1671 9.00831 12.2351 8.94249C12.3031 8.87667 12.384 8.82444 12.473 8.78881C12.562 8.75317 12.6574 8.73482 12.7538 8.73482H14.5213C15.9322 8.73482 17.0801 9.82651 17.0801 11.1684C17.0801 12.5103 15.9322 13.602 14.5213 13.602ZM19.4824 15.562C19.4824 15.9521 19.1545 16.2683 18.75 16.2683C18.3455 16.2683 18.0176 15.9521 18.0176 15.562V9.44108C18.0176 9.05103 18.3455 8.73482 18.75 8.73482C19.1545 8.73482 19.4824 9.05103 19.4824 9.44108V15.562Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_559_11891">
            <rect width="25" height="24.1071" fill="white" transform="translate(0 0.447266)" />
          </clipPath>
        </defs>
      </svg>
      <span>API Ключи</span>
    </ButtonStyled>
    <ButtonStyled active={tab === 'tokens'} onClick={() => setTab('tokens')}>
      <svg
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.84222 5.06821L15.8085 2.34783L15.2807 1.28101C14.9354 0.58758 14.0932 0.301224 13.3998 0.646535L4.47782 5.06821H5.84222ZM18.9023 2.42643C18.7788 2.42643 18.6552 2.44328 18.5317 2.47697L16.1904 3.11706L9.03986 5.06821H20.6934L20.2555 3.46237C20.087 2.83632 19.5199 2.42643 18.9023 2.42643ZM22.1561 6.0508H1.40651C0.962942 6.0508 0.567097 6.25574 0.308815 6.5786C0.190904 6.72739 0.101067 6.89864 0.0505334 7.08674C0.0196519 7.20465 0 7.32818 0 7.45451V23.0946C0 23.8695 0.62886 24.4983 1.40371 24.4983H22.1533C22.9282 24.4983 23.557 23.8695 23.557 23.0946V19.1783H15.2274C13.9107 19.1783 12.8411 18.1086 12.8411 16.792V13.6701C12.8411 13.0244 13.0994 12.4377 13.5177 12.0082C13.8883 11.6263 14.3852 11.368 14.941 11.3035C15.0337 11.2923 15.1291 11.2866 15.2246 11.2866H23.557V7.45451C23.5598 6.67966 22.9309 6.0508 22.1561 6.0508Z"
          fill="currentColor"
        />
        <path
          d="M24.5429 12.6295C24.4025 12.5003 24.2369 12.4021 24.0516 12.3375C23.9084 12.2898 23.7568 12.2617 23.5968 12.2617H15.2279C14.4531 12.2617 13.8242 12.8906 13.8242 13.6654V16.79C13.8242 17.5649 14.4531 18.1938 15.2279 18.1938H23.5968C23.7568 18.1938 23.9084 18.1657 24.0516 18.118C24.2369 18.0562 24.4025 17.9551 24.5429 17.826C24.8237 17.5705 25.0005 17.1999 25.0005 16.7901V13.6654C25.0005 13.2555 24.8237 12.8849 24.5429 12.6295ZM18.1589 15.5071C18.1589 15.8945 17.8444 16.2089 17.457 16.2089H16.991C16.6036 16.2089 16.2891 15.8945 16.2891 15.5071V15.041C16.2891 14.8164 16.393 14.6171 16.5586 14.4907C16.6794 14.3981 16.8282 14.3392 16.991 14.3392H17.457C17.8444 14.3392 18.1589 14.6536 18.1589 15.041V15.5071Z"
          fill="currentColor"
        />
      </svg>
      <span>Кошельки</span>
    </ButtonStyled>
  </Stack>
);

export default Tabs;
