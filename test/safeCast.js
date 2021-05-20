/**
 * Copyright 2020 ChainSafe Systems
 * SPDX-License-Identifier: LGPL-3.0-only
 */
const TruffleAssert = require('truffle-assertions');

const SafeCaster = artifacts.require("SafeCaster");

contract('Utils - [SafeCast]', async accounts => {
    let SafeCasterInstance;

    const BN = (num) => web3.utils.toBN(num);

    beforeEach(async () => {
        SafeCasterInstance = await SafeCaster.new();
    });

    it('toUint200 should revert if passed value greater than 2**200 - 1', async () => {
        return TruffleAssert.fails(SafeCasterInstance.toUint200.estimateGas(BN(2).pow(BN(200))));
    });
});
