// src/pages/CreateChama.jsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Slider,
  MenuItem,
  IconButton,
  Fade,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add, Remove } from '@mui/icons-material';
// Import parseEther from viem
import { parseEther } from 'viem';
import { useCreateChama } from '../hooks/useChamaFactory';

const CreateChama = () => {
  // Form states
  const [chamaName, setChamaName] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [contributionCycle, setContributionCycle] = useState('daily'); // default to daily
  const [depositAmount, setDepositAmount] = useState(''); // as string
  const [contributionAmount, setContributionAmount] = useState(''); // as string
  const [penalty, setPenalty] = useState(0);
  const [maxMembers, setMaxMembers] = useState(1);
  const [rules, setRules] = useState('');
  const [formVisible, setFormVisible] = useState(true);

  // Helper function to convert contribution cycle to seconds
  const getCycleDurationInSeconds = (cycle) => {
    switch (cycle) {
      case 'weekly':
        return 86400 * 7; // 7 days
      case 'monthly':
        return 86400 * 30; // ~30 days
      case 'daily':
      default:
        return 86400; // 1 day
    }
  };

  // Convert the selected cycle to seconds
  const cycleDurationInSeconds = getCycleDurationInSeconds(contributionCycle);

  // Prepare contract parameters (convert ETH values to wei using parseEther)
  const params = {
    name: chamaName,
    description,
    depositAmount: depositAmount ? parseEther(depositAmount.toString()) : undefined,
    contributionAmount: contributionAmount ? parseEther(contributionAmount.toString()) : undefined,
    penalty: BigInt(penalty),
    maxMembers: BigInt(maxMembers),
    cycleDuration: BigInt(cycleDurationInSeconds),
  };

  const { write, isLoading, error } = useCreateChama(params);

  const handleIncrementMaxMembers = () => setMaxMembers(prev => prev + 1);
  const handleDecrementMaxMembers = () => {
    if (maxMembers > 1) setMaxMembers(prev => prev - 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Creating Chama with data:", {
      chamaName,
      description,
      startDateTime,
      contributionCycle,
      depositAmount,
      contributionAmount,
      penalty,
      maxMembers,
      rules,
      cycleDuration: cycleDurationInSeconds,
    });
    if (write) {
      write();
      console.log("Transaction submitted");
    } else {
      console.error("Write function is not available. Ensure all required inputs are provided and the contract configuration is correct.");
    }
  };

  const handleCancel = () => console.log('Creation cancelled');

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Fade in={formVisible} timeout={1000}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff, #f7f9fc)',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
            Create Your Chama
          </Typography>
          <Typography variant="body2" gutterBottom color="text.secondary" sx={{ mb: 3 }}>
            Fill out the details below to launch your decentralized savings group.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Chama Name"
                  fullWidth
                  required
                  value={chamaName}
                  onChange={(e) => setChamaName(e.target.value)}
                  inputProps={{ 'aria-label': 'Chama Name' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description & Goals"
                  fullWidth
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  inputProps={{ 'aria-label': 'Description and Goals' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Start Date & Time"
                    value={startDateTime}
                    onChange={(newValue) => setStartDateTime(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        inputProps={{
                          ...params.inputProps,
                          'aria-label': 'Start Date and Time',
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contribution Cycle"
                  select
                  fullWidth
                  required
                  value={contributionCycle}
                  onChange={(e) => setContributionCycle(e.target.value)}
                  inputProps={{ 'aria-label': 'Contribution Cycle' }}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Deposit Amount (in ETH)"
                  type="number"
                  fullWidth
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  inputProps={{ 'aria-label': 'Deposit Amount', min: 0, step: "any" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contribution Amount per Cycle (in ETH)"
                  type="number"
                  fullWidth
                  required
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  inputProps={{ 'aria-label': 'Contribution Amount per Cycle', min: 0, step: "any" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Penalty Slash (in %): {penalty}%
                </Typography>
                <Slider
                  value={penalty}
                  onChange={(e, newValue) => setPenalty(newValue)}
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                  aria-labelledby="penalty-slider"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Maximum Members
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={handleDecrementMaxMembers} aria-label="Decrease maximum members">
                    <Remove />
                  </IconButton>
                  <Typography variant="body1" sx={{ mx: 2 }} aria-label="Maximum Members Count">
                    {maxMembers}
                  </Typography>
                  <IconButton onClick={handleIncrementMaxMembers} aria-label="Increase maximum members">
                    <Add />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Rules & Regulations"
                  fullWidth
                  multiline
                  rows={3}
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  inputProps={{ 'aria-label': 'Rules and Regulations' }}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.02)' } }}
                aria-label="Cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.02)' } }}
                aria-label="Create Chama"
              >
                {isLoading ? 'Creating...' : 'Create Chama'}
              </Button>
            </Box>
            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {error.message}
              </Typography>
            )}
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default CreateChama;
