import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { GlobalContext } from '../context/AppContext';
import dayjs from 'dayjs';

export default function DateRange({setStartDate,setEndDate,startDate,endDate}) {
    const {darkMode,setDarkMode} = React.useContext(GlobalContext);

    // Define a dark theme
    const darkTheme = createTheme({
        palette: {
            mode: darkMode? 'dark':'light',
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline /> {/* Applies global dark styles */}
            <Box sx={{ overflow: 'hidden', width: '100%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                        components={['DateField', 'DateField']}
                        sx={{ overflow: 'hidden', width: '100%' }}
                    >
                        <DateField
                            label="From"
                            format="DD/MM/YYYY"
                            value={startDate.length > 0 ? dayjs(startDate, 'DD/MM/YYYY'):null}
                            onChange={(newValue) => {
                                 if (newValue?.isValid()) {
                                    setStartDate(newValue.format('DD/MM/YYYY'));
                                } else {
                                    setStartDate('');
                                }
                            }}
                            slotProps={{
                                textField: {
                                    sx: {
                                        height: 40,
                                        '& .MuiInputBase-root': { height: 40 },
                                    },
                                    InputProps: { sx: { height: 40 } }
                                },
                                
                            }}
                        />
                        <DateField
                            label="To"
                            value={endDate.length > 0 ? dayjs(endDate, 'DD/MM/YYYY'):null}
                            format="DD/MM/YYYY"
                            onChange={(newValue) => {
                                 if (newValue?.isValid()) {
                                    setEndDate(newValue.format('DD/MM/YYYY'));
                                } else {
                                    setEndDate('');
                                }
                            }}
                            slotProps={{
                                textField: {
                                    sx: {
                                        height: 40,
                                        '& .MuiInputBase-root': { height: 40 },
                                    },
                                    InputProps: { sx: { height: 40 } }
                                },
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </Box>
        </ThemeProvider>
    );
}
