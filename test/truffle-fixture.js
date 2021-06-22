const Migrations = artifacts.require("Migrations");

module.exports = async () => {
    console.log(await Migrations.new.call({gas: 8800999}));
    const migrations = await Migrations.new({gas: 8800999});
    Migrations.setAsDeployed(migrations);
  }