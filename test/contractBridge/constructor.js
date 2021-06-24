/**
 * Copyright 2020 ChainSafe Systems
 * SPDX-License-Identifier: LGPL-3.0-only
 */
const TruffleAssert = require('truffle-assertions');

const BridgeContract = artifacts.require("Bridge");

contract('Bridge - [constructor]', async accounts => {
    const chainID = 1;
    const initialRelayers = accounts.slice(0, 3);
    const initialRelayerThreshold = 2;

    const expectedBridgeAdmin = accounts[0];
    const someAddress = "0xcafecafecafecafecafecafecafecafecafecafe";
    const bytes32 = "0x0";
    let ADMIN_ROLE;
    
    let BridgeInstance;

    const BN = (num) => {
        return web3.utils.toBN(num);
    };

    beforeEach(async () => {
        BridgeInstance = await BridgeContract.new();
        await BridgeInstance.init(chainID, initialRelayers, initialRelayerThreshold, 0, 100);
        ADMIN_ROLE = await BridgeInstance.DEFAULT_ADMIN_ROLE()
    });

    it('Bridge should not allow to set initialRelayerThreshold above 255', async () => {
        BridgeInstance = await BridgeContract.new();
        await TruffleAssert.reverts(BridgeInstance.init(chainID, initialRelayers, 256, 0, 100));
    });

    it('Bridge should not allow to set fee above 2**128 - 1', async () => {
        BridgeInstance = await BridgeContract.new();
        await TruffleAssert.reverts(BridgeInstance.init(
            chainID, initialRelayers, initialRelayerThreshold, BN(2).pow(BN(128)), 100));
    });

    it('Bridge should not allow to set expiry above 2**40 - 1', async () => {
        BridgeInstance = await BridgeContract.new();
        await TruffleAssert.reverts(BridgeInstance.init(chainID, initialRelayers, initialRelayerThreshold, 0, BN(2).pow(BN(40))));
    });

    it('Bridge should not allow admin functions if not initialized', async () => {
        BridgeInstance = await BridgeContract.new();
        await TruffleAssert.reverts(BridgeInstance.adminPauseTransfers());
        assert.isFalse(await BridgeInstance.paused());
    });

    it('Bridge should allow admin functions after init', async () => {
        BridgeInstance = await BridgeContract.new();
        await BridgeInstance.init(chainID, initialRelayers, initialRelayerThreshold, 0, 100);
        await TruffleAssert.passes(BridgeInstance.adminPauseTransfers());
        assert.isTrue(await BridgeInstance.paused());
    });
});
