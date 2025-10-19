import React from 'react';
import { Box, Grid, TextField, Button, IconButton, Typography } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

/**
 * Reusable KeyValueList component
 * 
 * Props:
 * - items: array of { key: string, value: string }
 * - setItems: setter function for updating the array
 * - title: string for section header (e.g., "Custom Headers")
 * - keyLabel: label for key field
 * - valueLabel: label for value field
 */
export default function KeyValueList({ items, setItems, title = 'Items', keyLabel = 'Key', valueLabel = 'Value' }) {

    const handleChange = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    const addItem = () => setItems([...items, { key: '', value: '' }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    return (
        <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>{title}</Typography>
            {items.map((item, index) => (
                <Grid container spacing={1} alignItems="center" key={index} sx={{ mb: 1 }}>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            label={keyLabel}
                            value={item.key}
                            onChange={(e) => handleChange(index, 'key', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            label={valueLabel}
                            value={item.value}
                            onChange={(e) => handleChange(index, 'value', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton color="error" onClick={() => removeItem(index)}>
                            <RemoveCircle />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}

            <Button startIcon={<AddCircle />} onClick={addItem} variant="outlined">
                Add {title.slice(0, -1)}
            </Button>
        </Box>
    );
}
