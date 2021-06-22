const Migrations = artifacts.require("Migrations");

module.exports = async () => {
    const migrations = await Migrations.new({gas: 8800999});
    Migrations.setAsDeployed(migrations);
  }