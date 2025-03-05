// src/pages/JoinChama.jsx
import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
  useAccount,
  useReadContract,
  useWriteContract,
} from "wagmi";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  CircularProgress,
  Alert,
} from "@mui/material";
import { MonetizationOn, Groups, CalendarToday } from "@mui/icons-material";
import ChamaFactoryABI from "../contracts/ChamaFactoryABI.json";

const CONTRACT_ADDRESS = "0x5830c4F9c831d4Aa90D2337c4D678cA3b3E75ac7";

const JoinChama = () => {
  const { address, isConnected } = useAccount();
  const [chamas, setChamas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedChama, setSelectedChama] = useState(null);

  // Fetch chama count from contract
  const { data: chamaCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ChamaFactoryABI,
    functionName: "chamaCount",
    watch: true,
  });

  // Prepare join transaction
  const { config: joinConfig } = useWriteContract({
    address: CONTRACT_ADDRESS,
    abi: ChamaFactoryABI,
    functionName: "joinChama",
    args: [selectedChama?.id],
    overrides: {
      value: selectedChama?.depositAmount 
        ? ethers.utils.parseEther(selec8tedChama.depositAmount.toString())
        : undefined,
    },
    enabled: !!selectedChama,
  });

  const { write: joinChama, isLoading: isJoining } = useWriteContract({
    ...joinConfig,
    onSuccess: () => {
      setOpen(false);
      fetchChamas();
    },
    onError: (error) => setError(error.message),
  });

  const fetchChamas = useCallback(async () => {
    try {
      if (!chamaCount) return;

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ChamaFactoryABI,
        provider
      );

      const chamaArray = [];
      for (let i = 1; i <= chamaCount; i++) {
        const chamaData = await contract.chamas(i);
        const membersCount = await contract.getMembersCount(i);
        
        if (chamaData.isActive && membersCount < chamaData.maxMembers) {
          chamaArray.push({
            id: i,
            name: chamaData.name,
            description: chamaData.description,
            depositAmount: ethers.utils.formatEther(chamaData.depositAmount),
            contributionAmount: ethers.utils.formatEther(chamaData.contributionAmount),
            penaltyPercentage: chamaData.penalty,
            maxMembers: chamaData.maxMembers.toString(),
            contributionCycle: formatCycleDuration(chamaData.cycleDuration),
            membersCount: membersCount.toString(),
          });
        }
      }

      setChamas(chamaArray);
      setLoading(false);
    } catch (err) {
      setError("Failed to load Chamas");
      setLoading(false);
    }
  }, [chamaCount, useAccount]);

  useEffect(() => {
    if (isConnected && chamaCount !== undefined) {
      fetchChamas();
    }
  }, [isConnected, chamaCount, fetchChamas]);

  const formatCycleDuration = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    if (days === 7) return "Weekly";
    if (days === 30) return "Monthly";
    if (days === 14) return "Bi-Weekly";
    return `${days} days`;
  };

  if (!isConnected) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">Please connect your wallet to view Chamas</Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Available Chamas
      </Typography>

      <Grid container spacing={4}>
        {chamas.map((chama) => (
          <Grid item xs={12} sm={6} md={4} key={chama.id}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  {chama.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mt: 1, mb: 2 }}
                >
                  {chama.description}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2">
                    {chama.contributionCycle}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <MonetizationOn fontSize="small" color="action" />
                  <Typography variant="body2">
                    Deposit: {chama.depositAmount} ETH
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Groups fontSize="small" color="action" />
                  <Typography variant="body2">
                    Members: {chama.membersCount}/{chama.maxMembers}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setSelectedChama(chama);
                    setOpen(true);
                  }}
                  sx={{
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  Join
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <Fade in={open} timeout={500}>
          <Box>
            <DialogTitle sx={{ fontWeight: "bold" }}>
              {selectedChama?.name}
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" gutterBottom>
                {selectedChama?.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contribution Cycle:
                </Typography>
                <Typography variant="body2">
                  {selectedChama?.contributionCycle}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Deposit Amount:
                </Typography>
                <Typography variant="body2">
                  {selectedChama?.depositAmount} ETH
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contribution:
                </Typography>
                <Typography variant="body2">
                  {selectedChama?.contributionAmount} ETH
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Penalty:
                </Typography>
                <Typography variant="body2">
                  {selectedChama?.penaltyPercentage}%
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Maximum Members:
                </Typography>
                <Typography variant="body2">
                  {selectedChama?.maxMembers}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setOpen(false)} color="secondary">
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => joinChama?.()}
                disabled={!joinChama || isJoining}
              >
                {isJoining ? <CircularProgress size={24} /> : "Confirm Join"}
              </Button>
            </DialogActions>
          </Box>
        </Fade>
      </Dialog>
    </Container>
  );
};

export default JoinChama;
