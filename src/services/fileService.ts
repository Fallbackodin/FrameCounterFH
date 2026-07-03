import { Mp3Error } from "../utils/typings/error";

// Lookup table for MPEG-1 Layer III bitrate indexes.
// The header stores a 4-bit index, and this array maps that index to kbps.
const MPEG1_LAYER3_BITRATES = [
  0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0,
];

// Lookup table for MPEG-1 sample rate indexes.
// The header stores a 2-bit index, and this array maps that index to Hz.
const MPEG1_SAMPLE_RATES = [44100, 48000, 32000, 0];

// First byte of an MP3 frame sync header (all bits set)
const SYNC_BYTE = 0xff;
// Mask that checks the next 3 sync bits in the second header byte
const SYNC_MASK = 0xe0;
// Mask used to decode ID3v2 sync-safe integers (keep lower 7 bits)
const SYNC_SAFE_MASK = 0x7f;
// Expected MPEG version ID for MPEG-1
const MPEG1_VERSION_ID = 0x03;
// Expected layer ID for Layer III (MP3)
const LAYER3_ID = 0x01;
// Mask to extract the 4-bit bitrate index from the header
const BITRATE_MASK = 0x0f;
// Mask to extract the 2-bit sample rate index from the header
const SAMPLE_RATE_MASK = 0x03;
// Mask to extract the 1-bit padding flag from the header
const PADDING_MASK = 0x01;
// Multiplier used in MPEG-1 Layer III frame size calculation
const MPEG1_LAYER3_FRAME_SIZE_MULTIPLIER = 144000;
// ASCII byte values for the string "ID3"
const ID3_BYTE_I = 0x49;
const ID3_BYTE_D = 0x44;
const ID3_BYTE_3 = 0x33;

function readSyncSafeInteger(bytes: Buffer, offset: number): number {
  return (
    ((bytes[offset] & SYNC_SAFE_MASK) << 21) |
    ((bytes[offset + 1] & SYNC_SAFE_MASK) << 14) |
    ((bytes[offset + 2] & SYNC_SAFE_MASK) << 7) |
    (bytes[offset + 3] & SYNC_SAFE_MASK)
  );
}

function hasId3v2Header(buffer: Buffer): boolean {
  return (
    buffer.length >= 10 &&
    buffer[0] === ID3_BYTE_I &&
    buffer[1] === ID3_BYTE_D &&
    buffer[2] === ID3_BYTE_3
  );
}

function isMpeg1Layer3Header(byte2: number): boolean {
  const versionBits = (byte2 >> 3) & MPEG1_VERSION_ID;
  const layerBits = (byte2 >> 1) & LAYER3_ID;

  return versionBits === MPEG1_VERSION_ID && layerBits === LAYER3_ID;
}

function getMpeg1Layer3FrameLength(bitrate: number, sampleRate: number, paddingBit: number): number {
  return Math.floor((MPEG1_LAYER3_FRAME_SIZE_MULTIPLIER * bitrate) / sampleRate + paddingBit);
}

export function countFrameInMp3(buffer: Buffer): number {
  if (!Buffer.isBuffer(buffer)) {
    throw new Mp3Error("Invalid MP3 data provided", 400);
  }

  if (buffer.length < 4) {
    throw new Mp3Error("File is too small to contain an MP3 frame", 400);
  }

  let offset = 0;
  let frameCount = 0;

  if (hasId3v2Header(buffer)) {
    const tagSize = readSyncSafeInteger(buffer, 6);

    if (10 + tagSize > buffer.length) {
      throw new Mp3Error("Invalid ID3v2 tag size", 400);
    }

    offset = 10 + tagSize;
  }

  while (offset + 4 <= buffer.length) {
    const b1 = buffer[offset];
    const b2 = buffer[offset + 1];
    const b3 = buffer[offset + 2];

    if (b1 !== SYNC_BYTE || (b2 & SYNC_MASK) !== SYNC_MASK) {
      offset += 1;
      continue;
    }

    const bitrateIndex = (b3 >> 4) & BITRATE_MASK;
    const sampleRateIndex = (b3 >> 2) & SAMPLE_RATE_MASK;
    const paddingBit = (b3 >> 1) & PADDING_MASK;

    if (!isMpeg1Layer3Header(b2)) {
      offset += 1;
      continue;
    }

    const bitrate = MPEG1_LAYER3_BITRATES[bitrateIndex] || 0;
    const sampleRate = MPEG1_SAMPLE_RATES[sampleRateIndex] || 0;

    if (bitrate === 0 || sampleRate === 0) {
      offset += 1;
      continue;
    }

    const frameLength = getMpeg1Layer3FrameLength(bitrate, sampleRate, paddingBit);

    if (frameLength <= 0 || offset + frameLength > buffer.length) {
      break;
    }

    frameCount += 1;

    // Update offset to skip of the actual data of the current frame and skip to the next frame header
    offset += frameLength;
  }

  if (frameCount === 0) {
    throw new Mp3Error("No valid MPEG1 Layer III frames found", 400);
  }

  return frameCount;
}
