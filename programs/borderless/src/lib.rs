use std::{mem::size_of};
use anchor_lang::prelude::*;
use anchor_lang::{
    solana_program::{
        // program::invoke,
        pubkey::Pubkey,
        // system_instruction::transfer,
    }
};
use anchor_spl::{
    token_interface::{Mint, TokenAccount},
    token,
    token::{Token},
    associated_token::AssociatedToken
};
use orca_whirlpools_client::instructions::{SwapCpiBuilder};

declare_id!("DKbHWxgtxsiN7SKsn7qBMgHL6ZjYGoZo6bZd5xK2YXSM");

#[program]
pub mod borderless {
    use super::*;

    // const ADMIN_WALLET: Pubkey = pubkey!("5EZKmFpo7vDxcjruzyM3q5PrQHaqx2VnSM9QasZUpVta");

    pub fn initialize(ctx: Context<Initialize>, platform_usdc_account: Pubkey, platform_usdt_account: Pubkey, platform_fee_per_10000: u64) -> Result<()> {
        // require!(ADMIN_WALLET == *ctx.accounts.admin.key, ErrorCode::Unauthorized);

        let state = &mut ctx.accounts.state;
        state.bump = ctx.bumps.state;
        state.platform_usdc_account = platform_usdc_account;
        state.platform_usdt_account = platform_usdt_account;
        state.platform_fee_per_10000 = platform_fee_per_10000;
        state.platform_fee_collected = 0;

        msg!("Initialize: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn uninitialize(ctx: Context<Uninitialize>) -> Result<()> {
        // require!(ADMIN_WALLET == *ctx.accounts.admin.key, ErrorCode::Unauthorized);

        msg!("Uninitialize: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn transfer_direct(
        ctx: Context<TransferDirect>,
        amount: u64,
    ) -> Result<()> {
        let state = &mut ctx.accounts.state;
        let platform_wallet_account = ctx.accounts.platform_wallet_account.key();
        require!(
            state.platform_usdc_account == platform_wallet_account ||
            state.platform_usdt_account == platform_wallet_account,
            ErrorCode::IncorrectPlatformWallet);

        let platform_fee = (amount * state.platform_fee_per_10000) / 10000;
        let receiver_amount = amount - platform_fee;

        // Transfer platform fee
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.sender_token_account.to_account_info(),
                    to: ctx.accounts.platform_wallet_account.to_account_info(),
                    authority: ctx.accounts.sender.to_account_info(),
                }
            ),
            platform_fee
        )?;

        // Transfer remaining to receiver
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.sender_token_account.to_account_info(),
                    to: ctx.accounts.receiver_token_account.to_account_info(),
                    authority: ctx.accounts.sender.to_account_info(),
                }
            ),
            receiver_amount
        )?;

        Ok(())
    }

    pub fn transfer_with_swap(
        ctx: Context<TransferWithSwap>,
        amount: u64,
    ) -> Result<()> {
        let state = &mut ctx.accounts.state;
        let platform_wallet_account = ctx.accounts.platform_wallet_account.key();
        require!(
            state.platform_usdc_account == platform_wallet_account ||
            state.platform_usdt_account == platform_wallet_account,
            ErrorCode::IncorrectPlatformWallet);

        let platform_fee = (amount * state.platform_fee_per_10000) / 10000;
        let receiver_amount = amount - platform_fee;

        // let current_balance_wsol = ctx.accounts.token_owner_account_a.amount;
		// if amount > current_balance_wsol {
		// 	let required_balance_wsol = amount - current_balance_wsol;
        //     msg!("required_balance_wsol: {0}", required_balance_wsol);
			
		// 	invoke(
		// 		&transfer(
		// 			&ctx.accounts.sender.key(),
		// 			&ctx.accounts.token_owner_account_a.key(),
		// 			required_balance_wsol,
		// 		),
		// 		&[
		// 			ctx.accounts.sender.to_account_info().clone(),
		// 			ctx.accounts.token_owner_account_a.to_account_info().clone(),
		// 			ctx.accounts.system_program.to_account_info().clone(),
		// 		],
		// 	)?;

        //     token::sync_native(CpiContext::new(
        //         ctx.accounts.token_program.to_account_info(),
        //         token::SyncNative {
        //             account: ctx.accounts.token_owner_account_a.to_account_info(),
        //         },
        //     ))?;
		// }

        // Swap the token
        // let sqrt_price_limit = orca_whirlpools_core::invert_sqrt_price(0);
        SwapCpiBuilder::new(&ctx.accounts.whirlpool_program.to_account_info())
            .token_program(&ctx.accounts.token_program.to_account_info())
            .token_authority(&ctx.accounts.token_authority.to_account_info())
            .whirlpool(&ctx.accounts.whirlpool.to_account_info())
            .token_owner_account_a(&ctx.accounts.token_owner_account_a.to_account_info())
            .token_vault_a(&ctx.accounts.token_vault_a.to_account_info())
            .token_owner_account_b(&ctx.accounts.token_owner_account_b.to_account_info())
            .token_vault_b(&ctx.accounts.token_vault_b.to_account_info())
            .tick_array0(&ctx.accounts.tick_array0.to_account_info())
            .tick_array1(&ctx.accounts.tick_array1.to_account_info())
            .tick_array2(&ctx.accounts.tick_array2.to_account_info())
            .oracle(&ctx.accounts.oracle.to_account_info())
            .amount(amount)
            // .other_amount_threshold(other_amount_threshold)
            // .sqrt_price_limit(sqrt_price_limit)
            .a_to_b(true)
            .amount_specified_is_input(true)
            .invoke()?;

        // Transfer platform fee
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.token_owner_account_b.to_account_info(),
                    to: ctx.accounts.platform_wallet_account.to_account_info(),
                    authority: ctx.accounts.sender.to_account_info(),
                }
            ),
            platform_fee
        )?;

        // Transfer remaining to receiver
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.token_owner_account_b.to_account_info(),
                    to: ctx.accounts.receiver_token_account.to_account_info(),
                    authority: ctx.accounts.sender.to_account_info(),
                }
            ),
            receiver_amount
        )?;

        Ok(())
    }
}


#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = size_of::<BorderlessState>() + 8,
        seeds = [b"borderless"],
        bump)
    ]
    pub state: Account<'info, BorderlessState>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Uninitialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        close = admin,
        seeds = [b"borderless"],
        bump)
    ]
    pub state: Account<'info, BorderlessState>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferDirect<'info> {
    #[account(
        mut,
        seeds = [b"borderless"],
        bump = state.bump,
    )]
    pub state: Account<'info, BorderlessState>,
    
    #[account(mut)]
    pub sender: Signer<'info>,
    
    #[account(mut)]
    pub sender_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(mut)]
    pub receiver_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(mut)]
    pub platform_wallet_account: InterfaceAccount<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct TransferWithSwap<'info> {
    #[account(
        mut,
        seeds = [b"borderless"],
        bump = state.bump,
    )]
    pub state: Account<'info, BorderlessState>,

    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(mut)]
    pub receiver_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub platform_wallet_account: InterfaceAccount<'info, TokenAccount>,

    pub token_mint_a: Box<InterfaceAccount<'info, Mint>>,

    pub token_mint_b: Box<InterfaceAccount<'info, Mint>>,

    pub system_program: Program<'info, System>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    /// CHECK:
    pub whirlpool_program: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,

    /// CHECK:
    pub token_authority: Signer<'info>,

    /// CHECK: init by whirlpool
    #[account(mut)]
    pub whirlpool: UncheckedAccount<'info>,

    /// CHECK:
    // #[account(mut)]
    // pub token_owner_account_a: UncheckedAccount<'info>,
    #[account(
        init_if_needed,
        payer = sender,
        associated_token::mint = token_mint_a,
        associated_token::authority = sender,
    )]
    pub token_owner_account_a: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: init by whirlpool
    #[account(mut)]
    pub token_vault_a: UncheckedAccount<'info>,

    /// CHECK:
    // #[account(mut)]
    // pub token_owner_account_b: UncheckedAccount<'info>,
    #[account(
        init_if_needed,
        payer = sender,
        associated_token::mint = token_mint_b,
        associated_token::authority = sender,
    )]
    pub token_owner_account_b: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: init by whirlpool
    #[account(mut)]
    pub token_vault_b: UncheckedAccount<'info>,

    /// CHECK:
    #[account(mut)]
    pub tick_array0: UncheckedAccount<'info>,

    /// CHECK:
    #[account(mut)]
    pub tick_array1: UncheckedAccount<'info>,

    /// CHECK:
    #[account(mut)]
    pub tick_array2: UncheckedAccount<'info>,

    /// CHECK:
    pub oracle: UncheckedAccount<'info>,

    // pub system_program: Program<'info, System>,

    // pub token_program_a: Program<'info, Token2022>,

    // pub token_program_b: Program<'info, token::Token>,

    // /// CHECK:
    // pub memo_program: UncheckedAccount<'info>,

    // #[account(
    //     mut,
    //     seeds = [b"token_config", admin.key().as_ref(), token_mint_a.key().as_ref()],
    //     bump)]
    // pub token_config: Account<'info, TokenConfig>,

    // // pub whirlpool_program: Program<'info, Whirlpool>,
    // /// CHECK:
    // pub whirlpool_program: UncheckedAccount<'info>,

    // // pub whirlpools_config: Box<Account<'info, WhirlpoolsConfig>>,
    // /// CHECK:
    // pub whirlpools_config: UncheckedAccount<'info>,

    // /// CHECK:
    // #[account(mut)]
    // pub tick_arraylower: UncheckedAccount<'info>,

    // /// CHECK:
    // #[account(mut)]
    // pub tick_arrayupper: UncheckedAccount<'info>,
}

#[account]
pub struct BorderlessState {
    bump: u8,
    pub platform_usdc_account: Pubkey,
    pub platform_usdt_account: Pubkey,
    pub platform_fee_per_10000: u64,
    pub platform_fee_collected: u64,
}


#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized admin as signer")]
    Unauthorized,
    #[msg("Incorrect platform wallet")]
    IncorrectPlatformWallet,
}