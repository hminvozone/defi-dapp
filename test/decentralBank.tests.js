const { assert } = require('chai');

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {
    let tether, rwd, decentralBank;

    before(async () => {
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);

        // Transfer all tokens to DecentralBank ( 1 million )
        await rwd.transfer(decentralBank.address, '1000000000000000000');

        // Transfer 100 mock tethers to Customer
        await tether.transfer(customer, '10000', {from: owner});
    })

    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name();
            assert.equal(name, 'Mock Tether Token');
        })
    })

    describe('Reward Token Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name();
            assert.equal(name, 'Reward Token');
        })
    })

    describe('Decentral Bank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank.name();
            assert.equal(name, 'Decentral Bank');
        })

        it('contract has tokens', async () => {
            let balance = await rwd.getBalance(decentralBank.address); 
            assert.equal(balance.toString(), '1000000000000000000');
        });
    })

    describe('Yield Farming', async() => {
        it('rewards tokens for staking', async () => {
            let result;

            result = await tether.getBalance(customer);
            assert.equal(result.toString(), '10000', 'customer mock wallet balance before staking');

            // check staking for customer
            await tether.approve(decentralBank.address, '10000', { from: customer });
            await decentralBank.depositTokens('10000', { from: customer });
            await tether.transferFrom(customer, decentralBank.address, '10000');

            // check updated balance of customer
            result = await tether.getBalance(customer);
            assert.equal(result.toString(), '0', 'customer mock wallet balance after staking');

            // check updated balance of decentral bank
            result = await tether.getBalance(decentralBank.address);
            assert.equal(result.toString(), '10000', 'decentralBank mock wallet balance after staking');

            // is staking status
            result = await decentralBank.getIsStaking(customer);
            assert.equal(result.toString(), 'true', 'customer is staking status after staking');

            // issue tokens
            await decentralBank.issueTokens({ from: owner });

            // ensure only the owner can issue tokens
            await decentralBank.issueTokens({ from: customer }).should.be.rejected;

            // unstake token
            await decentralBank.unStakeTokens({ from: customer });

            // check unstaking balance
            result = await tether.getBalance(customer);
            assert.equal(result.toString(), '10000', 'customer mock wallet balance after unstaking');

            // check updated balance of decentral bank
            result = await tether.getBalance(decentralBank.address);
            assert.equal(result.toString(), '0', 'decentralBank mock wallet balance after unstaking');

             // is staking status
             result = await decentralBank.getIsStaking(customer);
             assert.equal(result.toString(), 'false', 'customer is not staking after unstaking');
        });
    });
});