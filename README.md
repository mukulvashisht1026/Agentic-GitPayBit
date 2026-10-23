> Local starting point: `make demo` runs the isolated offline workflow. The older chatbot instructions below refer to a different layout; this repository has no root package.json. Use the component-specific setup near the end for the actual Next.js app.

# CDP AgentKit Langchain Extension Examples - Chatbot

This example demonstrates an agent setup as a terminal style chatbot with access to the full set of CDP AgentKit actions.

## Ask the chatbot to engage in the Web3 ecosystem!

- "Transfer a portion of your ETH to john2879.base.eth"
- "Deploy an NFT that will go super viral!"
- "Choose a name for yourself and register a Basename for your wallet"
- "Deploy an ERC-20 token with total supply 1 billion"

## Requirements

- Node.js 18+
- [CDP API Key](https://portal.cdp.coinbase.com/access/api)
- [OpenAI API Key](https://platform.openai.com/docs/quickstart#create-and-export-an-api-key)

### Checking Node Version

Before using the example, ensure that you have the correct version of Node.js installed. The example requires Node.js 18 or higher. You can check your Node version by running:

```bash
node --version
npm --version
```

## Installation

```bash
npm install
```

## Run the Chatbot

### Set ENV Vars

- Ensure the following ENV Vars are set:
  - "CDP_API_KEY_NAME"
  - "CDP_API_KEY_PRIVATE_KEY"
  - "OPENAI_API_KEY"
  - "NETWORK_ID" (Defaults to `base-sepolia`)

```bash
npm start
```

## License

Apache-2.0


Demo limit - 5 API call

emailId: example@gmail.com
totalCallAvailable: 10
totalCallsExec: 2
subscribed: true
subscriptionId: some-Id

authorization
## Offline demo and current scope

 The repository includes a Next.js frontend and Hardhat contracts, but the root chatbot installation instructions refer to a nonexistent root package.json. The offline demo shows an approval gate and synthetic payout status. This explicitly labeled demo is a local prototype; it does not
 contact external services, use credentials, or persist data between executions.
 Requires Python 3.10+ and optionally Make. From this repository root:

 ```sh
 make demo
 python3 demo.py --help
 # Pass options: make demo ARGS="--help"
 ```

 The root Dockerfile runs this offline demo only. With Docker running:

 ```sh
 docker build -t agentic-gitpaybit:demo .
 docker run --rm agentic-gitpaybit:demo
 ```

 Docker's first build needs access to the Python base image registry.

### Existing Next.js application

For the actual UI, run `cd frontend && npm ci && npm run dev` using Node 22+.
The MongoDB-backed code expects MONGODB_CONNECTION_URL; authentication uses
GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET and JWT_SECRET. GitHub tools also read
GITHUB_TOKEN. Supply development credentials separately, never demo strings as
working secrets. The root Dockerfile is the isolated offline demo, not the full UI.
Hardhat sources/configuration are in blockchain/; do not deploy contracts as part
of a local demo.


## Concrete remaining work

- [ ] Reconcile root chatbot instructions with the actual frontend and blockchain entrypoints.
- [ ] Provide a reviewed example environment file for GitHub OAuth, MongoDB, JWT signing, and agent/provider settings.
- [ ] Replace blockchain/package.json placeholder test script with escrow, authorization and withdrawal tests.
- [ ] Enforce review authorization and idempotent payouts server-side before sending funds.
- [ ] Validate type checking instead of relying on frontend build scripts that disable it.
