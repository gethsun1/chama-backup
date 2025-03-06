// Replace entire config.jsx with:
import { createConfig, http } from 'wagmi'
import { mainnet, scrollSepolia } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const chains = [scrollSepolia, mainnet]

export const config = createConfig(
  getDefaultConfig({
    chains,
    transports: {
      [scrollSepolia.id]: http('https://rpc.ankr.com/scroll_sepolia_testnet'),
      [mainnet.id]: http()
    },
    walletConnectProjectId: '3268c03bffd8e52c1b26452048d2ce4c',
    appName: 'Chama Dapp',
    appDescription: 'A Blockchain Table Banking Savings Dapp',
    appUrl: 'https://chama-dapp.vercel.app/',
    appIcon: 'https://i.ibb.co/0jZ4BfL/chama-logo.png'
  })
)

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
