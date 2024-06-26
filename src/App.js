import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead,TableRow, IconButton, Typography} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {Footer} from './Footer';

const API_URL = 'https://canopy-frontend-task.now.sh/api/holdings';

function HoldingsTable() {
  const [holdings, setHoldings] = useState([]);

  //to check for each individual group whether they are dropped down or not
  const [is_dropped_down, set_dropped_down] = useState({});

  //simple fetching the data as payload
  useEffect(() => {
    axios.get(API_URL)
        .then(response => setHoldings(response.data.payload))
        .catch(error => console.error("Error fetching data: ", error));
  }, []);

  //Below, I've created a function to check whether if any group is dropped down or not
  const toggleGroup = (assetClass) => {
    const isCurrentlyOpen = is_dropped_down[assetClass];
    set_dropped_down(prev => ({
      ...prev,
      [assetClass]: !isCurrentlyOpen
    }));
  };

  const groupHoldings = (holdings) => {
    return holdings.reduce((acc, holding) => {
      const { asset_class } = holding;
      if (!acc[asset_class]) acc[asset_class] = [];
      acc[asset_class].push(holding);
      return acc;
    }, {});
  };

  const groupedHoldings = groupHoldings(holdings);
//here, above I've grouped items, using map, with key as asset_class and the object as value
  return (
      <>
        {/*left some space here so that items don't get hidden behind the footer and we are able to scroll past it*/}
        <div style={{ paddingBottom: '100px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

          <TableContainer style={{ borderRadius: '8px', overflow: 'hidden' }}>
            <Table aria-label="holdings table">
              <TableBody>
              {/*I am simply iterating over the grouped elements*/}
                {Object.entries(groupedHoldings).map(([assetClass, assets]) => (
                    <React.Fragment key={assetClass}>
                      <TableRow>
                        <TableCell style={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton size="small" onClick={() => toggleGroup(assetClass)}>
                            {is_dropped_down[assetClass] ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                          </IconButton>
                          <Typography variant="subtitle1" fontWeight="bold" style={{ marginLeft: '8px' }}>{assetClass.toUpperCase()} ({assets.length})</Typography>
                        </TableCell>
                      </TableRow>
                      {is_dropped_down[assetClass] && (
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ fontWeight: 'bold', color: '#666666' }}>Name of the Holding</TableCell>
                                <TableCell align="left" style={{ fontWeight: 'bold', color: '#666666' }}>Ticker</TableCell>
                                <TableCell align="left" style={{ fontWeight: 'bold', color: '#666666' }}>Average Price</TableCell>
                                <TableCell align="left" style={{ fontWeight: 'bold', color: '#666666' }}>Market Price</TableCell>
                                <TableCell align="left" style={{ fontWeight: 'bold', color: '#666666' }}>Latest Change Percentage</TableCell>
                                <TableCell align="left" style={{ fontWeight: 'bold', color: '#666666' }}>Market Value in Base CCY</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {assets.map((holding, i) => (
                                  <TableRow key={holding.ticker} style={{ backgroundColor: i % 2 !== 0 ? '#f2f2f2' : 'inherit' }}>
                                    <TableCell>{holding.name}</TableCell>
                                    <TableCell align="left">{holding.ticker}</TableCell>
                                    <TableCell align="left">{parseFloat(holding.avg_price) || 'N/A'}</TableCell>
                                    <TableCell align="left">{parseFloat(holding.market_price) || 'N/A'}</TableCell>
                                    <TableCell align="left" style={{ fontWeight: holding.latest_chg_pct < 0 ? 'bold' : 'bold', color: holding.latest_chg_pct < 0 ? 'red' : 'green' }}>
                                      {parseFloat(holding.latest_chg_pct) || 'N/A'}
                                    </TableCell>
                                    <TableCell align="left">{parseFloat(holding.market_value_ccy)}</TableCell>
                                  </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                      )}
                      <TableRow style={{ borderBottom: '2px solid #000000' }} />
                    </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Footer />
      </>
  );
}

export default HoldingsTable;
