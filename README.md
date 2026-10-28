# Blockchain integration placeholder

This folder reserves a place for a future Solidity smart contract.

Suggested future contract responsibilities:
1. Register a SHA-256 digest and registration timestamp.
2. Emit an event for each registration.
3. Allow querying whether a digest has been registered.
4. Avoid storing raw audio or personal data on-chain.

Before implementing, define who can register hashes, whether duplicate hashes are allowed, how ownership claims are handled, and how contract events are verified. A blockchain registration does not prove the original audio was genuine.
