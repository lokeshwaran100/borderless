/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/borderless.json`.
 */
export type Borderless = {
  "address": "DKbHWxgtxsiN7SKsn7qBMgHL6ZjYGoZo6bZd5xK2YXSM",
  "metadata": {
    "name": "borderless",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  114,
                  100,
                  101,
                  114,
                  108,
                  101,
                  115,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "platformUsdcAccount",
          "type": "pubkey"
        },
        {
          "name": "platformUsdtAccount",
          "type": "pubkey"
        },
        {
          "name": "platformFeePer10000",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferDirect",
      "discriminator": [
        44,
        112,
        143,
        38,
        60,
        154,
        114,
        77
      ],
      "accounts": [
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  114,
                  100,
                  101,
                  114,
                  108,
                  101,
                  115,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "sender",
          "signer": true
        },
        {
          "name": "receiver"
        },
        {
          "name": "mint"
        },
        {
          "name": "senderTokenAccount",
          "writable": true
        },
        {
          "name": "receiverTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "receiver"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "platformTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "admin"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferWithSwap",
      "discriminator": [
        91,
        117,
        239,
        193,
        232,
        60,
        165,
        114
      ],
      "accounts": [
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  114,
                  100,
                  101,
                  114,
                  108,
                  101,
                  115,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "receiver"
        },
        {
          "name": "receiverTokenAccount",
          "writable": true
        },
        {
          "name": "platformTokenAccount",
          "writable": true
        },
        {
          "name": "tokenMintA"
        },
        {
          "name": "tokenMintB"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "whirlpoolProgram"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "whirlpool",
          "writable": true
        },
        {
          "name": "tokenOwnerAccountA",
          "writable": true
        },
        {
          "name": "tokenVaultA",
          "writable": true
        },
        {
          "name": "tokenOwnerAccountB",
          "writable": true
        },
        {
          "name": "tokenVaultB",
          "writable": true
        },
        {
          "name": "tickArray0",
          "writable": true
        },
        {
          "name": "tickArray1",
          "writable": true
        },
        {
          "name": "tickArray2",
          "writable": true
        },
        {
          "name": "oracle"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "sqrtPriceLimit",
          "type": "u128"
        }
      ]
    },
    {
      "name": "uninitialize",
      "discriminator": [
        28,
        100,
        144,
        220,
        7,
        87,
        131,
        90
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  114,
                  100,
                  101,
                  114,
                  108,
                  101,
                  115,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "borderlessState",
      "discriminator": [
        67,
        115,
        151,
        56,
        208,
        95,
        130,
        210
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "Unauthorized admin as signer"
    },
    {
      "code": 6001,
      "name": "incorrectPlatformWallet",
      "msg": "Incorrect platform wallet"
    }
  ],
  "types": [
    {
      "name": "borderlessState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "platformUsdcAccount",
            "type": "pubkey"
          },
          {
            "name": "platformUsdtAccount",
            "type": "pubkey"
          },
          {
            "name": "platformFeePer10000",
            "type": "u64"
          },
          {
            "name": "platformFeeCollected",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
