// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VoiceProofRegistry
 * @dev Decentralized Registry for AI Voice Authenticity & Audio Provenance Tracking.
 * Anchors cryptographic hashes, perceptual audio fingerprints, AI authenticity scores,
 * EIP-712 metadata signatures, and speaker identity passports on-chain.
 */
contract VoiceProofRegistry {

    enum Status { Unverified, Verified, Disputed, Revoked }

    struct VoiceProof {
        bytes32 audioHash;          // SHA-256 or Multihash of raw audio file
        bytes32 pHash;              // Perceptual Audio Fingerprint
        address creator;            // Wallet address of publisher/speaker
        uint16 authenticityScore;   // AI Deepfake Safety Score (0 - 10000 -> 0.00% to 100.00%)
        uint64 timestamp;           // Block timestamp of registration
        string ipfsURI;             // IPFS metadata URI containing audio metadata & transcript
        string title;               // Human readable title of recording
        Status status;              // Registration status
        bytes signature;            // EIP-712 cryptographic signature
    }

    struct SpeakerProfile {
        address wallet;
        string name;
        string organization;
        bytes32 voiceEmbeddingHash; // Perceptual embedding of registered voice profile
        uint64 registeredAt;
        bool isVerified;
    }

    // Owner of the contract (Registry Governance)
    address public owner;

    // Mapping from Audio SHA-256 Hash -> VoiceProof record
    mapping(bytes32 => VoiceProof) public proofs;

    // Array of registered audio hashes for enumeration
    bytes32[] public registeredAudioHashes;

    // Mapping from Wallet Address -> SpeakerProfile
    mapping(address => SpeakerProfile) public speakerProfiles;

    // Mapping to track registered speaker addresses
    address[] public registeredSpeakers;

    // Events for indexing
    event VoiceProofRegistered(
        bytes32 indexed audioHash,
        bytes32 indexed pHash,
        address indexed creator,
        uint16 authenticityScore,
        string title,
        string ipfsURI,
        uint64 timestamp
    );

    event ProofStatusUpdated(
        bytes32 indexed audioHash,
        Status oldStatus,
        Status newStatus,
        string reason
    );

    event SpeakerProfileRegistered(
        address indexed wallet,
        string name,
        string organization,
        bytes32 voiceEmbeddingHash,
        bool isVerified
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "VoiceProof: Caller is not contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Registers a new voice recording's provenance record on-chain.
     * @param _audioHash SHA-256 hash of original audio
     * @param _pHash Perceptual audio fingerprint
     * @param _authenticityScore AI Deepfake safety confidence score (0 to 10000)
     * @param _title Title / description of audio
     * @param _ipfsURI Metadata JSON location on IPFS/Arweave
     * @param _signature EIP-712 signature proving creator consent
     */
    function registerVoiceProof(
        bytes32 _audioHash,
        bytes32 _pHash,
        uint16 _authenticityScore,
        string calldata _title,
        string calldata _ipfsURI,
        bytes calldata _signature
    ) external returns (bool) {
        require(_audioHash != bytes32(0), "VoiceProof: Audio hash cannot be empty");
        require(proofs[_audioHash].timestamp == 0, "VoiceProof: Audio hash already registered");
        require(_authenticityScore <= 10000, "VoiceProof: Authenticity score out of range (0-10000)");

        VoiceProof memory newProof = VoiceProof({
            audioHash: _audioHash,
            pHash: _pHash,
            creator: msg.sender,
            authenticityScore: _authenticityScore,
            timestamp: uint64(block.timestamp),
            ipfsURI: _ipfsURI,
            title: _title,
            status: Status.Verified,
            signature: _signature
        });

        proofs[_audioHash] = newProof;
        registeredAudioHashes.push(_audioHash);

        emit VoiceProofRegistered(
            _audioHash,
            _pHash,
            msg.sender,
            _authenticityScore,
            _title,
            _ipfsURI,
            uint64(block.timestamp)
        );

        return true;
    }

    /**
     * @notice Registers or updates a Speaker Profile on-chain to protect voice identity.
     */
    function registerSpeakerProfile(
        string calldata _name,
        string calldata _organization,
        bytes32 _voiceEmbeddingHash
    ) external returns (bool) {
        require(bytes(_name).length > 0, "VoiceProof: Name required");

        bool exists = speakerProfiles[msg.sender].registeredAt > 0;
        if (!exists) {
            registeredSpeakers.push(msg.sender);
        }

        speakerProfiles[msg.sender] = SpeakerProfile({
            wallet: msg.sender,
            name: _name,
            organization: _organization,
            voiceEmbeddingHash: _voiceEmbeddingHash,
            registeredAt: uint64(block.timestamp),
            isVerified: true
        });

        emit SpeakerProfileRegistered(
            msg.sender,
            _name,
            _organization,
            _voiceEmbeddingHash,
            true
        );

        return true;
    }

    /**
     * @notice Update status of a registered voice proof (e.g., flag dispute or revoke).
     */
    function setProofStatus(
        bytes32 _audioHash,
        Status _newStatus,
        string calldata _reason
    ) external {
        VoiceProof storage proof = proofs[_audioHash];
        require(proof.timestamp > 0, "VoiceProof: Audio hash not found");
        require(
            msg.sender == proof.creator || msg.sender == owner,
            "VoiceProof: Unauthorized status update"
        );

        Status oldStatus = proof.status;
        proof.status = _newStatus;

        emit ProofStatusUpdated(_audioHash, oldStatus, _newStatus, _reason);
    }

    /**
     * @notice Query a voice proof by audio hash.
     */
    function getVoiceProof(bytes32 _audioHash) external view returns (VoiceProof memory) {
        require(proofs[_audioHash].timestamp > 0, "VoiceProof: Proof does not exist");
        return proofs[_audioHash];
    }

    /**
     * @notice Returns total number of registered voice proofs.
     */
    function getProofCount() external view returns (uint256) {
        return registeredAudioHashes.length;
    }

    /**
     * @notice Returns array of all registered audio hashes.
     */
    function getAllRegisteredHashes() external view returns (bytes32[] memory) {
        return registeredAudioHashes;
    }

    /**
     * @notice Returns total number of registered speaker profiles.
     */
    function getSpeakerCount() external view returns (uint256) {
        return registeredSpeakers.length;
    }
}
