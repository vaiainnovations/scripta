export interface UserReward {
    type: string,
    amount: [{
        amount: number,
        denom: string
    }],
    timestamp: Date,
    hash: string,
    from?: {
        address: string,
        dtag: string
    }
}
