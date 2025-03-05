import { useContractWrite } from 'wagmi';
import ChamaFactoryABI from '../contracts/ChamaFactoryABI.json';

const CHAMA_FACTORY_ADDRESS = '0xEe35B29a7A7AE6B7fB565E862C7F275eB7DF48d2';

export const useCreateChama = (params) => {
  // Validate required parameters
  if (
    !params.name ||
    !params.description ||
    !params.depositAmount ||
    !params.contributionAmount ||
    params.penalty === undefined ||
    !params.maxMembers ||
    !params.cycleDuration
  ) {
    console.warn("useCreateChama is disabled: Missing required parameters", params);
    return { data: null, error: new Error("Missing required parameters"), isLoading: false, write: null };
  }

  const config = {
    mode: 'recklesslyUnprepared', // Use this mode if values are already pre-converted (e.g., BigInt)
    address: CHAMA_FACTORY_ADDRESS,
    abi: ChamaFactoryABI,
    functionName: 'createChama',
    args: [
      params.name,
      params.description,
      params.depositAmount,
      params.contributionAmount,
      BigInt(params.penalty),
      BigInt(params.maxMembers),
      BigInt(params.cycleDuration),
    ],
  };

  console.log("useCreateChama Config:", config);

  const { data, error, isLoading, write } = useContractWrite(config);

  if (error) {
    console.error("useCreateChama encountered an error:", error);
  }

  return { data, error, isLoading, write };
};
