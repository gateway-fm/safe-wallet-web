import { Tooltip, SvgIcon, Typography, List, ListItem, Box, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import type { ReactElement } from 'react'

import SubaccountsIcon from '@/public/images/sidebar/subaccounts-icon.svg'
import Subaccounts from '@/public/images/sidebar/subaccounts.svg'
import InfoIcon from '@/public/images/notifications/info.svg'

export function SubaccountInfo(): ReactElement {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Subaccounts />
      <Box sx={{ display: 'flex', gap: 1, py: 1 }}>
        <Typography fontWeight={700}>No Subaccounts yet</Typography>
        <Tooltip
          title="Subaccounts are separate wallets owned by your main Account, perfect for organizing different funds and projects."
          placement="top"
          arrow
          sx={{ ml: 1 }}
        >
          <span>
            <SvgIcon
              component={InfoIcon}
              inheritViewBox
              fontSize="small"
              color="border"
              sx={{ verticalAlign: 'middle' }}
            />
          </span>
        </Tooltip>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pt: 3, pb: 4 }}>
        <Avatar sx={{ padding: '20px', backgroundColor: 'success.background' }}>
          <SvgIcon component={SubaccountsIcon} inheritViewBox color="success" sx={{ fontSize: 20 }} />
        </Avatar>
        <Typography variant="body2" fontWeight={700}>
          With Subaccounts you can:
        </Typography>
      </Box>
      <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[
          'Use them for specific cases such as DeFi operations',
          'Install modules to execute transactions, bypassing thresholds',
          'Make sure that this Safe is not exposed to additional risks',
        ].map((item) => {
          return (
            <ListItem key={item} sx={{ p: 0, pl: 1.5, alignItems: 'unset' }}>
              <ListItemAvatar sx={{ minWidth: 'unset', mr: 3 }}>
                <Avatar sx={{ width: 25, height: 25, backgroundColor: 'success.background' }}>
                  <CheckIcon fontSize="small" color="success" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: 'body2' }}>
                {item}
              </ListItemText>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}