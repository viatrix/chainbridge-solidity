/**
 * Copyright 2020 ChainSafe Systems
 * SPDX-License-Identifier: LGPL-3.0-only
 */
 
 const TruffleAssert = require('truffle-assertions');

 const Helpers = require('../../helpers');

const BridgeContract = artifacts.require("Bridge");
const ERC721MintableContract = artifacts.require("ERC721MinterBurnerPauser");
const ERC721HandlerContract = artifacts.require("ERC721Handler");

contract('ERC721Handler - [Deposit Burn ERC721]', async (accounts) => {
    const relayerThreshold = 2;
    const chainID = 1;

    const depositerAddress = accounts[1];
    const recipientAddress = accounts[2];

    const tokenID = 1;

    let BridgeInstance;
    let ERC721MintableInstance1;
    let ERC721MintableInstance2;
    let ERC721HandlerInstance;

    let resourceID1;
    let resourceID2;
    let initialResourceIDs;
    let initialContractAddresses;
    let burnableContractAddresses;

    beforeEach(async () => {
        BridgeInstance = await BridgeContract.new();
        await BridgeInstance.init(chainID, [], relayerThreshold, 0, 100);
        ERC721MintableInstance1 = await ERC721MintableContract.new("token", "TOK", "");
        ERC721MintableInstance2 = await ERC721MintableContract.new("token", "TOK", "");

        resourceID1 = Helpers.createResourceID(ERC721MintableInstance1.address, chainID);
        resourceID2 = Helpers.createResourceID(ERC721MintableInstance2.address, chainID);
        initialResourceIDs = [resourceID1, resourceID2];
        initialContractAddresses = [ERC721MintableInstance1.address, ERC721MintableInstance2.address];
        burnableContractAddresses = [ERC721MintableInstance1.address]

        ERC721HandlerInstance = await ERC721HandlerContract.new();
        await ERC721HandlerInstance.init(BridgeInstance.address, initialResourceIDs, initialContractAddresses, burnableContractAddresses);
        await ERC721MintableInstance1.mint(depositerAddress, tokenID, "");
            
        await ERC721MintableInstance1.approve(ERC721HandlerInstance.address, tokenID, { from: depositerAddress });
        await BridgeInstance.adminSetResource(ERC721HandlerInstance.address, resourceID1, ERC721MintableInstance1.address);
        await BridgeInstance.adminSetResource(ERC721HandlerInstance.address, resourceID2, ERC721MintableInstance2.address);

        depositData = Helpers.createERCDepositData(tokenID, 20, recipientAddress);
    });

    it('[sanity] burnableContractAddresses should be marked true in _burnList', async () => {
        for (const burnableAddress of burnableContractAddresses) {
            const isBurnable = await ERC721HandlerInstance._burnList.call(burnableAddress);
            assert.isTrue(isBurnable, "Contract wasn't successfully marked burnable");
        }
    });

    it('[sanity] ERC721MintableInstance1 tokenID has been minted for depositerAddress', async () => {
        const tokenOwner = await ERC721MintableInstance1.ownerOf(tokenID);
        assert.strictEqual(tokenOwner, depositerAddress);
    });

    it('depositAmount of ERC721MintableInstance1 tokens should have been burned', async () => {
        await BridgeInstance.deposit(
            chainID,
            resourceID1,
            depositData,
            { from: depositerAddress }
        );

        const handlerBalance = await ERC721MintableInstance1.balanceOf(ERC721HandlerInstance.address);
        assert.strictEqual(handlerBalance.toNumber(), 0);

        const depositerBalance = await ERC721MintableInstance1.balanceOf(depositerAddress);
        assert.strictEqual(depositerBalance.toNumber(), 0);

        await TruffleAssert.fails(ERC721MintableInstance1.ownerOf(tokenID));
    });
});
